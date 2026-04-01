const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
    
        let user = await User.findOne({ githubId: profile.id });

        // ✅ Create if not exists
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            firstName: profile.username,
            lastName: "GitHubUser",
            email: profile.emails?.[0]?.value || null,
            password: null,
            role: "student"
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
