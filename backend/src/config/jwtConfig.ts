import { env } from './env';

export const jwtConfig = {
    secret: env.jwt.secretKey,
    expiresIn: env.jwt.expiresIn,
    refreshTokenExpiresIn: env.jwt.refreshTokenExpiresIn,
};