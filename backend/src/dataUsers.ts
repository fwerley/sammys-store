import bcrypt from 'bcrypt';

const data = {
  users: [
    {
      name: 'Yelrew',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
    },
    {
      name: 'Werley',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: true,
      isSeller: true
    },
    {
      name: 'Jeferson Nunes',
      email: 'jfnunes@host.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
    },
  ],
};
export default data;
