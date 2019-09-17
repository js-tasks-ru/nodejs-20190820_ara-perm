const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
    if (ctx.user) {
    const {phone, address, product} = ctx.request.body;
    const order = new Order({user: ctx.user.id, product, phone, address});
    await order.populate('product').execPopulate();
    await order.save();
    await sendMail({
        template: 'order-confirmation',
        locals: {id: order.product.id,
                product},
        to: ctx.user.email,
        subject: 'Подтвердите почту',
    });
    ctx.body = {order: order.id}
    } else {
        ctx.status = 401;
    }
    return next();

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    if (ctx.user) {
        const arr = await Order.find({user: ctx.user.id}).populate('product');
        ctx.body = {orders: arr};
    } else
    {
        ctx.status = 401;
    }
    return next();

};
