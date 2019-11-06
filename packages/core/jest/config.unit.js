const config = require('./config.js');

module.exports = Object.assign({}, config, {
    testRegex: '\\.test\\.(t|j)s$',
});
