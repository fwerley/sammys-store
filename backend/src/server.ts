import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
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

interface IUserIO {
  name: string
  isAdmin: boolean
  messages: string[]
  socketId: string
  online: boolean
  id: string
}

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOSTNAME || 'http://localhost:5000'

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

    let data;
    try {
      const slug = req.params["0"].split('/').pop(); //{ '0': '/product/nike-slim-pant' } => nike-slim-pant
      let url = process.env.HOSTNAME ? `${req.protocol}://${req.get('host')}` : host
      data = await axios.get<ServerData>(`${url}/api/products/slug/${slug}`);
    } catch (error) {
      return res.send(htmlData);
    }

    if (data) {
      htmlData = htmlData.replace(
        "<title>Sammy´s Store</title>",
        `<title>${data?.data.name}</title>`
      )
        .replace('Sammy´s Store', data.data.name)
        .replace('Sua loja de artigos de beleza, roupas, calçados e relógios', data.data.description)
        .replace('Sua loja de artigos de beleza, roupas, calçados e relógios', data.data.description)
        .replace(`/android-chrome-512x512.png`, data.data.image)
      return res.send(htmlData);
    }
  })
  // res.status(200).sendFile(path.join(__dirname, '/frontend/build/index.html'))
}
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

const server = http.createServer(app);
const io = new Server(server, {cors: {origin: '*'}});
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