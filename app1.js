import express from 'express';

const app = express();

app.get('/users', (_, res) => {

  const start = Date.now();
  while (Date.now() - start < 2000) { }
  res.json(['Opio', 'Ocen']);
});

app.listen(3000, () => console.log('App is listening on port 3000'));
