const fs = require('fs');
const path = require('path');
const cssStylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');

//create bundle file
const output = fs.createWriteStream(path.join(projectFolder, 'bundle.css'));

//read folder with css files designed to bundle
fs.readdir(cssStylesFolder, (err, data) => {
  if (err) throw err;
  //iterate by style files
  for (let i = 0; i < data.length; i++) {
    //separate extension from file and...
    let extension = path.extname(data[i]).split('.').pop();
    //check it for css matching and put it to putput file
    if (extension === 'css') {
      let input = fs.createReadStream(path.join(cssStylesFolder, data[i]));
      input.on('data', data => {
        output.write(`${data.toString()}\n`);
      });
    }
  }
});