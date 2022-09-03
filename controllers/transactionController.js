const bookModel = require('../models/bookModel')
const transactionModel = require('../models/transactionModel')
const ObjectId = require('mongoose').Types.ObjectId

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}


const createTransaction = async function (req, res) {
    try {
        let transactionData = req.body

        if (Object.keys(transactionData) == 0) {
            return res.status(400).send({ status: false, msg: "transactionDetails is required " })
        }
        if (!isValid(transactionData.title)) {
            return res.status(400).send({ status: false, msg: "required title " })

        }
        let dupTitle = await transactionModel.findOne({ title: transactionData.title })
        if (dupTitle) {
            return res.status(400).send({ status: false, msg: "this title is already register" })
        }
        
        if (!isValid(transactionData.bookId)) {
            return res.status(400).send({ status: false, msg: "bookId required" })
        }
        if (!ObjectId.isValid(transactionData.bookId)) {
            return res.status(400).send({ status: false, msg: "bookId is invalid " })
        }

        

        let data = await transactionModel.create(transactionData)
        let result = {
            _id: data._id,
            title: data.title,
            bookId: data.bookId,
            previouslyIssued: data.previouslyIssued,
            currentlyIssued: data.currentlyIssued,
            totalCount: data.totalCount,
            issued: data.issued,
            returned: data.returned,
            
        }
        return res.status(201).send({ status: true, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}






const getTransaction = async function (req, res) {
    try {
        let queryParam = req.query;
        if (Object.keys(queryParam).length == 0) {
            let transactionData = await transactionModel.find({ isDeleted: false }).sort({ title: 1 }).select({ title: 1,  bookId: 1, currentlyIssued: 1, previouslyIssued: 1, totalCount: 1, issued: 1, returned: 1})
            if (!transactionData) {
                return res.status(404).send({ status: false, msg: "transaction not found" })
            }
            transactionData['data'] = transactionData
            return res.status(200).send({ status: true, msg: "success", data: transactionData })

        }
        //bookId Validation
        if (Object.keys(queryParam).includes('bookId')) {
            if (!ObjectId.isValid(queryParam.bookId)) {
                return res.status(400).send({ status: false, msg: "bookId is not valid" })
            }
        }
        //category validation
        if (Object.keys(queryParam).includes('category')) {
            let validCat = await transactionModel.findOne({ category: queryParam.category })
            if (!validCat) {
                return res.status(400).send({ status: false, msg: "category data not valid" })
            }
        }
        
        let filterCondition = { isDeleted: false }
        if (Object.keys(queryParam)) {
            let { bookId, category, rentPerDay } = queryParam
            if (isValid(userId)) {
                filterCondition['bookId'] = bookId.trim()
            }
            if (isValid(category)) {
                filterCondition['category'] = category.trim()
            }
            if (isValid(rentPerDay)) {
                filterCondition['rentPerDay'] = rentPerDay.trim()
            }
        }
        let filterTransaction = await transactionModel.find(filterCondition).sort({ title: 1 }).select({ title: 1,  bookId: 1, currentlyIssued: 1, previouslyIssued: 1, totalCount: 1, issued: 1, returned: 1 })
        if (!filterTransaction) {
            return res.status(404).send({ status: false, msg: "transaction not found" })
        }
        //filterTransaction['data'] = filterTransaction
        return res.status(200).send({ status:true, msg: "success", data: filterTransaction })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }


}

const updateTransaction = async function (req, res) {
    try {
        let transactionId = req.params.transactionId
        let { title, bookId, issued, returned } = req.body
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "required title" })

        }
        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "required bookId" })

        }
        if (!isValid(issued)) {
            return res.status(400).send({ status: false, msg: "required issued" })

        }
        if (!isValid(returned)) {
            return res.status(400).send({ status: false, msg: "required returned" })

        }

        
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is required" })
        }
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(issued)) {
            return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })

        }
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(returned)) {
            return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })

        }
        let updateTransactionData = { title: title, bookId: bookId, issued: issued, returned: returned }
        let updated = await transactionModel.findOneAndUpdate({ _id: transactionId, isDeleted: false }, { $set: updateTransactionData }, { new: true })
        if (!updated) {
            return res.status(404).send({ status: false, msg: "data not found " })
        }
        return res.status(200).send({ status: false, data: updated })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createTransaction = createTransaction
module.exports.getTransaction = getTransaction
module.exports.updateTransaction = updateTransaction