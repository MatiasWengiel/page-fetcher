let userInput = process.argv.slice(2);
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let website = userInput[0];
let filePath = userInput[1];

// Calculates the size of a given file by counting the number of characters (bytes) within it
const fileSizeCalc = (path) => {
  let counter = 0;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  
    for (let eachChar of data) {
      counter += 1;
    }
    console.log(`Downloaded and saved ${counter} bytes to ${filePath}`);

    process.exit();
  });
};

//Writes a file if provided with a valid path
const fileWriter = (body) => {
  fs.writeFile(filePath, body, err => {
    if (err) {
      console.log('Supplied path is invalid. Exiting program.');
      process.exit();
      return;
    }
  });

  fileSizeCalc(filePath);

};


request(website, (error, response, body) => {
  
  if (error && response === undefined) {
    console.log("The provided URL does not exist. Exiting program.");
    process.exit();
  }
  
  fs.access(filePath, (err) => {

    if (err) {
      if (err.syscall === 'access') { //If the file does not exist, create it
        fileWriter(body);
      }
      
    } else { //If it does exist, ask whether to overwrite it
      rl.question(`${filePath} already exists. Overwrite? (Y/N)`, (response) => {
        if (response === 'Y' || response === 'y') {
          fileWriter(body);
          rl.close();
        } else if (response === 'N' || response === 'n') {
          console.log('File will not be overwritten');
          rl.close();
        } else {
          console.log('Invalid input, file will not be overwritten');
          rl.close();
        }
      });
    }
  });

});