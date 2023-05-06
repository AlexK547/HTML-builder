const fs = require('fs');
const path = require('path');
let pathFolder = path.join(__dirname, 'secret-folder');

console.log("File name  |  Extension  |  File size");

fs.readdir(pathFolder, {withFileTypes: true}, 
  (err, files) => {
    for (const file of files) {
      if (file.isFile()) {
        let pathFile = path.join(pathFolder, file.name);
        fs.stat(pathFile, (error, stats) => {
          let fileName = file.name.split(".")[0];
          fileName = fileName + " ".repeat(13 - fileName.length);
          let fileExt = file.name.split(".")[1];
          fileExt = fileExt + " ".repeat(13 - fileExt.length);
          const fileSize = stats.size + "b";
          console.log(` ${fileName} ${fileExt} ${fileSize}`);
        });
      }
    }
  }
);