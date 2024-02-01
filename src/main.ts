import express from 'express';
import { spyMiddleware } from './spy-middleware.js';

const app = express();
const port = process.env.PORT ?? 3333;

app.use(spyMiddleware);
// Define a simple route
// app.get('/', (req, res) => {
//   res.send('Hello, World! 2');
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
