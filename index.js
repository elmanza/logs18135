const express = require("express");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
let {config} = require("./config");
const app = express();
const PORT = 3010;
let modo_cluster = process.argv[2] == "Cluster";
let pino = require("pino")({
    prettyPrint: {
        translateTime: "dd-mm hh",
        ignore: "pid,hostname"
    }
});

let isPrime = num =>{
    for (let i = 2; i < num; i++) {
        if(num % i === 0) return false;
    }
    return true;
}


// Ejercicio 1
app.get("/", (req, res, next)=>{
    console.log(".............................");
    let primes = [];
    let max = Number(req.query.max) || 1000;
    console.log("max", max);
    for (let i = 1; i <= max; i++) {
        if(isPrime(i)) primes.push(i);
    }
    res.send(primes);
});

app.get("/nobloq", (req, res, next)=>{
    let primes = [];
    let max = Number(req.query.max) || 1000;
    for (let i = 1; i <= max; i++) {
        if(isPrime(i)) primes.push(i);
    }
    res.send(primes);
});

app.get("/bloq", (req, res, next)=>{
    let primes = [];
    let max = Number(req.query.max) || 1000;
    console.log("max", max);
    for (let i = 1; i <= max; i++) {
        if(isPrime(i)) primes.push(i);
    }
    console.log("---------------------------------------");
    console.log(primes);
    res.send(primes);
});


if(modo_cluster && cluster.isPrimary){
    pino.info(`PID -> ${process.pid}`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();        
    }

    cluster.on('exit', (worker, a, b)=>{
        pino.error(`Murió el subproceso ${worker.process.pid}`);
        cluster.fork();
    })
}else{
    app.listen(PORT, ()=>{
        console.log(`Server On http://localhost:${PORT}`);
    })
}



