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
    await setupUsers(tag);

    console.log("TagMe deployed to:", tag.address);
}


async function setupUsers(contract) {
    const url = "http://127.0.0.1:8545/"
    const provider = ethers.getDefaultProvider(url);

    // initiating users
    const cws1 = contract.connect(await new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider));
    await cws1.createUser();
    const cws2 = contract.connect(await new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider));
    await cws2.createUser();
    const cws3 = contract.connect(await new ethers.Wallet("0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", provider));
    await cws3.createUser();
    const cws4 = contract.connect(await new ethers.Wallet("0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0", provider));
    await cws4.createUser();
    const cws5 = contract.connect(await new ethers.Wallet("0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e", provider));
    await cws5.createUser();
    	
    await cws1.postMultiplePuzzles(
        ["https://www.treehugger.com/thmb/T7LvwJkCaDL7D6yK60528f3Ooj4=/667x1000/filters:fill(auto,1)/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2014__06__shutterstock_64983883-3801a7a9fc014d719036edaf33a31189.jpg",
         "http://www.viralfancy.com/wp-content/uploads/2017/06/Bullmastiff.jpg",
         "https://firstvet.com/uploaded/images/articles/_1200x600_crop_center-center_none/hypothyroid-dog.jpg",
         "https://cdn.britannica.com/22/206222-131-E921E1FB/Domestic-feline-tabby-cat.jpg",
        "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip"],
        "Dog or a cat?", 500, 75);
    await cws2.postMultiplePuzzles(
        ["https://ichef.bbci.co.uk/news/976/cpsprodpb/133D9/production/_98690887_gettyimages-92280592.jpg",
         "https://www.publicdomainpictures.net/pictures/280000/velka/frilled-lizard-1538482186mzE.jpg",
         "https://telepathicstuntman.com/wp-content/uploads/2017/08/western-sagebrush-lizard.jpg",
         "https://www.macmillandictionary.com/external/slideshow/thumb/lizard_thumb.jpg"],
        "Koala or lizard", 300, 80);
    await cws3.postMultiplePuzzles(
        ["https://static.zajo.net/content/mediagallery/zajo_dcat/image/product/types/X/9088.png",
         "https://static.zajo.net/content/mediagallery/zajo_dcat/image/product/types/X/9088.png",
         "https://static.zajo.net/content/mediagallery/zajo_dcat/image/product/types/X/9088.png",
         "https://www.helikon-tex.com/media/catalog/product/cache/4/image/9df78eab33525d08d6e5fb8d27136e95/s/p/sp-pgm-dc-11.jpg",
         "https://cdn.shopify.com/s/files/1/0007/0051/4360/products/WVAWB-H08326_PLA_00_1000x.jpg?v=1571712237"],
        "Shirt or pants", 200, 82);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
