const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost:27017/shoppingcartv1_2' ,
    secret: crypto,
    db: 'shoppingcartv1_2'
}
