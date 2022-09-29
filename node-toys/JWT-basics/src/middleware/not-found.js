const notFound = (req, res) => res.status(404).send('Route doees not exist');

module.exports = notFound;
