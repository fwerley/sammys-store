import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
// import asyncHandler  from 'express-async-handler';
import { prismaClient } from '../database/prismaClient';
import dataUsers from '../dataUsers';
import { baseUrl, generateToken, mailtrap } from '../utils';
import jwt from 'jsonwebtoken';
import { VerifyErrors, Jwt, JwtPayload } from 'jsonwebtoken';

export default {
  async insert(req: Request, res: Response) {
    await prismaClient.user.deleteMany({});
    const createdUsers = await prismaClient.user.createMany({
      data: dataUsers.users,
    });
    res.json(createdUsers);
  },

  async store(req: Request, res: Response) {
    const users = await prismaClient.user.findMany({});
    res.send(users)
  },

  async find(req: Request, res: Response) {
    const { id: userId } = req.params;
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId
      }, include: {
        seller: true
      }
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Usuário não encontrado' });
    }

  },

  async update(req: Request, res: Response) {
    const { id: userId } = req.params;
    const { name, email, isAdmin, isSeller } = req.body;
    try {
      await prismaClient.user.update({
        where: {
          id: userId
        },
        data: {
          name,
          email,
          isAdmin,
          isSeller
        }
      });
      res.status(202).send({ message: 'Usuario atualizado' });
    } catch (err) {
      res.status(404).send({ message: 'Usuário não encontrado' });
    }

  },

  async delete(req: Request, res: Response) {
    const { id: userId } = req.params;

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId
      }
    })

    if (user?.email === 'admin@example.com') {
      res.status(400).send({ message: 'Você não pode deletar o Administrador' });
      return;
    }

    try {
      await prismaClient.user.delete({
        where: {
          id: userId
        }
      });
      res.send({ message: 'Usuário deletado' });
      console.log(true)
    } catch (err) {
      res.status(404).send({ message: 'Erro ao deletar o usuário' });
    }

  },

  async signin(req: Request, res: Response) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: req.body.email,
      }, include: {
        seller: true
      }
    });
    if (user) {
      if (!user.active) {
        res.status(404).send({
          message: 'Sua conta está desativada. Entre em contato com o suporte'
        });
        return;
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          seller: user.isSeller ? user.seller : {},
          document: user.document,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email ou senha inválido' });
  },

  async signup(req: Request, res: Response) {
    const { name, email } = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);

    try {
      const creatUser = await prismaClient.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      if (creatUser) {
        const token = jwt.sign({ id: creatUser.id }, '' + process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        await prismaClient.user.update({
          where: {
            email
          },
          data: {
            resetToken: token
          }
        });

        mailtrap.sendMail({
          from: "Sammy's Store <noreplay@sammystore.com>",
          to: `${creatUser.name} <${creatUser.email}>`,
          subject: `Confirmar email`,
          html: `
          <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Maven+Pro:wght@600&display=swap" rel="stylesheet">
          <style>
            html * {
              font-family: 'Inter', sans-serif;
              font-family: 'Maven Pro', sans-serif;
            }
          </style>
          </head>
          <body>
            <p>Clique no link para confirmar sua conta:</p>
            <a href="${baseUrl()}/confirm-account/${token}">Confirmar email</a>
            <br/>
            <p>Caso não consiga ir pelo link acima, copie e cole esta url no seu navegadir:<br/><br/>
            ${baseUrl()}/confirm-account/${token}</p>
  
          </body>
          `
        }, (err, body) => {
          if (err) {
            console.log(err)
          } else {
            // console.log(body)
          }
        })
        res.send({ message: 'Um link de confirmação foi enviado para seu email' })
      } else {
        res.status(404).send({ message: 'Ocorreu um erro no seu cadastro. Aguarde algums minutos e tente novamente' })
      }
      // res.send({
      //   id: creatUser.id,
      //   name: creatUser.name,
      //   email: creatUser.email,
      //   isAdmin: creatUser.isAdmin,
      //   isSeller: creatUser.isSeller,
      //   token: generateToken(creatUser),
      // });
    } catch (err) {
      res.status(404).send({ message: 'Não foi possivel cadastrar essas informações' })
    }
  },

  async profile(req: Request, res: Response) {

    interface ISeller {
      name: string
      logo: string
      description: string
    }

    const { name, email, password, sellerName, sellerLogo, sellerDescription } = req.body;

    var dataUser = {
      name: name || req.user?.name,
      email: email || req.user?.email,
    }
    if (password) {
      Object.assign(dataUser, { password: bcrypt.hashSync(password, 10) })
    }

    var dataSeller: ISeller

    try {
      if (req.user?.isSeller) {
        const idSeller: string = req.user.seller.id
        dataSeller = {
          name: sellerName || req.user.seller.name,
          logo: sellerLogo || req.user.seller.logo,
          description: sellerDescription || req.user.seller.description
        }
        await prismaClient.seller.update({
          where: {
            id: idSeller
          },
          data: dataSeller
        })
      }
      const updatedUser = await prismaClient.user.update({
        where: {
          id: req.user?.id
        },
        data: dataUser,
        include: {
          seller: true
        }
      });
      res.send({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        seller: updatedUser.isSeller ? updatedUser.seller : {},
        document: updatedUser.document,
        token: generateToken(updatedUser),
      });
    } catch (err) {
      res.status(404).send({ message: 'Usuário não encontrado' });
      console.log(err)
    }
  },

  async confirmAccount(req: Request, res: Response) {
    const { token } = req.body
    jwt.verify(
      token,
      '' + process.env.JWT_SECRET,
      async (err: VerifyErrors | null, decode: Jwt | JwtPayload | string | undefined) => {
        if (err) {
          res.status(401).send({ message: 'Token inválido' })
        }
        else {
          const user = await prismaClient.user.findFirst({
            where: {
              resetToken: token
            }
          })
          if (user) {
            await prismaClient.user.update({
              where: {
                id: user.id
              },
              data: {
                active: true
              }
            })
            res.send({ message: 'Email verificado com sucesso' })
          }
        }
      }
    )
  },

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await prismaClient.user.findUnique({
      where: {
        email
      }
    })
    if (user) {
      const token = jwt.sign({ id: user.id }, '' + process.env.JWT_SECRET, {
        expiresIn: '3h',
      });
      await prismaClient.user.update({
        where: {
          email
        },
        data: {
          resetToken: token
        }
      });

      mailtrap.sendMail({
        from: "Sammy's Store <contato@sammystore.com>",
        to: `${user.name} <${user.email}>`,
        subject: `Recuperar senha`,
        html: `
        <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Maven+Pro:wght@600&display=swap" rel="stylesheet">
        <style>
          html * {
            font-family: 'Inter', sans-serif;
            font-family: 'Maven Pro', sans-serif;
          }
        </style>
        </head>
        <body>
          <p>Clique no link para atualizar sua senha:</p>
          <a href="${baseUrl()}/reset-password/${token}">Atualizar senha</a>
          <br/>
          <p>Caso não consiga ir pelo link acima, copie e cole esta url no seu navegadir:<br/>
          ${baseUrl()}/reset-password/${token}</p>

        </body>
        `
      }, (err, body) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(body)
        }
      })
      res.send({ message: 'Um link de recuperação foi enviado para seu email' })
    } else {
      res.status(404).send({ message: 'Usuário não encontrado' })
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body
    jwt.verify(
      token,
      '' + process.env.JWT_SECRET,
      async (err: VerifyErrors | null, decode: Jwt | JwtPayload | string | undefined) => {
        if (err) {
          res.status(401).send({ message: 'Token inválido' })
        }
        else {
          const user = await prismaClient.user.findFirst({
            where: {
              resetToken: token
            }
          })
          if (user) {
            if (password) {
              await prismaClient.user.update({
                where: {
                  id: user.id
                },
                data: {
                  password: bcrypt.hashSync(password, 8)
                }
              })
              res.send({ message: 'Senha atualiza com sucesso' })
            }
          } else {
            res.status(404).send({ message: 'Usuário não encontrado' })
          }
        }
      }
    )
  }
};
