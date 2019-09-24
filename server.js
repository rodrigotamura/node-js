/* First example

const http = require("http"),
  fs = require("fs");

var server = http.createServer(function(req, res) {
  fs.readFile("index.html", function(err, data) {
    if (err) throw new Error("Ops, some problem occurred");
    res.writeHead(
      200, // status code
      {
        "Content-Type": "text/html" // kind of content of response
      }
    );

    // including the content
    res.write(data.toString());

    // closing connection (VERY IMPORTANT!)
    res.end();
  });
});

server.listen(3000);
 */

const http = require("http"),
  fs = require("fs"),
  url = require("url");

const server = http.createServer(function(req, res) {
  const url_parts = url.parse(req.url);
  var path = url_parts.pathname === "/" ? "/index.html" : url_parts.pathname;

  fs.readFile(__dirname + path, function(err, html) {
    if (err) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.write("Not found");
    } else {
      res.writeHead(200, { "Content-type": "text/html" });
      res.write(html.toString());
    }

    res.end();
  });
});

server.listen(3000);
