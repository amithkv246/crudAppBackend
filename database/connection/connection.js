const mongoose = require("mongoose");

const connectionString = process.env.dbConnectionString

mongoose.connect(connectionString, { dbName: "crudAppSample" })
    .then(() => {
        console.log("Connected to MongoDB through mongoose!");
    }).catch(err => console.error(err));

