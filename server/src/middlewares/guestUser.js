const User = require('../models/User');

async function attachGuestUser(req, res, next) {
  try {
    const guest = await User.findOneAndUpdate(
      { email: 'guest@summara.local' },
      {
        $setOnInsert: {
          name: 'Guest User',
          email: 'guest@summara.local',
          password: 'guest-user'
        }
      },
      { new: true, upsert: true }
    );

    req.user = guest;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { attachGuestUser };
