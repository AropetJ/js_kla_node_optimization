import express from 'express';

const app = express();
const fetchUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['Kato', 'Wasswa']), 2000);
  });
}

app.get('/users', async (_, res) => {
  const users = await fetchUsers();
  res.json(users)
})

app.listen(3000, () => console.log('App is listening on port 3000'))
