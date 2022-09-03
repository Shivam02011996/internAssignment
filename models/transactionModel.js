const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const transactionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "required title"],
        trim: true
    },
    
    bookId: {
        type: objectId,
        required: [true, "required bookId"],
        ref: 'BOOKS',
        trim:true

    },

    previouslyIssued: {
        type: String,
        required: [true, "required previouslyIssued"],
        trim: true

    },

    currentlyIssued: {
        type: String,
        required: [true, "required currentlyIssued"],
        trim: true

    },

    totalCount: {
        type: Number,
        default: 0,
        comment: {
            type: Number
        },
        trim:true
    },

    
    issued: {
        type: Date,
        required: [true, "required date format(yyyy-mm-dd)"],
        default:Date.now(),
        format:'YYYY-MM-DD'

    },

    returned: {
        type: Date,
        required: [true, "required date format(yyyy-mm-dd)"],
        default: Date.now(),
        format: 'YYYY-MM-DD'
    },
    

}, { timestamps: true })
module.exports = mongoose.model('TRANSACTIONS', transactionSchema)