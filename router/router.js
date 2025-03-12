const express = require('express')
const { firstGet, firstPost, register, login, updateUser, adPost, getUserAds, getUserDetails } = require('../controller/controller')
const { verifyToken } = require('../middleWare/middleWare')
const multerUpdateUserConfig = require('../middleWare/multerMiddleWare/multerUpdateUser')
const multerAdPostConfig = require('../middleWare/multerMiddleWare/multerAdPost')
const router = new express.Router()
router.get('/firstGet/:id', firstGet)
router.post('/firstPost', firstPost)
router.post('/register', register)
router.post('/login', login)
router.post('/updateUser', verifyToken, multerUpdateUserConfig.array("dp", 1), updateUser)
router.post('/adPost', verifyToken, multerAdPostConfig.array("images", 20), adPost)
router.get('/getUserAds/:userId', getUserAds);
router.get('/getUserDetails/:userId', getUserDetails);

module.exports = router
