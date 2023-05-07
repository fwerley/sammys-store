import bcrypt from 'bcrypt';

const data = {
  users: [
    {
      name: 'Marcos Aurelio',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
      isSeller: true,
      active: true
    },
    {
      name: 'Werley Admin',
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
