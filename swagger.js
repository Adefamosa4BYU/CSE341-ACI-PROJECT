const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'ACI Tech Hub API',
        description: 'This API provides endpoints for managing USER and TRAINING'
    },
    host: 'localhost:8080',
    basePath: '/api',
    schemes: ['http', 'https'],
    securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter JWT as: Bearer <token>"
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/index.js',
//   './routes/trainings.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);