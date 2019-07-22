const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

// router.get('/', checkAuth, (req, res, next) => {
//     // res.status(200).json({
//     //     message: 'Fetch Order'
//     // });
//     Order.find()
//         .select('product quantity _id')
//         .populate('product', 'name price')
//         .exec()
//         .then(docs => {
//             res.status(200).json({
//                 count: docs.length,
//                 orders: docs.map(doc => {
//                     return {
//                         _id: doc._id,
//                         product: doc.product,
//                         quantity: doc.quantity,
//                         request: {
//                             type: 'GET',
//                             url: 'http://localhost:3000/orders/' + doc._id
//                         }
//                     }
//                 })
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error:err
//             });
//         });
// });

// move the process to the controller
router.get('/', checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_orderId);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);


module.exports = router;