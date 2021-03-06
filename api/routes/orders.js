const Order = require('../models/order');
const Product = require('../models/product');

module.exports = function(router, mongoose) {
    router.get('/', (req, res, next) => {
        Order
            .find()
            .select('product quantity _id')
            .exec()
            .then(docs => {
                res.status(200).json({
                    count: docs.length,
                    order: docs.map(doc => ({
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3001/orders/' + doc._id
                        }                        
                    })),
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
    })
    
    router.get('/:orderId', (req, res, next) => {
        Order.findById(req.params.orderId)
            .exec()
            .then(order => {
                if(!order) {
                    return res.status(404).json({ message: 'Order not found' })
                }
               res.status(200).json({
                   order,
                   request: { 
                       type: 'GET',
                       url: 'http://localhost:3001/orders/'
                   }
               })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
    })
    
    router.post('/', (req, res, next) => {
        Product.findById(req.body.productId)
            .then(product => {
                if(!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    })
                }
                const order = new Order ({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
        
                return order.save()                    
            })
            .then(result => {
                res.status(201).json({
                    message: 'Order stored',
                    createdOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/orders/' + result._id
                    }
                });
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })        
    })
    
    router.patch('/:orderId', (req, res, next) => {
        res.status(200).json({
            message: 'Updated orders',
            orderId: req.params.orderId
        })
    })
    
    router.delete('/:orderId', (req, res, next) => {
        Order
            .remove({ _id: req.params.orderId })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Order deleted',
                    request: { 
                        type: 'POST',
                        url: 'http://localhost:3001/orders/',
                        body: {
                            productId: "ID",
                            quantity: "Number"
                        }
                    }
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
    })

    return router
}
