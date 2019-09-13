const User = require('../../models/User');
const passport = require('koa-passport');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    
    if (!email) {done(null, false, `Не указан email`); return;}

    const tmpUser = {
      email,
      displayName
    };
    
    let user = await User.findOneAndUpdate({email}, tmpUser, {
      new: true,
      upsert: true,
      runValidators: true
    });
    
    done (null, user);
     
  } catch (e) {
    done(e, false);
  }
};
