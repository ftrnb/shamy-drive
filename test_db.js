const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const users = await p.user.count();
  const cars = await p.car.count();
  console.log(`Users: ${users}`);
  console.log(`Cars: ${cars}`);
  if (cars > 0) {
      const firstCar = await p.car.findFirst();
      console.log(`First car: ${firstCar.brand} ${firstCar.model}`);
  }
}
main().catch(console.error).finally(() => p.$disconnect());
