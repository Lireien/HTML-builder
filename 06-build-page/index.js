const fs = require('fs');
const path = require('path');
const destinationFolder = path.join(__dirname, 'project-dist');
const cssStylesFolder = path.join(__dirname, 'styles');
const assetsFromDir = path.join(__dirname, 'assets');
const assetsToDir = path.join(destinationFolder, 'assets');
const dirWithComponents = path.join(__dirname, 'components');

//create destination folder
fs.mkdir(
  destinationFolder,
  {
    recursive: true,
  },
  (err) => {
    if (err) throw err;
  }
);

async function copyFolderHandler(assetsFromDir, assetsToDir) {
  //copy assets folder
  await fs.promises.mkdir(
    assetsToDir,
    {
      recursive: true,
    },
    (err) => {
      if (err) throw err;
    }
  );
  //inspect assets folder and select inner files
  const innerFiles = await fs.promises.readdir(assetsFromDir, {
    withFileTypes: true,
  });
  //iterate by inner files
  innerFiles.forEach(async (innerFile) => {
    //check inner file types and...
    if (innerFile.isFile()) {
      //...if it's a file, copy each file to an assets folder of destination folder
      const originalFile = path.join(assetsFromDir, innerFile.name);
      const destinationFile = path.join(assetsToDir, innerFile.name);
      await fs.promises.copyFile(originalFile, destinationFile);
    } else {
      //... if it's a folder, recursievly copy the whole inner folder to a destination folder
      copyFolderHandler(
        path.join(assetsFromDir, innerFile.name),
        path.join(assetsToDir, innerFile.name)
      );
    }
  });
}
// call copy fnc
copyFolderHandler(assetsFromDir, assetsToDir);

//read css folder
fs.readdir(cssStylesFolder, (err, files) => {
  //create css resulting file
  const output = fs.createWriteStream(
    path.join(destinationFolder, 'style.css')
  );
  if (err) throw err;
  //iterate by all css files ...
  for (let i = 0; i < files.length; i++) {
    //...separate templateTagion from file name...
    let templateTagion = path.extname(files[i]).split('.').pop();
    //...check it for 'css' matching and put it to output file
    if (templateTagion === 'css') {
      const input = fs.createReadStream(path.join(cssStylesFolder, files[i]));
      input.on('data', (data) => {
        output.write(`${data.toString()}\n`);
      });
    }
  }
});

const templateHtml = fs.createReadStream(
  path.join(__dirname, 'template.html')
);
let templateStr = '';

async function htmlBuildHandler() {
  //create html resulting file
  const htmlResulting = fs.createWriteStream(
    path.join(destinationFolder, 'index.html')
  );
  templateHtml.on('data', (data) => {
    //fill template with data
    templateStr = data.toString();
    //read html files from original components folder
    fs.readdir(
      dirWithComponents,
      {
        withFileTypes: true,
      },
      (err, files) => {
        if (err) throw err;
        files.forEach((file, i) => {
          //check for files type, take it name, replace template tag in template file for eponymous file content
          if (file.isFile() && path.parse(file.name).ext === '.html') {
            const stream = fs.createReadStream(
              path.join(__dirname, 'components', file.name)
            );
            const fileName = path.parse(file.name).name;
            const templateTag = `{{${fileName}}}`;
            stream.on('data', (data) => {
              templateStr = templateStr.replace(templateTag, data.toString());
              if (i === files.length - 1) {
                htmlResulting.write(templateStr);
              }
            });
          }
        });
      }
    );
  });
}
htmlBuildHandler();
