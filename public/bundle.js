async function main() {
    const tm = new TagMe();
    await tm.init();
    // await tm.createUser();
    await tm.printUserData();
    console.log(await tm.userExists());
}

class TagMe {
    async init() {
        // await window.ethereum.enable(); // required by metamask

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const resp = await fetch("/get_abi"); // getting the abi
        const abi = JSON.stringify(await resp.json());

        const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        this.contract = new ethers.Contract(address, abi, signer);
    }

    async printUserData() {
        var results = await this.contract.getUserData();
        console.log(results);
    }

    async createUser() {
        await this.contract.createUser();
    }

    async userExists() {
        return await this.contract.checkUser();
    }

}

window.addEventListener('load', function() {
    main();
});

