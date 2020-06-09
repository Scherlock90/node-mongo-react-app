const Product = require('../models/product')
const mongoose = require('mongoose')

module.exports = function(router) {
    router.get('/', (req, res, next) => {
        Product.find()
            .select('name price _id')
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => ({
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3001/products/' + doc._id
                        }
                    }))
                }
                res.status(200).json(response)
                // docs.length >= 0
                //     ? res.status(200).json(docs)
                //     : res.status(500).json({ message: 'No entries foundproducts' })
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
                doc
                    ? res.status(200).json({
                        product: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3001/products'
                        }
                    })
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
            .then(result => {
                res.status(201).json({
                    message: 'Created product successfully',
                    createdProduct: {
                        name: result.name,
                        price: result.price,
                        _id: result._id,
                        request: { 
                            type: 'GET',
                            url: 'http://localhost:3001/products/' + result._id
                        }
                    }
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
                res.status(200).json({
                    message: 'Product updated',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/products/' + id
                    }
                })
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
                res.status(200).json({
                    message: 'Product deleted',
                    request: { 
                        type: 'POST',
                        url: 'http://localhost:3001/products',
                        body: { name: 'String', price: 'Number' }
                    }
                })
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err })
            })

    })

    return router
}
