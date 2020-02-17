const http = require('http');
const app= require('./app');//we are importing the app file


const port= process.env.PORT || 3000

const server = http.createServer(app);


console.log('server is loading', port);

server.listen(port);
