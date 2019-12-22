import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const resultLine = line.split('').reverse().join('');
  console.log(resultLine);
});
