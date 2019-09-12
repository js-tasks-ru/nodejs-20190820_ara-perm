const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  //try {
    if (!email) {done(null, false, `Не указан email`); return;}

    const tmpUser = {
      email,
      displayName
    };
    
    let user = await User.find({email});
   
    if (user) {
       done (null, user);
    } else
    { 
      user = new User({
        email, 
        displayName
      });
      await user.save();
    }
    /*const user = await User.findOneAndUpdate({email}, tmpUser, {
      new: true,
      upsert: true
    });*/
    //done(null, user);
 // } catch (e) {
    //done(e)
  //}

   //done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
