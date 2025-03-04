require("dotenv").config()
require("./database/connection/connection")
const path = require('path');
const express = require("express")
const cors = require("cors")
const router = require("./router/router")
const server = express()
const port = 3000
server.use(express.json())
server.use(cors())
server.use(router)
server.use('/images', express.static(path.join(__dirname, 'images')));

server.listen(port, () => { console.log("Server is running on port number = " + port); })