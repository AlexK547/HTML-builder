const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
let pathFolder = path.join(__dirname, 'files');
let pathFolderCopy = path.join(__dirname, 'files-copy');

fs.readdir(pathFolderCopy, {withFileTypes: true},
  async (err, files) => {
    if (err) {
      await fsPromises.mkdir(pathFolderCopy, {recursive: true});
      copyFile();
    } else {
      for (let file of files) {
        let pathFile = path.join(pathFolderCopy, file.name);
        await fsPromises.unlink(pathFile);
      }
      copyFile();
    }
  }
);

function copyFile() {
  fs.readdir(pathFolder, {withFileTypes: true},
    async (err, files) => {
      for (let file of files) {
        let pathFile = path.join(pathFolder, file.name);
        let pathFileCopy = path.join(pathFolderCopy, file.name);
        await fsPromises.copyFile(pathFile, pathFileCopy);
      }
      console.log("Copy files completed!");
    }
  );
}

