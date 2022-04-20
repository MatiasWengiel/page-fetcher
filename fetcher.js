let arguments = process.argv.slice(2);
const request = require('request');
const fs = require('fs');

let website = arguments[0];
let filePath = arguments[1];

const fileWriter = (body) => {
  fs.writeFile(filePath, body, err => {
    if (err) {
      console.log(err);
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
  
  });
}

request(website, (error, response, body) => {
  if (error) {
    console.log('error', error);
  }
  if (response.statusCode !== 200) {
    console.log('requestStatus', response && response.statusCode);
  }

  
  
  fs.access('./index.html', fs.constants.R_OK, (err) => {
    if (err) {
      fileWriter(body)
    } else {
      console.log('File exists')
    }
  })

});
