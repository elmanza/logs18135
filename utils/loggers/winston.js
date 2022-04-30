let {config} = require("../../config");
let winston = require("winston");
let FormatLog = config.dev ? 'Console' : 'File';
let objWinston =  config.dev ? { level: 'verbose'} : { 
    filename: "winston.log", level: "warn"
 };

 let logger = winston.createLogger({
     level: "silly",
     transports: [
         new winston.transports[FormatLog](objWinston)
     ]
 });

 module.exports = logger;

