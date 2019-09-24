var fs = require("fs"), // we will read a file
  http = require("http"), // we will make a webserver
  path = require("path"); // we need the file's path

var server = http.createServer(function(req, res) {
  if (req.url != "/video.mp4") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      '<h1>YES streaming</h1><video src="http://localhost:3000/video.mp4" controls></video>'
    );
  } else {
    var file = path.resolve(__dirname, "video.mp4"); // seeking for movie
    var range = req.headers.range; // whcih part user is requesting from video
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10); // getting initial position from our video

    // Next we are verifying some video's properties with fs.stat('video.mp4', callbackFn())
    // file is the movie
    fs.stat(file, function(err, stats) {
      var total = stats.size; // getting total size from video
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1; // getting final position from video

      //parseInt(..., 10) this '10' is the base, readable for humans
      var chunksize = end - start + 1; // amount of data we'll send
      // If user jump to the middle of the video, var var will go to that position as the start of the video
      // server will send packages from the point user is, not before
      // it is not necessary to load what is before

      // code status 206 is very important (partial content)
      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total, //
        "Accept-Ranges": "bytes", // accepting our file to be cutted in order to make the streaming
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      // streaming
      var stream = fs
        .createReadStream(file, { start: start, end: end }) // setting where is the beginning and end of video
        .on("open", function() {
          stream.pipe(res);
        })
        .on("error", function(err) {
          res.end(err);
        });

      // for videos we cannot close HTTP request because the video will stop.
    });
  }
});

server.listen(3000);

// The follow is withou streaming

http
  .createServer(function(req, res) {
    if (req.url !== "/video.mp4") {
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(
        '<h1>NO streaming</h1><video src="http://localhost:3001/video.mp4" controls></video>'
      );
    } else {
      var file = path.resolve(__dirname, "video.mp4");

      fs.readFile(file, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end();
        } else {
          res.writeHead(200, {
            "Content-Type": "video/mp4"
          });
          res.end(content);
        }
      });
    }
  })
  .listen(3001);
