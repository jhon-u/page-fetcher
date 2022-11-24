// There are two operations in this problem which will take an unknown amount of time:

//  * You need to make an http request and wait for the response.
//  * After the http request is complete, you need to take the data you receive and write it to a file in your local filesystem.

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const fetcher = (url, path) => {
  request(url, function(error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  
    fs.open(path, 'wx', function(err, fd) {
      if (err) {
        if (err.code === 'EEXIST') {
          return fileAlreadyExists(path, body);
        }
        console.log('ERROR: ' + err);
      } else {
        return writeFileToSystem(path, body);
      }
    });
  });
};

const writeFileToSystem = (path, body) => {
  fs.writeFile(path, body, err => {
    if (err) {
      console.error(err);
    }
    console.log(`Downloaded and saved ${body.length} bytes to ${path}`);
  });
};

const fileAlreadyExists = (path, body) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(`The file at ${path} already exist. Type 'y' without quotes to override it. `, (response) => {
    if (response.toLowerCase() === 'y') {
      writeFileToSystem(path, body);
    }
    rl.close();
  });
};

const [url, path] = process.argv.slice(2);
fetcher(url, path);