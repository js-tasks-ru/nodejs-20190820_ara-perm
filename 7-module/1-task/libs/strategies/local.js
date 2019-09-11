const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {session: false,
     usernameField: 'email'
    },
    async function(email, password, done) {
      try {
        const user = await User.findOne({email}, {}).select('+password +salt');
        
        if (!user) return done(null, false, {message: 'Нет такого пользователя'});
        
        if (!user.checkPassword(password)) return done(null, false, {message: 'Невереный пароль'});

        return done(null, user);

      } catch (err) {
        return done(err);
    }
      //done(null, false, 'Стратегия подключена, но еще не настроена');
    }
);
