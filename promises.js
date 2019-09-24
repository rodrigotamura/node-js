const fs = require("fs"),
  Promise = require("promise");

function read(file) {
  return new Promise(function(fulfill, reject) {
    fs.readFile(file, function(err, data) {
      if (err) {
        reject(err);
      }

      fulfill(data.toString());
    });
  });
}

read("file_name.txt")
  .then(r => r.toUpperCase())
  .then(r => console.log("Finished!!! " + r));

/* console.time("async");

var counter = 0;

for (let i = 0; i < 1000; i++) {
  fs.readFile("file_name.txt", function(err, data) {
    if (err) {
      return console.error(err);
    } else {
      counter++;
      console.log(counter + ") Asynchronous: " + data.toString());

      if (counter === 1000) console.timeEnd("async");
    }
  });
} */
