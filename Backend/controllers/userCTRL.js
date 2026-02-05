import prisma from '../db/prisma.js';
import { hash, compare } from "bcrypt";
import { generateTokens, verifyRefreshToken } from "../utils/jwtUtils.js";
import { sendLoginNotificationEmail } from "../utils/emailService.js";
import { userValidationSchema, loginValidationSchema } from "../validations/signup.validations.js";

export const createUser = async (req, res) => {
  try {
    // Validate input using Zod schema
    console.log("Creating user with body:", req.body);
    const validateResult = userValidationSchema.safeParse(req.body);
    if (!validateResult.success) {
      const errors = validateResult.error.errors.map(err => err.message);
      console.log("Validation failed:", errors);
      return res.status(400).json({ msg: "Validation failed", errors });
    }

    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);

    // Create user first
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Generate tokens for the new user
    const { accessToken, refreshToken } = generateTokens(newUser.id);

    // Update user with refresh token
    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken: refreshToken }
    });

    return res.status(201).json({
      msg: "User created successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("User creation error:", error);
    import('fs').then(fs => {
      fs.appendFileSync('error.log', `[${new Date().toISOString()}] User creation error: ${error.name}: ${error.message} \nStack: ${error.stack}\n`);
    });
    return res.status(500).json({ msg: "User creation failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const loginValidation = loginValidationSchema.safeParse(req.body);
    if (!loginValidation.success) {
      const errors = loginValidation.error.errors.map(err => err.message);
      return res.status(400).json({ msg: "Validation failed", errors });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // CRITICAL FIX: Add await to bcrypt.compare()
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Update user's refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken }
    });

    // Send login notification email
    try {
      await sendLoginNotificationEmail({
        userEmail: user.email,
        userName: user.name || user.email.split('@')[0],
        loginDate: new Date(),
        ip: req.ip,
        device: req.headers['user-agent'],
        location: 'Unknown'
      });
      console.log('Login notification email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('Failed to send login notification email:', emailError);
      // Don't fail the login if email fails
    }

    return res.status(200).json({
      msg: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Login failed" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Clear refresh token from database
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded) {
        await prisma.user.update({
          where: { id: decoded.id },
          data: { refreshToken: null }
        });
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ msg: "Logout failed" });
  }
};

// Refresh token endpoint
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token is required" });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // Check if user exists and token matches
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    return res.status(200).json({
      msg: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ msg: "Token refresh failed" });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
      // select: { password: false, refreshToken: false } // Prisma handles select differently
    });
    // Manual exclusion or adjust query
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Remove sensitive fields manually or via select
    const { password, refreshToken, ...userProfile } = user;

    return res.status(200).json({
      msg: "Profile retrieved successfully",
      user: userProfile
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ msg: "Failed to get profile" });
  }
};

// Google OAuth callback handler
export const googleAuthCallback = async (req, res) => {
  try {
    // User is already authenticated by passport
    const user = req.user;

    if (!user) {
      return res.status(401).json({ msg: "Authentication failed" });
    }

    // Generate JWT tokens for the authenticated user
    const { accessToken, refreshToken } = generateTokens(user._id || user.id);
    // Passport user object might still have _id if from Mongoose strategy? 
    // Wait, passport config needs update too? Assuming ID is available.

    // Update user's refresh token in database
    await prisma.user.update({
      where: { id: user.id || user._id },
      data: { refreshToken: refreshToken }
    });


    // Send login notification email for Google OAuth login
    try {
      await sendLoginNotificationEmail({
        userEmail: user.email,
        userName: user.name || user.email.split('@')[0],
        loginDate: new Date(),
        ip: req.ip,
        device: req.headers['user-agent'],
        location: 'Unknown'
      });
      console.log('Login notification email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('Failed to send login notification email:', emailError);
      // Don't fail the login if email fails
    }

    // Redirect to frontend with tokens as URL parameters
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${user.id || user._id}&email=${encodeURIComponent(user.email)}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error("Google OAuth callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=authentication_failed`);
  }
}; 
