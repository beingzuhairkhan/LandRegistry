// const hre = require("hardhat");
import hre from 'hardhat'
async function main() {
  const LandRegistry = await hre.ethers.getContractFactory("Land");
  const land = await LandRegistry.deploy();
  await land.deployed();

  console.log("LandRegistry contract deployed to:", land.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
