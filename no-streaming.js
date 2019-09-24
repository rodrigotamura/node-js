var fs = require("fs"), // we will read a file
  http = require("http"), // we will make a webserver
  url = require("url"), // we will work with URL
  path = require("path"); // we need the file's path

var server = http.createServer(function(req, res) {
  if (req.url !== "/video.mp4") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end('<video src="http://localhost:3000/video.mp4" controls></video>');
  } else {
    var file = path.resolve(__dirname, "video.mp4"); // seeking for movie
    var range = req.headers.range; // whcih part user is requesting from video
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10); // getting initial position from our video

    // Next we are verifying some video's properties with fs.stat('video.mp4', callbackFn())
    // file is the movie
    fs.stat(file, (err, stats) => {
      var total = stats.size; // getting total size from video
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1; // getting final position from video

      //parseInt(..., 10) this '10' is the base, readable for humans
      var chunkSize = end - start + 1; // amount of data we'll send
      // If user jump to the middle of the video, var var will go to that position as the start of the video
      // server will send packages from the point user is, not before
      // it is not necessary to load what is before

      res.writeHead(200, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total, //
        "Accept-Ranges": "bytes", // accepting our file to be cutted in order to make the streaming
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4"
      });

      // streaming
      var stream = fs
        .createReadStream(file, { start, end }) // setting where is the beginning and end of video
        .on("open", () => {
          stream.pipe(res);
        })
        .on("error", err => {
          res.end(err);
        });

      // for videos we cannot close HTTP request because the video will stop.
    });
  }
});

server.listen(3000);
