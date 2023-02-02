import express, { NextFunction, Request, Response } from 'express';
import path, { dirname } from 'path';

import { routes } from './src/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get("*", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});