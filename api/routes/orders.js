module.exports = function(app) {
    const router = app.Router()

    router.get('/', (req, res, next) => {
        res.status(200).json({
            message: 'Handling GET request to /orders'
        })
    })
    
    router.get('/:orderId', (req, res, next) => {
        res.status(200).json({
            message: 'Special ID',
            orderId: req.params.orderId
        })
    })
    
    router.post('/', (req, res, next) => {
        const { productId, quantity } = req.body
        const order = {
            productId,
            quantity
        }
        res.status(201).json({
            message: 'Handling POST request to /orders',
            order
        })
    })
    
    router.patch('/:orderId', (req, res, next) => {
        res.status(200).json({
            message: 'Updated orders',
            orderId: req.params.orderId
        })
    })
    
    router.delete('/:orderId', (req, res, next) => {
        res.status(200).json({
            message: 'Deleted orders',
            orderId: req.params.orderId
        })
    })

    return router
}
