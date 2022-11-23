// There are two operations in this problem which will take an unknown amount of time:

//  * You need to make an http request and wait for the response.
//  * After the http request is complete, you need to take the data you receive and write it to a file in your local filesystem.

const request = require('request');
const fs = require('fs');

const fetcher = (url, path) => {
  request(url, function(error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  
    fs.writeFile(path, body, err => {
      if (err) {
        console.error(err);
      }
      console.log(`Downloaded and saved ${body.length} bytes to ${path}`);
    });
  });
};

const [url, path] = process.argv.slice(2);
fetcher(url, path);
