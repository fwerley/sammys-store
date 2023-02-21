import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { routes } from './routes';
import axios from 'axios';

interface ServerData {
  id: string
  name: string
  slug: string
  image: string
  brand: string
  category: string
  description: string
  price: Number
}

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || process.env.HOSTNAME || 'http://localhost:'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));

const indexPath = path.join(__dirname, '/frontend/build', 'index.html');

app.get("*", (req: Request, res: Response) => {

  //Este escopo de função foi implementado para incluir as metatags 
  fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    const slug = req.params["0"].split('/').pop(); //{ '0': '/product/nike-slim-pant' } => nike-slim-pant
    try {
      const { data } = await axios.get<ServerData>(`${host}${port}/api/products/slug/${slug}`);
      // inject meta tags
      htmlData = htmlData.replace(
        "<title>Sammy's Store</title>",
        `<title>${data.name}</title>`
      )
        .replace('__META_OG_TITLE__', data.name)
        .replace('__META_OG_DESCRIPTION__', data.description)
        .replace('__META_DESCRIPTION__', data.description)
        .replace('__META_OG_IMAGE__', data.image)
    } catch (error) {
      htmlData = htmlData.
        replace('__META_OG_TITLE__', 'Sammy´s Store')
        .replace('__META_OG_DESCRIPTION__', 'Sua loja de artigos de beleza, roupas, calçados e relógios')
        .replace('__META_DESCRIPTION__', 'Sua loja de artigos de beleza, roupas, calçados e relógios')
        .replace('__META_OG_IMAGE__', '/logo192.png')
    }

    return res.send(htmlData);
  })
  // res.status(200).sendFile(path.join(__dirname, '/frontend/build/index.html'))
}
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server at ${host}${port}`);
});
