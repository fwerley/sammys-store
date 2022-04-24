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
    },
  ],
};
export default data;
