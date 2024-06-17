const {
  time,
  loadFixture,
  
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("CrowdFunding", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {

    const goal = 1000; // Example value for the goal
    const twoWeeksInSeconds = 14 * 24 * 60 * 60; // Two weeks in seconds
    const deadline = Math.floor(Date.now() / 1000) + twoWeeksInSeconds;


      const CrowdFunding = await ethers.getContractFactory("Crowdfunding");
      const crowdFunding = await CrowdFunding.deploy(goal, deadline);
      const signers = await ethers.getSigners();
      const admin = signers[0];
      const contributor = signers[1];
      console.log('admin address :',admin.address);
      return { crowdFunding, admin , contributor };


 
 
  }


    it("Should deploy and set the admin correctly", async function () {
      const { crowdFunding , admin} = await loadFixture(
        deployContractAndSetVariables);

      console.log("Admin:", admin.address);
      console.log("Contract admin:", await crowdFunding.admin());
      console.log("contract Address:" , crowdFunding.target);

      expect(await crowdFunding.admin()).to.equal(admin.address);
    });

 

});
