const fs = require('fs');
const path = require('path');

let filesDir = path.join(
  path.dirname(__dirname),
  '03-files-in-folder',
  'secret-folder'
);

fs.readdir(filesDir, { withFileTypes: true }, (err, secrets) => {
  if (err) {
    return console.error(err);
  }
  secrets.forEach((file) => {
    if (file.isFile()) {
      fs.stat(path.join(filesDir, file.name), (err, stats) => {
        if (err) {
          return console.log(err);
        }

        console.log(
          `${path.parse(file.name).name} - ${path
            .parse(file.name)
            .ext.replace(/^./, '')} - ${stats.size} bytes`
        );
      });
    }
  });
});
