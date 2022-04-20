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


const fileWriter = (body) => {
  fs.writeFile(filePath, body, err => {
    if (err && err.errno === -2) {
      console.log('Supplied path is invalid. Exiting file');
      process.exit();
      return;
    }
  });

  let counter = 0;
  fs.readFile(filePath, 'utf8', (err, data) => {
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

request(website, (error, response, body) => {
  
  if (error) {
    console.log('error', error);
  }
  if (response.statusCode !== 200) {
    console.log('requestStatus', response && response.statusCode);
  }

  
  
  fs.access('./index.html', fs.constants.R_OK, (err) => {
    if (err) {
      fileWriter(body);
    } else {
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
