/*
* Page Downloader is a node app that takes two command line arguments:
* @param {url} a valid URL.
* @param {path} a local file path.
*
* Use from the command line: $ node fetcher.js http://www.example.edu/ ./index.html
*/

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const fetcher = (url, path) => {
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      fs.open(path, 'wx', function(err) {
        if (err) {
          if (err.code === 'EEXIST') {
            return fileAlreadyExists(path, body);
          }
          if (err.code === 'ENOENT') {
            return console.log(`File Path is Invalid: no such file or directory, open ${path}`);
          }
          return console.log('ERROR: ' + err);
        }
        
        return writeFileToSystem(path, body);
      });
    } else {
      return console.log(`${error}`);
    }
  });
};

const writeFileToSystem = (path, body) => {
  fs.writeFile(path, body, err => {
    if (err) {
      return console.error(err);
    }
    console.log(`Downloaded and saved ${body.length} bytes to ${path}`);
  });
};

const fileAlreadyExists = (path, body) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(`The file at ${path} already exist. Type "y" without quotes to override it. `, (response) => {
    if (response.toLowerCase() === 'y') {
      writeFileToSystem(path, body);
    }
    rl.close();
  });
};

const [url, path] = process.argv.slice(2);
fetcher(url, path);