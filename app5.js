import express from 'express';
import cluster from 'cluster';
import { cpus } from 'os';
import redis from 'redis';

const numCPUs = cpus().length;

const app = express();
const client = redis.createClient();
(async () => {
  await client.connect();
  console.log('Redis client connected')
})();

const fetchUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['Opio', 'Okello']), 2000);
  });
};

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running!`);

  for (let i = 0; i < numCPUs; i++){
    cluster.fork();
  }
} else {
  app.get('/users', async (_, res) => {
    const cache = 'users';
    const cached = await client.get(cache);
    if (cached) {
      console.log('Cache hit!');
      return res.json(JSON.parse(cached));
    }
    const users = await fetchUsers();
    await client.setEx(cache, 60, JSON.stringify(users));
    console.log('Cache miss—stored!');
    res.json(users);
  });

  app.listen(8000, () => console.log(`Worker ${process.pid} is running on port 8000`));
}
