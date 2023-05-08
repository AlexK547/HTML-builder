const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

let pathAssets = path.join(__dirname, 'assets');
let pathProjectDist = path.join(__dirname, 'project-dist');
let pathProjectDistAssets = path.join(__dirname, 'project-dist', 'assets');

let pathStyles = path.join(__dirname, 'styles');
let pathTemplate = path.join(__dirname, 'template.html');
let pathComponents = path.join(__dirname, 'components');

fs.readdir(pathProjectDist, {withFileTypes: true},
  async (err, files) => {
    await fsPromises.mkdir(pathProjectDist, {recursive: true});
    await fsPromises.mkdir(pathProjectDistAssets, {recursive: true});
    copyAssets(pathAssets, pathProjectDistAssets);
    createStyles();
    createHtml();
  }
);

function copyAssets(pathFolder, pathFolderCopy) {
  fs.readdir(pathFolder, {withFileTypes: true},
    async (err, files) => {
      for (let file of files) {
        if (file.isFile()) {
          let pathFile = path.join(pathFolder, file.name);
          let pathFileCopy = path.join(pathFolderCopy, file.name);
          await fsPromises.copyFile(pathFile, pathFileCopy);
        } else {
          let newPath = path.join(pathFolder, file.name);
          let newPathCopy = path.join(pathFolderCopy, file.name);
          await fsPromises.mkdir(newPathCopy, {recursive: true});
          copyAssets(newPath, newPathCopy);
        }
      }
    }
  );
}

async function createStyles() {
  let pathProjectDistStyles = path.join(__dirname, 'project-dist', 'style.css');
  let fileStyles = fs.createWriteStream(pathProjectDistStyles);

  fs.readdir(pathStyles, {withFileTypes: true},
    async (err, files) => {
      if (err) {
        console.log(err);
      } else {
        let arrayStyles = [];
        for (let file of files) {
          if (file.name.includes("header")) arrayStyles[0] = file;
          if (file.name.includes("main")) arrayStyles[1] = file;
          if (file.name.includes("footer")) arrayStyles[2] = file;
        }
        for (let file of arrayStyles) {
          if (file.name.split(".")[1] === "css") {
            let pathFile = path.join(pathStyles, file.name);
            let fileReaded = fs.createReadStream(pathFile, 'utf-8');

            fileReaded.on('data', (chunk) => {
              fileStyles.write(chunk + "\n");
            });
          }
        }
      }
    }
  );
}

async function createHtml() {
  let pathProjectDistHtml = path.join(__dirname, 'project-dist', 'index.html');
  let fileHtml = fs.createWriteStream(pathProjectDistHtml);
  let template = await fsPromises.readFile(pathTemplate, 'utf-8');
  let arrayComponents = await fsPromises.readdir(pathComponents, {withFileTypes: true});

  for (let file of arrayComponents) {
    if (file.name.split(".")[1] === "html") {
      let fragment = `{{${file.name.split(".")[0]}}}`;
      let pathFile = path.join(pathComponents, file.name);
      let fileReaded = await fsPromises.readFile(pathFile, 'utf-8');
      template = template.replace(fragment, fileReaded);
    }
  }
  fileHtml.write(template);
}
