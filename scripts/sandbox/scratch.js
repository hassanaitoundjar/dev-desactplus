require('ts-node').register();
const { getFeaturedProducts } = require('./app/repositories/product.repository.ts');
getFeaturedProducts().then(res => console.log(res.length));
