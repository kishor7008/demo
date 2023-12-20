const http = require('http');
const cluster = require('cluster');
const os = require('os');
console.log(cluster)
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers based on the number of CPU cores
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    // Worker processes will share the same port
    const server = http.createServer((req, res) => {
        // Implement your load balancing logic here
        // For simplicity, this example distributes requests evenly among workers
        console.log(`Handling request on worker ${process.pid}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, this is your Node.js API!\n');
    });

    // Workers share the same port
    const port = 3000;
    server.listen(port, () => {
        console.log(`Worker ${process.pid} is listening on port ${port}`);
    });
}
