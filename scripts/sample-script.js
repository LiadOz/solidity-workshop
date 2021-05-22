// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

    const Cap = await hre.ethers.getContractFactory("Captain");
    const c = await Cap.deploy();
    await c.createUser();
    await c.postPuzzle("p1", "put 1", 100, 50);
    await c.postPuzzle("p2", "put 2", 100, 50);
    // var p = await c.getPuzzles()
    // console.log(p);
    await c.postSolution("1", 0);
    await c.disputePuzzle(0);
    p = await c.getPuzzles()
    console.log(p);
    var user = await c.getUserData();
    console.log(user);
    // await clients.printPuzzles();
    // result = await clients.getPuzzle(200);
    // console.log(result);

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
