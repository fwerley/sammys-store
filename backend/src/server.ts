import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { routes } from './routes';
import axios from 'axios';
import isbot from 'isbot';

interface ServerData {
  id: string
  name: string
  slug: string
  image: string
  brand: string
  category: string
  description: string
  price: Number
  status: Number
}

interface IUserIO {
  name: string
  isAdmin: boolean
  messages: string[]
  socketId: string
  online: boolean
  id: string
}

export const metaTags = (title: string, description: string, image: string, url: string, type: string) => {
  return `
  <html>
    <head>
      <title>${defaultTitle}</title>
      <meta charset="utf-8">
      <link rel="icon" href="${defaultImage}" />
      <meta class="meta-description" name="description" content="${defaultDescription}">
      <!-- Google+ / Schema.org -->
      <meta itemprop="name" content="${title}">
      <meta itemprop="description" content="${description}">
      <meta itemprop="image" content="${image}">
      <!-- Twitter Meta -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="Sammy's Store" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}"/>
      <!-- Facebook Meta -->
      <meta property="og:type" content="${type}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />
      <meta name="og:url" property="og:url" content="${url}" />
      <meta name="fb:app_id" property="fb:app_id" content="1180331102646514" />
    </head>
    <body>
    </body>
  </html>`;
}

const __dirname = path.resolve();
const port = Number(process.env.PORT) || 5000;
const host = process.env.HOSTNAME || 'http://localhost:5000';
const defaultTitle = "Sammy's Store";
const defaultDescription = 'Sua loja de artigos de beleza, roupas, calçados e relógios';
const defaultImage = `/android-chrome-512x512.png`;
const defaultUrl = 'https://sammystore.com.br';
const defaultType = 'website'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use(express.static(path.join(__dirname, '/frontend/build')));

const indexPath = path.join(__dirname, '/frontend/build', 'index.html');

app.use((req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.headers['user-agent'] || '';
  if (isbot(userAgent)) next();
  else res.sendFile(indexPath)
});

app.get('/product/:slugSEO', async (req: Request, res: Response) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { slugSEO } = req.params;
  const url = process.env.HOSTNAME ? `${req.protocol}://${req.get('host')}` : host;
  try {
    const { data } = await axios.get<ServerData>(`${url}/api/products/SEO/${slugSEO}`);
    if (data.status === 404)
      res.send(metaTags(defaultTitle, defaultDescription, defaultImage, defaultUrl, defaultType));
    else
      res.send(metaTags("Sammy's Store | " + data.name, data.description, data.image, fullUrl, 'product'))
  } catch (error) {
    res.send(metaTags(defaultTitle, defaultDescription, defaultImage, defaultUrl, defaultType));
  }
})

app.get("*", (req: Request, res: Response) => {
  res.send(metaTags(defaultTitle, defaultDescription, defaultImage, defaultUrl, defaultType));
  //Este escopo de função foi implementado para incluir as metatags 
  // fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
  //   if (err) {
  //     console.error('Error during file reading', err);
  //     return res.status(404).end()
  //   }

  //   let data;
  //   const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  //   try {
  //     const slug = req.params["0"].split('/').pop(); //{ '0': '/product/nike-slim-pant' } => nike-slim-pant
  //     const url = process.env.HOSTNAME ? `${req.protocol}://${req.get('host')}` : host
  //     data = await axios.get<ServerData>(`${url}/api/products/SEO/${slug}`);
  //   } catch (error) {
  //     return res.send(htmlData);
  //   }

  //   if (data) {
  //     htmlData = htmlData.replace(
  //       "<title>Sammy´s Store</title>",
  //       `<title>Sammy's Store | ${data.data.name}</title>`
  //     )
  //       .replace('Sammy´s Store', `Sammy's Store | ` + data.data.name)
  //       .replace('https://sammystore.com.br', fullUrl)
  //       .replace('website', 'product')
  //       // .replace('website', 'product')
  //       .replace('Sua loja de artigos de beleza, roupas, calçados e relógios', data.data.description)
  //       .replace(`https://res.cloudinary.com/dunfd3yla/image/upload/v1681611871/logos/android-chrome-512x512_pkqqna.png`, data.data.image)
  //     return res.send(htmlData);
  //   } else {
  //     return res.send(htmlData);
  //   }
  // })
  // res.status(200).sendFile(path.join(__dirname, '/frontend/build/index.html'))
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const users: IUserIO[] = [];

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      console.log('Offline', user.name)
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', user)
      }
    }
  });

  socket.on('onLogin', (user) => {
    const updatedUser: IUserIO = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    }
    const existUser = users.find((x) => x.id === updatedUser.id);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    console.log('Online', user.name);
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      io.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit('listUsers', users);
    }
  })

  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x.id === user.id);
      io.to(admin.socketId).emit('selectUser', existUser);
    }
  })

  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x.id === message.id && x.online);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message)
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x) => x.id === message.id && x.online);
        user?.messages.push(message);
      } else {
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Desculpe. Não estou online no momento'
        })
      }
    }
  })

})

server.listen(port, () => {
  console.log(`Server at ${host}`);
});