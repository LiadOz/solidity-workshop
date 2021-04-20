async function main() {
    await window.ethereum.enable(); // required by metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
                     

    const abi = [{"inputs":[],"name":"createUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_puzzle_id","type":"uint256"}],"name":"disputePuzzle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getPuzzles","outputs":[{"components":[{"internalType":"address","name":"issuer","type":"address"},{"internalType":"string","name":"puzzle_string","type":"string"},{"internalType":"string","name":"puzzle_desc","type":"string"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"uint256","name":"rating","type":"uint256"},{"components":[{"internalType":"address","name":"solver","type":"address"},{"internalType":"string","name":"result","type":"string"},{"internalType":"bool","name":"solved","type":"bool"}],"internalType":"struct Captain.Solution","name":"sol","type":"tuple"}],"internalType":"struct Captain.Puzzle[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserData","outputs":[{"components":[{"internalType":"bool","name":"active","type":"bool"},{"internalType":"uint256","name":"solved","type":"uint256"},{"internalType":"uint256","name":"disputes","type":"uint256"},{"internalType":"uint256[]","name":"puzzle_ids","type":"uint256[]"}],"internalType":"struct Captain.User","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_p_string","type":"string"},{"internalType":"string","name":"_desc","type":"string"},{"internalType":"uint256","name":"_reward","type":"uint256"},{"internalType":"uint256","name":"_rating","type":"uint256"}],"name":"postPuzzle","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_solution","type":"string"},{"internalType":"uint256","name":"_puzzle_id","type":"uint256"}],"name":"postSolution","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]


    const c = new ethers.Contract(address, abi, signer);
    // await c.createUser();
    var results = await c.getUserData();
    console.log(results);

}

window.addEventListener('load', function() {
    main();
});

