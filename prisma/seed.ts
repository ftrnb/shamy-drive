import { PrismaClient, Transmission, Fuel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cars = [
  {
    brand: "Dacia",
    model: "Logan",
    category: "Berline",
    pricePerDay: 250,
    transmission: Transmission.MANUAL,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2023,
    mileage: null,
    description: "Berline économique et fiable, idéale pour la ville et les trajets Agadir-Marrakech. Climatisation, Bluetooth, coffre généreux. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/Loganblanche.png" }],
  },
  {
    brand: "Dacia",
    model: "Logan",
    category: "Berline",
    pricePerDay: 250,
    transmission: Transmission.MANUAL,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2022,
    mileage: null,
    description: "Même modèle en gris sidéral, entretenu, parfait pour familles ou pros en déplacement. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/logangris.png" }],
  },
  {
    brand: "Dacia",
    model: "Sandero",
    category: "Citadine",
    pricePerDay: 250,
    transmission: Transmission.MANUAL,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2023,
    mileage: null,
    description: "Citadine agile, consommation réduite, idéale pour circuler dans Agadir et stationner en centre-ville. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/sandero.png" }],
  },
  {
    brand: "Dacia",
    model: "Duster",
    category: "SUV",
    pricePerDay: 350,
    transmission: Transmission.MANUAL,
    fuel: Fuel.DIESEL,
    seats: 5,
    year: 2023,
    mileage: null,
    description: "SUV robuste, garde au sol élevée, parfait pour excursions vers Taghazout, Paradise Valley ou le désert. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/duster.png" }],
  },
  {
    brand: "Hyundai",
    model: "Accent",
    category: "Berline",
    pricePerDay: 300,
    transmission: Transmission.AUTOMATIC,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2024,
    mileage: null,
    description: "Berline automatique confortable, finition soignée, très demandée pour séjours business. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/Accentblanche.png" }],
  },
  {
    brand: "Hyundai",
    model: "Accent",
    category: "Berline",
    pricePerDay: 300,
    transmission: Transmission.AUTOMATIC,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2023,
    mileage: null,
    description: "Même finition en noir élégant, boîte auto, climatisation bi-zone. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/Accentnoir.png" }],
  },
  {
    brand: "Peugeot",
    model: "208",
    category: "Citadine",
    pricePerDay: 300,
    transmission: Transmission.MANUAL,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2024,
    mileage: null,
    description: "Peugeot 208 récente, design moderne, écran tactile, caméra de recul, très économique. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/208.png" }],
  },
  {
    brand: "Kia",
    model: "Sonet",
    category: "SUV",
    pricePerDay: 400,
    transmission: Transmission.AUTOMATIC,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2024,
    mileage: null,
    description: "SUV compact premium, boîte auto, toit panoramique, idéal pour familles et longues routes côtières. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/kiasonet.png" }],
  },
  {
    brand: "Haval",
    model: "Jolion",
    category: "SUV",
    pricePerDay: 400,
    transmission: Transmission.AUTOMATIC,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2024,
    mileage: null,
    description: "SUV Haval Jolion, récent, spacieux, technologies d'aide à la conduite, grand coffre. Kilométrage illimité inclus.",
    available: true,
    images: [{ url: "/cars/Haval.png" }],
  },
  {
    brand: "Renault",
    model: "Clio 5",
    category: "Citadine",
    pricePerDay: 300,
    transmission: Transmission.MANUAL,
    fuel: Fuel.ESSENCE,
    seats: 5,
    year: 2023,
    mileage: null,
    description: "Renault Clio 5, citadine référence, maniable, kilométrage illimité inclus. Parfaite pour Agadir centre et courts séjours.",
    available: true,
    images: [{ url: "/cars/clio5.png" }],
  },
];

async function main() {
  console.log("🌱 Seed Shamy Drive...");

  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Shamy Admin",
      email: "admin@shamydrive.ma",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Test Client",
      email: "client@test.ma",
      password: userPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  console.log(`👤 Admin: ${admin.email} / Admin123!`);
  console.log(`👤 User: ${user.email} / User123!`);

  for (const car of cars) {
    const { images, ...carData } = car;
    const created = await prisma.car.create({
      data: {
        ...carData,
        images: {
          create: images,
        },
      },
      include: { images: true },
    });
    console.log(`🚗 ${created.brand} ${created.model} - ${created.pricePerDay} DH/j`);
  }

  console.log("✅ Seed terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
