// Backend/routes/userRoutes.js
import { Router } from 'express';
import { googleAuthCallback } from '../controllers/userCTRL.js';
import passport from 'passport';

const router = Router();

// Step 1: Initiates the Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Google redirects back here. This MUST match the Google Console URI exactly.
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuthCallback
);

export default router;
