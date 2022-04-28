import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const generateToken = (user: User) => {
  const keySecret = '' + process.env.JWT_SECRET;
  return jwt.sign(user, keySecret, {
    expiresIn: '30d',
  });
};
