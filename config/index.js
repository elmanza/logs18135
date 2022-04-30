require("dotenv").config();


let config = {
    port: process.env.PORT,
    dev: process.env.NODE_ENV !== "production"
}

module.exports = {config};