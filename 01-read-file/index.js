const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');

let fileReaded = fs.createReadStream(pathFile, 'utf8');
let data = '';

fileReaded.on("data", (chunk) => {
  data = data + chunk;
});
fileReaded.on("end", () => {
  console.log(data);
});