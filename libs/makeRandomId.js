const generateRandomString = length => Math.random().toString(36).substring(2, length + 2);

module.exports = generateRandomString;
