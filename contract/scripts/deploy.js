const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const hre = require("hardhat");



async function main() {
  try{
   // We get the contract to deploy
   const Contract = await hre.ethers.getContractFactory("Crowdfunding");
   const contract = await Contract.deploy(10000,43567892);
   const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
 
   //await contract.deployed();
   
   console.log("Contract deployed to:", contract.target);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  