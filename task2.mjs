import fs from 'fs';
import readline from 'readline';
import csvtojson from 'csvtojson';

const file = './csv/Books.csv';
const rStream = fs.createReadStream(file);
const wStream = fs.createWriteStream('task2.txt');

let lineNumber = 0;
let headerLine = '';

const readInterface = readline.createInterface({
  input: rStream,
  output: wStream,
  terminal: false
});

function parseLinetoJsonObj (line) {
  lineNumber = lineNumber + 1;
 
  if (lineNumber === 1) {
    headerLine = line;

    return;
  }

  const dataWithHeaders = headerLine.concat('\n', line);

  return csvtojson({ noheader: false, delimiter: ';' })
    .fromString(dataWithHeaders)
    .subscribe((jsonObj) => {
      wStream.write(JSON.stringify(jsonObj) + '\n');
    })
    .on('error', (error) => console.log('Error at parsing line to JSON object: ', error) );
};

rStream.on('error', (error) => console.log('Error at reading data from csv file: ', error) );

wStream.on('error', (error) => console.log('Error at writing data to .txt file: ', error) );

readInterface.on('line', function(line) {
  parseLinetoJsonObj(line);
});
