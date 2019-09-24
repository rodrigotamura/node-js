const fs = require("fs");

fs.writeFile("file_name.txt", "Content put here!!!", function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("File created");
  }
});

fs.readFile("filwe_name.txt", function(err, data) {
  if (err) {
    throw new Error("Error in file reading");
  } else {
    console.log(data.toString());
  }
});

/* 
const err = new Error("some error");
console.log(err);
console.log("tamura"); */
