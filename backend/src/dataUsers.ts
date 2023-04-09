import bcrypt from 'bcrypt';

const data = {
  users: [
    {
      name: 'Yelrew',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
      isSeller: true,
      active: true
    },
    {
      name: 'Werley',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: true,
      isSeller: true,
      active: true
    },
    {
      name: 'Jeferson Nunes',
      email: 'jfnunes@host.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
      isSeller: true,
      active: true
    },
  ],
};
export default data;
