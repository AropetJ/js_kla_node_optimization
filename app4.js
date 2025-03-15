import express from 'express';
import cluster from 'cluster';
import { cpus } from 'os';

const numCPUs = cpus().length;

const app = express();

const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const fetchUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startTime = Date.now();
      const fibResult = fibonacci(40);
      const endTime = Date.now();
      
      console.log(`Worker ${process.pid} completed Fibonacci calc in ${endTime - startTime}ms`);
      
      resolve({
        users: ['Odongo', 'Ocen'],
        calculation: fibResult,
        timeTaken: endTime - startTime
      });
    }, 2000);
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
  app.listen(8000, () => console.log(`Worker ${process.pid} is up and running`));
}
