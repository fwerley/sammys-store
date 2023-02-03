import express, { NextFunction, Request, Response } from 'express';
import path from 'path';

import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const _dirname = path.resolve();
console.log(_dirname)
app.use(express.static(path.join(_dirname, '/frontend/build')));
app.get("*", (req: Request, res: Response) =>
  res.sendFile(path.join(_dirname, '/frontend/build/index.html'))
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
