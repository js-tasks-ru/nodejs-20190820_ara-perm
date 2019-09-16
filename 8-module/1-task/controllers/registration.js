const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const {email, displayName, password} = ctx.request.body;
    try {
        if (!await User.exists({email})) {
            const verificationToken = uuid();    
            const user = new User({email, displayName, verificationToken});
            await user.setPassword(password);
            await user.save();
            await sendMail({
                template: 'confirmation',
                locals: {token: verificationToken},
                to: email,
                subject: 'Подтвердите почту',
            });
            ctx.body = {status: 'ok'};
                
        } else {
            ctx.status = 400;
            ctx.body = { errors: { email: 'Такой email уже существует' } };
        };
        return next();
    } catch (err){
        console.log(err);
    }
};

module.exports.confirm = async (ctx, next) => {
    
    const {verificationToken} = ctx.request.body;
    const user = await User.findOne({verificationToken});
    if (user) {
        user.verificationToken = undefined;
        await user.save();
        const token = uuid();
        ctx.body = {token};
    } else {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }
    
    
    return next();
};