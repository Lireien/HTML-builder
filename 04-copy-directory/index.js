const fs = require('fs');
const path = require('path');

//create original and destination path
const copyFromPath = path.join(__dirname, 'files');
const copyToPath = path.join(__dirname, 'files-copy');

//create destination folder
fs.mkdir(copyToPath, { recursive: true }, (err) => {
  if (err) throw err;
});

//read copyFolder content 
fs.readdir(copyToPath, (err, data) => {
  if (err) throw err;
  for (let i = 0; i < data.length; i++) {
    fs.unlink(`${copyToPath}/${data[i]}`, err => {
      if (err) throw err;
    });
  }
});
//read mainFolder content and update copyFolder with it
fs.readdir(copyFromPath, (err, data) => {
  if (err) throw err;
  for (let i = 0; i < data.length; i++) {
    fs.copyFile(
      `${copyFromPath}/${data[i]}`,
      `${copyToPath}/${data[i]}`,
      (err) => {
        if (err) throw err;
      }
    );
  }
});
