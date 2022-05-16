const p1 = new Promise<string>((_, reject) => {
  reject('Finished!');
});

p1.then(() => {
  console.log('Success!');
}).catch(() => {
  console.log('Error!');
});