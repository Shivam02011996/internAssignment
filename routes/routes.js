const express = require('express')
const router = express.Router()

const bookController = require('../controllers/bookController')
const transactionController = require('../controllers/transactionController')




//book api
router.post('/books', bookController.createBook)
router.get('/books', bookController.getBooks)


//transaction api
router.post('/transactions', transactionController.createTransaction)
router.get('/transactions', transactionController.getTransaction)
router.put('/transactions/:transactionId', transactionController.updateTransaction)




module.exports = router