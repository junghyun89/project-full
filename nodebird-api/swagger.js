const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Nodebird API',
      version: '1.0.0',
      description: 'Nodebird API with express',
    },
    host: 'localhost:8002/v2',
    basePath: '/',
  },
  apis: ['./routes/*.js', './swagger/*'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
