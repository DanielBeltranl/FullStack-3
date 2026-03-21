const { EventEmitter } = require('events');
const broker = new EventEmitter();

module.exports = { broker };