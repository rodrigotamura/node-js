const cluster = require("cluster"),
  http = require("http"),
  numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", worker => {
    console.log(`worker ${worker.process.pid} is online`);
  });

  cluster.on("listening", address => {
    console.log(`worker is listening`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`process ${process.pid} says hello!`);
    })
    .listen(8000);
}
