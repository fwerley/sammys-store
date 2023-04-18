import passport from 'passport';
import facebook from 'passport-facebook';
import { prismaClient } from '../database/prismaClient';
import { randomUUID } from 'crypto';
import { generateToken } from '../utils';
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user: any, done) => {
    done(null, user);
});

passport.use(new facebook.Strategy({
    clientID: '' + process.env.PASSPORT_FACEBOOK_CLIENT_ID,
    clientSecret: '' + process.env.PASSPORT_FACEBOOK_CLIENT_SECRET,
    callbackURL: `https://sammystore.com.br/api/auth_oauth/signin`
},
    async (accessToken: string, refreshToken: string, profile: facebook.Profile, done: (error: any, user?: any, message?: {}) => void) => {
        try {
            const userRef = await prismaClient.federatedCredentials.findUnique({
                where: {
                    subject: profile.id
                }
            });
            if (!userRef) {
                if (!profile.emails)
                    throw 'No Email in Facebook';
                const newUser = await prismaClient.user.create({
                    data: {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: randomUUID(),
                        active: true
                    }
                })
                const reference = await prismaClient.federatedCredentials.create({
                    data: {
                        userId: newUser.id,
                        provider: profile.provider,
                        subject: profile.id
                    }
                })
                return done(null, {
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        token: generateToken(newUser)
                    }
                });
            } else {
                const user = await prismaClient.user.findFirst({
                    where: {
                        id: userRef.userId,
                    }, include: {
                        seller: true
                    }
                });
                if (user) {
                    if (!user.active) {
                        return done(null, false, {
                            message: 'Sua conta está desativada. Entre em contato com o suporte'
                        });
                    }
                    return done(null, {
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            mobile: user.mobile,
                            isAdmin: user.isAdmin,
                            isSeller: user.isSeller,
                            seller: user.isSeller ? user.seller : {},
                            document: user.document,
                            token: generateToken(user),
                        }
                    });
                }
            }
        } catch (error) {
            done(error, null, { message: 'Sua autenticação falhou. Tente novamente em alguns minutos' });
            // res.status(400).send({ message: 'Sua autenticação falhou. Tente novamente em alguns minutos' })
        };
    }
));