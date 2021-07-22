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

    const TagMe = await hre.ethers.getContractFactory("TagMe");
    const tag = await TagMe.deploy();
    await tag.deployed();

    const url = "http://127.0.0.1:8545/"
    const provider = ethers.getDefaultProvider(url);
    const test_wallet = await new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const cws = tag.connect(test_wallet);
    await cws.createUser();
    console.log(test_wallet);
    console.log(await cws.postPuzzle("wat", "desc", 19, 80));
    console.log(await cws.getPuzzles());

    console.log("TagMe deployed to:", tag.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
