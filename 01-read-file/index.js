const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

readableStream.on('readable', function(){
  let data;
  while ((data = this.read()) !== null) {
    console.log(data.toString());
  }
});
