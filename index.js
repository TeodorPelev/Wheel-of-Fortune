const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));

// Add headers to enable CORS (cross origin resource sharing)
app.use(function (req, res, next) {
  
      res.setHeader('Access-Control-Allow-Origin', '*');
  
      res.setHeader('Access-Control-Allow-Methods', 'GET');
  
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
      res.setHeader('Access-Control-Allow-Credentials', true);
      // Pass to next layer of middleware
      next();
});

app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), function () {
  const { port } = server.address();
  console.log(`Listening on port ${port}`);
});