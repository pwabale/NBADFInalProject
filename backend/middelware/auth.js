const jwt = require('jsonwebtoken');
// const config = require('config');

module.exports = function (req, res, next) {
  let token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(token, "Hello"); 
    const currentTime = new Date().toISOString();

    // Compare the current time with the expiration time
    if (currentTime > decoded.expiration) {
      res.status(400).send('Token has expired');
      return;
    } 
    req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}