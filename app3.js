import express from 'express';
import cluster from 'cluster';
import { cpus } from 'os';

const numCPUs = cpus().length;

const app = express();

const fetchUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['Odongo', 'Ocen']), 2000);
  });
};

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is up and running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {

  app.get('/users', async (_, res) => {
    const users = await fetchUsers();
    res.json(users);
  });
  app.listen(3000, () => console.log(`Worker ${process.pid} is up and running`));
}
