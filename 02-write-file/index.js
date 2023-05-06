const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pathFile = path.join(__dirname, 'text.txt');

const writeFile = fs.createWriteStream(pathFile);

let nameUser = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Hello!");

rl.question("Enter your name: ", (name) => {
  nameUser = name;
  rl.setPrompt("Enter your text: ");
  rl.prompt();
  rl.on('line', (textline) => {
    if (textline.toLowerCase() === "exit") {
      rl.close();
    } else {
      writeFile.write(textline + "\n");
      rl.setPrompt(`What else would you like to enter? ('exit' or 'Ctrl + C' to leave): `);
      rl.prompt();
    }
  });
});

rl.on('close', () => {
  writeFile.end();
  console.log(`\nGood luck, ${nameUser}!`);
});