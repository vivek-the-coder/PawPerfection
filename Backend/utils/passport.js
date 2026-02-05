import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../db/prisma.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async function verify(accessToken, refreshToken, profile, cb) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { googleId: profile.id }
    });

    if (existingUser) {
      return cb(null, existingUser);
    }

    // Try to find by email if user signed up via normal email before
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: profile.emails[0].value }
    });

    if (existingEmailUser) {
      // Link Google ID to existing user
      const updatedUser = await prisma.user.update({
        where: { id: existingEmailUser.id },
        data: { googleId: profile.id }
      });
      return cb(null, updatedUser);
    }

    // Create new Google user
    const newUser = await prisma.user.create({
      data: {
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      }
    });

    return cb(null, newUser);

  } catch (err) {
    return cb(err);
  }
}));

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
