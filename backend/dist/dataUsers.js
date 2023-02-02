import bcrypt from 'bcrypt';
var data = {
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
        {
            name: 'Jeferson Nunes',
            email: 'jfnunes@host.com',
            password: bcrypt.hashSync('123456', 10),
            isAdmin: false,
        },
    ],
};
export default data;
//# sourceMappingURL=dataUsers.js.map