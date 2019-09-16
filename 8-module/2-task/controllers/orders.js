const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
    const {phone, address, product} = ctx.request.body;
    //ctx.user
    const order = new Order({user: ctx.user.id, product, phone, address});
    await order.save();
    await sendMail({
        template: 'order-confirmation',
        locals: {token: verificationToken},
        to: ctx.user.email,
        subject: 'Подтвердите почту',
    });

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
};
