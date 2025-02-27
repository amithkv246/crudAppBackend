require("dotenv").config()
require("./database/connection/connection")
const express = require("express")
const cors = require("cors")
const router = require("./router/router")
const server = express()
const port = 3000
server.use(express.json())
server.use(cors())
server.use(router)

server.listen(port, () => { console.log("Server is running on port number = " + port); })