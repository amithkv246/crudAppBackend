const express = require('express')
const { firstGet, firstPost, register, login, updateUser } = require('../controller/controller')
const { verifyToken } = require('../middleWare/middleWare')
const router = new express.Router()
router.get('/firstGet/:id', firstGet)
router.post('/firstPost', firstPost)
router.post('/register', register)
router.post('/login', login)
router.post('/updateUser', verifyToken, updateUser)


module.exports = router