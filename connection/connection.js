const mongoose = require('mongoose')

const password = process.env.MONGO_ATLAS_PW

module.exports = function() {
    const uri = 'mongodb+srv://SeN:' + password + '@cluster0-6y8se.mongodb.net/test?retryWrites=true&w=majority'
    
    try {
        mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            connectTimeoutMS: 3000,
            serverSelectionTimeoutMS: 5000,
            keepAlive: true,
            keepAliveInitialDelay: 300000
        })
    } catch (err) {
        console.error(err)
    }
}