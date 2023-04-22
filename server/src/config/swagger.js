const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'This is an API to user authentication',
      contact: {
        name: 'Bravos Dev',
        url: 'https://bravos-dev.netlify.app',
        email: 'mbravosarria@gmail.com'
      }
    },
    schemes: ['http'],
    tags: [
      {
        name: 'Auth',
        description: 'Test auth routes'
      },
      {
        name: 'Users',
        description: 'Test users routes'
      }
    ]
  },
  apis: [path.join(__dirname, '../**/*.js')]
}

module.exports = swaggerJsdoc(options)
