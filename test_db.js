const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.count().then(c => {
  console.log('count', c);
  return p.$disconnect();
}).catch(e => {
  console.error('ERR', e.message.slice(0,500));
  console.error(e);
  return p.$disconnect();
});
