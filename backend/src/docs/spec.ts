import swaggerJsdoc from 'swagger-jsdoc';

export const openApiSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Easy Bet Telegram Mini App API',
      version: '0.1.0',
      description: 'Credits, payments, referral, and content delivery API.'
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        TelegramInitData: {
          type: 'apiKey',
          in: 'header',
          name: 'x-telegram-init'
        },
        AdminToken: {
          type: 'apiKey',
          in: 'header',
          name: 'x-admin-token'
        }
      }
    }
  },
  apis: ['src/routes/**/*.ts']
});

