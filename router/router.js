const express = require('express')
const { firstGet, firstPost, register, login, updateUser, adPost } = require('../controller/controller')
const { verifyToken } = require('../middleWare/middleWare')
const multerConfig = require('../middleWare/multerMiddleWare')
const router = new express.Router()
router.get('/firstGet/:id', firstGet)
router.post('/firstPost', firstPost)
router.post('/register', register)
router.post('/login', login)
router.post('/updateUser', verifyToken, updateUser)
router.post('/adPost', multerConfig.array("images",20), adPost)

module.exports = router
