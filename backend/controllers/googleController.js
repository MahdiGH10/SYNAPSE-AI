const { generateToken } = require('../utils/tokenUtils');

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback - completes authentication
 * @access  Public
 */
exports.googleCallback = async (req, res) => {
  try {
    // User is authenticated via Passport
    const user = req.user;

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/google-callback?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};

/**
 * @route   GET /api/auth/google/failure
 * @desc    Google OAuth failure handler
 * @access  Public
 */
exports.googleFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
};
