export default () => ({
    port: process.env.PORT ?? 3000,
    database: {
        url: process.env.DATABASE_URL ?? '',
    },
    cors: {
        allowedOrigins: process.env.CORS_ALLOWED_ORIGINS ?? '',
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? '',
    },
    accessToken: {
        expiration: process.env.ACCESS_TOKEN_EXP ?? '1h',
    },
    responseCookie: {
        domain: process.env.RESPONSE_COOKIE_DOMAIN ?? '',
    },
});
