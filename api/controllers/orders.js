const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error:err
            });
        });
}

exports.orders_create_order = async (req, res, next) => {
    const products = await req.body.products;
    let total = 0;

    const productData = await Product.find({
        _id: {
            $in: products
        }
    });

    total = productData.reduce((accumulate, item) => {
        accumulate += item.price;
        return accumulate;
    }, 0);

    const order = new Order({
        product: products,
        total: total
    });
    try{
        const result = await order.save();
        return res.status(201).json({
            message: 'Success Created Product',
            createdOrder: {
                data: result,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/orders/" + result._id
                }
            }
        });
    }catch(err) {
        next(err);
        return err;
    }
}

exports.orders_update = async(req, res, next) => {
    const products = await req.body.products;
    let total = 0;

    const productData = await Product.find({
        _id: {
            $in: products
        }
    });

    total = productData.reduce((accumulate, item) => {
        accumulate += item.price;
        return accumulate;
    }, 0);

    const order = ({
        product: products,
        total: total
    });
    console.log(order);
    try{
        const result =  await Order.findOneAndUpdate({ _id: req.params.orderId }, order, { new: true })
        return res.status(200).json({
            message: 'Success Updated Order',
            data: result,
            request: {
                type: 'GET',
                url: "http://localhost:3000/orders/" + result._id
            }
        });
    } catch(err){
        next(err);
        return err;
    }
  };

exports.orders_get_orderId = (req, res, next) => {
Order.findById(req.params.orderId)
    .populate('product', 'name price')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order Not Found'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
}

exports.orders_findby_product = async(req, res, next) => {
    try {
      const ordersData = await Order.find({ product : req.params.productId })
                                    // .populate('product')
                                    .exec();
      console.log(ordersData);
      return res.json(ordersData);
    } catch(err){
      return res.send(err);
    }
  
  };

exports.orders_delete_order = (req, res, next) => {
Order.remove({ _id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order Deleted",
            request: {
                type: "GET",
                url: "http://localhost:3000/orders",
                body: { productId: 'ID', quantity: 'Number'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}