const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: [true, "required bookName"],
        //unique: true,
        trim: true
    },
    category: {
        type: String,
        required: [true, "required category"],
        trim: true

    },
    rentPerDay: {
        type: String,
        required: [true, "required rentPerDay"],
        trim:true

    },

    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    
    
}, { timestamps: true })
module.exports = mongoose.model('BOOKS', bookSchema)