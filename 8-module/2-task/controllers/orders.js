const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
    
    const {phone, address, product} = ctx.request.body;
    const order = new Order({user: ctx.user.id, product, phone, address});
    await order.populate('product').execPopulate();
    await order.save();
    await sendMail({
        template: 'order-confirmation',
        locals: {
                    id:      order.product.id,
                    product: {title: order.product.title}
                },
        to: ctx.user.email,
        subject: 'Подтверждение создания заказа',
    });
    ctx.body = {order: order.id}
    return next();

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({user: ctx.user.id}).populate('product');
    ctx.body = {orders: orders.map(mapOrder)};
    return next();
};
