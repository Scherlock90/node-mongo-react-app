const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const connection = require('./connection/connection')
const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const product = require('./api/models/product')

connection()

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// app.use('/assets-test', express.static('assets-test'))

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());      

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productRoutes(express))
app.use('/orders', ordersRoutes(express))

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(3001)
console.log('start server on port 3001')