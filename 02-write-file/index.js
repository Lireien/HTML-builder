const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');
// const textFile = path.join(path.dirname(__dirname), '02-write-file', 'text.txt');
const textFile = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(textFile);

const rl = readline.createInterface({ input, output });

//greeting message after running node 02-write-file:
console.log('You can type your text here:');

//fill created text file with input value
rl.on('line', (input) => {
  input === 'exit' ? endTypingHandler() : stream.write();
});

//quit of session
rl.on('SIGINT', () => {
  rl.question(
    'Are you sure you want to exit? ',
    (answer) => {
      if (answer.match(/^y(es)?$/i)) endTypingHandler();
    }
  );
});

//create function with repeating code accroding to DRY principle
function endTypingHandler() {
  stream.end();
  rl.close();
  console.log('Have a nice day');
  process.exit();
}
