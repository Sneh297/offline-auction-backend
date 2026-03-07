const mongoose = require('mongoose')

const licenseSchema = new mongoose.Schema({
    uuid :{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: '2d' // License will expire after 1 day
    }
})

const License = mongoose.model('License', licenseSchema)

module.exports = License
