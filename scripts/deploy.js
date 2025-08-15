// const hre = require("hardhat");

// async function main() {
//   const [owner, user2] = await hre.ethers.getSigners();
//   const PropertyNFT = await hre.ethers.getContractFactory("PropertyNFT");
//   const nft = await PropertyNFT.deploy();
//   await nft.deployed();

//   // --- Cars and Houses data for both accounts ---
//   const cars1 = [
//     {
//       name: "Tesla Model 3 Performance",
//       value: 48000,
//       purchaseDate: "2022-01-20",
//       vin: "5YJ3E1EA7JF123456"
//     },
//     {
//       name: "Volkswagen Golf 8",
//       value: 24000,
//       purchaseDate: "2020-08-10",
//       vin: "WVWZZZ1KZLW123456"
//     },
//     {
//       name: "BMW X5 M50d",
//       value: 64000,
//       purchaseDate: "2021-04-25",
//       vin: "WBAPM71090E123456"
//     }
//   ];
//   const houses1 = [
//     {
//       name: "Lakeview Villa",
//       value: 350000,
//       purchaseDate: "2019-07-17",
//       addr: "111 Lakeview Dr, Zurich, Switzerland"
//     },
//     {
//       name: "Downtown Loft",
//       value: 220000,
//       purchaseDate: "2020-11-02",
//       addr: "44 King Street, London, UK"
//     },
//     {
//       name: "Sunny Beach House",
//       value: 270000,
//       purchaseDate: "2018-05-18",
//       addr: "9 Ocean Ave, Miami Beach, FL"
//     }
//   ];
//   const cars2 = [
//     {
//       name: "Ford Mustang GT",
//       value: 56000,
//       purchaseDate: "2021-09-14",
//       vin: "1FA6P8CF8K5123456"
//     },
//     {
//       name: "Renault Zoe Electric",
//       value: 21000,
//       purchaseDate: "2023-02-22",
//       vin: "VF1AGVYB548123456"
//     },
//     {
//       name: "Audi Q7 S Line",
//       value: 72000,
//       purchaseDate: "2017-12-29",
//       vin: "WA1VAAF73JD123456"
//     }
//   ];
//   const houses2 = [
//     {
//       name: "Alpine Chalet",
//       value: 300000,
//       purchaseDate: "2017-01-12",
//       addr: "77 Mountain Rd, Innsbruck, Austria"
//     },
//     {
//       name: "Parisian Apartment",
//       value: 450000,
//       purchaseDate: "2020-03-05",
//       addr: "13 Rue de Rivoli, Paris, France"
//     },
//     {
//       name: "City Penthouse",
//       value: 600000,
//       purchaseDate: "2021-10-22",
//       addr: "1 Central Park South, New York, NY"
//     }
//   ];

//   // Mint to Account 1 (owner)
//   for (const car of cars1) {
//     await nft.mintCar(
//       owner.address,
//       car.name,
//       car.value,
//       car.purchaseDate,
//       car.vin
//     );
//   }
//   for (const house of houses1) {
//     await nft.mintHouse(
//       owner.address,
//       house.name,
//       house.value,
//       house.purchaseDate,
//       house.addr
//     );
//   }

//   // Mint to Account 2 (user2)
//   for (const car of cars2) {
//     await nft.mintCar(
//       user2.address,
//       car.name,
//       car.value,
//       car.purchaseDate,
//       car.vin
//     );
//   }
//   for (const house of houses2) {
//     await nft.mintHouse(
//       user2.address,
//       house.name,
//       house.value,
//       house.purchaseDate,
//       house.addr
//     );
//   }

//   console.log("PropertyNFT deployed to:", nft.address);
//   console.log("Minted 6 NFTs to each account (3 cars + 3 houses)");
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const hre = require("hardhat");

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}
function randomVin() {
  return (
    Array(17)
      .fill(0)
      .map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)])
      .join("")
  );
}
function randomAddress() {
  const cities = [
    "Zurich, Switzerland", "London, UK", "Miami Beach, FL", "Innsbruck, Austria",
    "Paris, France", "New York, NY", "Tokyo, Japan", "Los Angeles, CA",
    "Munich, Germany", "Sydney, Australia"
  ];
  return `${Math.floor(Math.random() * 300) + 1} Random St, ${cities[Math.floor(Math.random() * cities.length)]}`;
}

function randomCarName() {
  const names = [
    "Tesla Model 3", "Volkswagen Golf", "BMW X5", "Ford Mustang", "Renault Zoe",
    "Audi Q7", "Mercedes GLC", "Toyota Corolla", "Honda Civic", "Porsche 911"
  ];
  return names[Math.floor(Math.random() * names.length)] + 
    (Math.random() < 0.5 ? " Performance" : "");
}
function randomHouseName() {
  const types = ["Villa", "Loft", "Beach House", "Apartment", "Chalet", "Penthouse", "Estate"];
  const adjectives = ["Lakeview", "Downtown", "Sunny", "Alpine", "Parisian", "City", "Modern", "Luxury"];
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] + " " +
    types[Math.floor(Math.random() * types.length)]
  );
}

async function main() {
  const [owner, user2] = await hre.ethers.getSigners();
  const PropertyNFT = await hre.ethers.getContractFactory("PropertyNFT");
  const nft = await PropertyNFT.deploy();
  await nft.deployed();

  // --- Generate random cars/houses for each account (min 6, max 10) ---
  for (const user of [owner, user2]) {
    const carCount = Math.floor(Math.random() * 5) + 6;     // 6-10 cars
    const houseCount = Math.floor(Math.random() * 5) + 6;   // 6-10 houses

    for (let i = 0; i < carCount; i++) {
      await nft.mintCar(
        user.address,
        randomCarName(),
        Math.floor(Math.random() * 80000) + 15000,         // Random value between 15k-95k
        randomDate(new Date(2015, 0, 1), new Date()),
        randomVin()
      );
    }

    for (let i = 0; i < houseCount; i++) {
      await nft.mintHouse(
        user.address,
        randomHouseName(),
        Math.floor(Math.random() * 800000) + 120000,       // Random value between 120k-920k
        randomDate(new Date(2010, 0, 1), new Date()),
        randomAddress()
      );
    }

    console.log(
      `Minted ${carCount} cars and ${houseCount} houses to account: ${user.address}`
    );
  }

  console.log("PropertyNFT deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
