const bcrypt = require('bcrypt');

const password = 'admin'; 
const saltRounds = 10;       

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Hata:', err);
    return;
  }
  console.log('Hashlenmiş parola:', hash);
});
 