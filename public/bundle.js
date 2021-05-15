const app = new App();

async function main() {
    await app.init();
    // await app.createUser();
    // console.log(await app.userExists());
    // await app.postPuzzle(
    //     "https://thefunnybeaver.com/wp-content/uploads/2019/03/an29.jpg",
    //     "animal ?", 5, 70);
    // console.log(await app.getSolveablePuzzles());
    // console.log(await app.getUserPuzzles());
    // p = ['h', 'i', 'j', 'k'];
    // await app.addPuzzles(p, 'letter stuff ?', 30, 81);
    // await app.addPuzzles(p, 'letter stuff ?', 3, 71);
    // console.log(await app.getRating());
    // await app.postSolution("giraffe", 0);
}

class App {

    async init() {
        this.tm = new TagMe();
        await this.tm.init();
        await this.reloadData();
    }

    async reloadData() {
        if (await this.userExists) {
            var ud = this.tm.getUserData();
            var puzzles = this.tm.getPuzzles();
            var rating = this.tm.getRating();
            this.user = await ud;
            this.userRating = await rating;
            this.puzzles = await puzzles;
        }
    }

    async disputePuzzle(puzzleId) {
        await this.tm.disputePuzzle(puzzleId);
    }

    async getSolveablePuzzles() {
        await this.reloadData();
        const results = this.puzzles.filter(
            puzzle => !(puzzle.solution.solved || this.userRating < puzzle.rating))
        return results;
    }

    async postSolution(solution, puzzleId) {
        await this.tm.postSolution(solution, puzzleId);
    }

    async addPuzzles(puzzles, desc, reward, rating) {
        if (puzzles.length > 1) {
            await this.tm.postMultiplePuzzles(puzzles, desc, reward, rating);
        }
        else {
            await this.tm.postPuzzle(puzzles[0], desc, reward, rating);
        }
        await this.reloadData();
    }

    getUserPuzzles() {
        return this.user.getUserPuzzles(this.puzzles);
    }

    csvSolutions() {
        const strings = [];
        const puzzles = this.getUserPuzzles();
        for(let puzzle of puzzles) {
            if (puzzle.solution.solved)
                strings.push(puzzle.img + " " + puzzle.solution.result);
        }
        return strings.join(',');
    }

    async userExists() {
        return this.tm.userExists();
    }

    async createNewUser() {
        await this.tm.createUser();
    }
}

class TagMe {
    async init() {
        // await window.ethereum.enable(); // required by metamask or is it

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();

        const resp = await fetch("/get_abi"); // getting the abi
        const abi = JSON.stringify(await resp.json());

        const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        this.contract = new ethers.Contract(address, abi, this.signer);
    }

    async getUserData() {
        var result = await this.contract.getUserData();
        return new User(result);
    }

    async createUser() {
        await this.contract.createUser();
    }

    async userExists() {
        return await this.contract.checkUser();
    }

    async postPuzzle(img, desc, reward, rating) {
        await this.contract.postPuzzle(img, desc, reward, rating);
    }

    async postMultiplePuzzles(puzzles, desc, reward, rating) {
        await this.contract.postMultiplePuzzles(puzzles, desc, reward, rating);
    }

    async postSolution(solution, puzzle_id) {
        await this.contract.postSolution(solution, puzzle_id);
    }

    async disputePuzzle(puzzle_id) {
        await this.contract.disputePuzzle(puzzle_id);
    }

    async getPuzzles() {
        const puzzles = await this.contract.getPuzzles();
        var parsed = [];
        for(let puzzle of puzzles) {
            parsed.push(new Puzzle(puzzle));
        }
        return parsed;
    }

    async getRating() {
        const myAddress = await this.signer.getAddress();
        const result = await this.contract.calculateRating(myAddress);
        return result.toNumber();
    }

}

class Puzzle {
    constructor(object) {
        this.issuer = object[0];
        this.img = object[1];
        this.desc = object[2];
        this.reward = object[3].toNumber();
        this.rating = object[4].toNumber();
        this.solution = new Solution(object[5]);
    }

    isSolved() {
        return this.solution.solved;
    }
}

class Solution {
    constructor(object) {
        this.solver = object[0];
        this.result = object[1];
        this.solved = object[2];
    }
}

class User {
    constructor(object) {
        this.active = object[0];
        this.solved = object[1].toNumber();
        this.dispute = object[2].toNumber();
        this.puzzle_ids = [];
        for(let id of object[3]) {
            this.puzzle_ids.push(id.toNumber());
        }
    }

    getUserPuzzles(allPuzzles) {
        const userPuzzles = [];
        for(let id of this.puzzle_ids) {
            userPuzzles.push(allPuzzles[id]);
        }
        return userPuzzles;
    }
}

window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
         
        web3js = new Web3(web3.currentProvider);
      } else {
       
       
      }

    main();
});