const Product = require('../models/product')
const mongoose = require('mongoose')

module.exports = function(app) {
    const router = app.Router()

    router.get('/', (req, res, next) => {
        Product.find()
            .exec()
            .then(docs => {
                console.log(docs)
                docs.length >= 0
                    ? res.status(200).json(docs)
                    : res.status(500).json({ message: 'No entries foundproducts' })
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err })
            })
    })

    router.get('/:productId', (req, res, next) => {
        const id = req.params.productId

        Product.findById(id)
            .exec()
            .then(doc => {
                console.log("From database", doc)
                doc
                    ? res.status(200).json(doc)
                    : res.status(404).json({ message: 'No valid id' })
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err })
            })

    })

    router.post('/', (req, res, next) => {
        const { name, price } = req.body
        const createdProduct = new Product({
            _id: new mongoose.Types.ObjectId,
            name,
            price
        })

        createdProduct
            .save()
            .then(result =>{
                console.log(result)
                res.status(201).json({
                    message: 'Handling POST request to /products',
                    createdProduct: result
                })
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err })
            })

    })

    router.patch('/:productId', (req, res, next) => {
        const id = req.params.productId
        const updateOps = {}
        for(const ops of req.body) {
            updateOps[ops.propName] = ops.value
        }

        Product.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                console.log(result)
                res.status(200).json(result)
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err })
            })
    })

    router.delete('/:productId', (req, res, next) => {
        const id = req.params.productId

        Product.remove({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err })
            })

    })

    return router
}
