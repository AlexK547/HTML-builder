const fs = require('fs');
const path = require('path');

let pathStyles = path.join(__dirname, 'styles');
let pathStylesHundle = path.join(__dirname, 'project-dist', 'bundle.css');
let fileStylesHundle = fs.createWriteStream(pathStylesHundle);

fs.readdir(pathStyles, {withFileTypes: true},
  (err, files) => {
    if (err) {
      console.log(err);
    } else {
      for (let file of files) {
        if (file.name.split(".")[1] === "css") {
          let pathFile = path.join(pathStyles, file.name);
          let fileReaded = fs.createReadStream(pathFile, 'utf-8');

          fileReaded.on('data', (chunk) => {
            fileStylesHundle.write(chunk + "\n");
          });
        }
      }
      console.log("File bundle.css created!");
    }
  }
);