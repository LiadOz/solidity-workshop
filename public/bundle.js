class App {

    async init() {
        this.tm = new TagMe();
        await this.tm.init();
        await this.reloadData();
    }

    async reloadData() {
        if (await this.userExists()) {
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

    async removePuzzle(puzzleId) {
        await this.tm.removePuzzle(puzzleId);
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
        await window.ethereum.enable(); // required by metamask or is it

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();

        const resp = await fetch("/get_abi"); // getting the abi
        const abi = JSON.stringify(await resp.json());

        const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        this.contract = new ethers.Contract(address, abi, this.signer);
    }

    async getUserData() {
        var result = await this.contract.getUserData();
        return new User(result, false);
    }

    async getSpecificUser(user_address) {
        return new User(
            await this.contract.getSpecificUser(user_address), true);
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

    async removePuzzle(puzzle_id) {
        await this.contract.removePuzzle(puzzle_id);
    }

    async getPuzzles() {
        const puzzleCount = await this.contract.getPuzzleCount();
        var parsed = [];
        for (var i = 0; i < puzzleCount; i++) {
            var puzzle = new Puzzle(await this.contract.getPuzzle(i))
            puzzle.addIssuerData(await this.getSpecificUser(puzzle.issuer));
            parsed.push(puzzle);
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
        this.id = object[0].toNumber();
        this.issuer = object[1];
        this.img = object[2];
        this.desc = object[3];
        this.reward = object[4].toNumber();
        this.rating = object[5].toNumber();
        this.solution = new Solution(object[6]);
        this.disputed = object[7];
    }

    addIssuerData(user) {
        this.issuer_puzzles_completed = user.created_puzzles_completed;
        this.issuer_puzzles_disputed = user.puzzles_disputed;
        this.issuer_rating = user.puzzles_disputed / user.created_puzzles_completed;
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
    constructor(object, only_disputes) {
        if (!only_disputes) {
            this.active = object[0];
            this.solved = object[1].toNumber();
            this.dispute = object[2].toNumber();
            this.puzzle_ids = [];
            for(let id of object[3]) {
                this.puzzle_ids.push(id.toNumber());
            }
        }
        this.created_puzzles_completed = object[4].toNumber();
        this.puzzles_disputed = object[5].toNumber();
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
    // main();
});

const app = new App();

async function main() {
    await app.init();
}
