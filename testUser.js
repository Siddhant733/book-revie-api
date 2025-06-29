const User = require('./models/User');

async function test() {
  console.log('User model loaded:', User.modelName);
}

test();
