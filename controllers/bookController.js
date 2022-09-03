const bookModel = require('../models/bookModel')

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}



const createBook = async function (req, res) {
    try {
        let bookData = req.body

        if (Object.keys(bookData) == 0) {
            return res.status(400).send({ status: false, msg: "bookDetails is required " })
        }
        if (!isValid(bookData.bookName)) {
            return res.status(400).send({ status: false, msg: "required bookName " })

        }
        let dupBookName = await bookModel.findOne({ bookName: bookData.bookName })
        if (dupBookName) {
            return res.status(400).send({ status: false, msg: "this bookName is already register" })
        }
        
        if (!isValid(bookData.category)) {
            return res.status(400).send({ status: false, msg: "category required" })
        }

        if (!isValid(bookData.rentPerDay)) {
            return res.status(400).send({ status: false, msg: "required rentPerDay" })

        }
        
        
        

        let data = await bookModel.create(bookData)
        let result = {
            _id: data._id,
            bookName: data.bookName,
            category: data.category,
            rentPerDay: data.rentPerDay,            
            
        }
        return res.status(201).send({ status: true, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


const getBooks = async function (req, res) {
    try {
        let queryParam = req.query;
        if (Object.keys(queryParam).length == 0) {
            let bookData = await bookModel.find({ isDeleted: false }).sort({ bookName: 1 }).select({ bookName: 1,  category: 1, rentPerDay: 1  })
            if (!bookData) {
                return res.status(404).send({ status: false, msg: "book not found" })
            }
            bookData['data'] = bookData
            return res.status(200).send({ status: true, msg: "success", data: bookData })

        }
        
        //category validation
        if (Object.keys(queryParam).includes('category')) {
            let validCat = await bookModel.findOne({ category: queryParam.category })
            if (!validCat) {
                return res.status(400).send({ status: false, msg: "category data not valid" })
            }
        }
        
        let filterCondition = { isDeleted: false }
        if (Object.keys(queryParam)) {
            let { bookName, category, rentPerDay } = queryParam
            if (isValid(bookName)) {
                filterCondition['bookName'] = bookName.trim()
            }
            if (isValid(category)) {
                filterCondition['category'] = category.trim()
            }
            if (isValid(rentPerDay)) {
                filterCondition['rentPerDay'] = rentPerDay.trim()
            }
        }
        let filterBook = await bookModel.find(filterCondition).sort({ bookName: 1 }).select({ bookName: 1,  userId: 1, category: 1,rentPerDay: 1})
        if (!filterBook) {
            return res.status(404).send({ status: false, msg: "book not found" })
        }
        //filterBook['data'] = filterBook
        return res.status(200).send({ status:true, msg: "success", data: filterBook })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }


}


module.exports.createBook = createBook
module.exports.getBooks = getBooks
