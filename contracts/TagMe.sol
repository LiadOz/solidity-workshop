//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2; // needed to return arrays

import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "contracts/Tags.sol";

contract TagMe is Tags {
    
    uint MAX_SCORE = 100;
    uint START_SCORE = 80;
    uint SCORE_THRESHOLD = 2; // number of puzzles until start score becomes obsolete
    uint RESERVE_SECONDS = 60;
    address CONTRACT_ADDRESS = address(this);

    struct User {
        // holds information of every solver and puzzle issuer
        bool active;
        uint solved;
        uint disputes; // number of puzzles solved that are disputed
        uint[] puzzle_ids;
        uint created_puzzles_completed; // number of puzzles the user created
                                        // that are solved
        uint puzzles_disputed; // number of times the user has disputed others
    }

    struct Puzzle {
        uint puzzle_id;
        address issuer;
        string puzzle_string;
        string puzzle_desc;
        uint reward;
        uint rating;
        Solution sol; // the solution if it exists
        bool disputed; 
        uint reserved_time;
        address reserved_by;
    }

    struct Solution {
        address solver;
        string result;
        bool solved;
    }

    uint puzzle_count = 0;
    using EnumerableSet for EnumerableSet.UintSet;
    EnumerableSet.UintSet puzzle_ids; // holds all the puzzles and allows O(1) deletion
    mapping (uint => Puzzle) puzzles;

    mapping (address => User) users;

    function createUser() public {
        require(!users[msg.sender].active);
        uint[] memory ids;
        users[msg.sender] = User(true, 0, 0, ids, 0, 0);
    }

    // modifier for any function only a registered user can use
    modifier userAction {
        require(users[msg.sender].active);
        _;
    }
    
    // post a single puzzle
    function postPuzzle(string memory _p_string, string memory _desc, uint _reward,
                        uint _rating) public userAction returns(uint) {
        require(_rating <= MAX_SCORE);
        uint puzzle_id = puzzle_count;
        puzzle_count += 1;
        puzzle_ids.add(puzzle_id);
        puzzles[puzzle_id] = Puzzle(puzzle_id, msg.sender, _p_string, _desc, _reward,
                                    _rating, Solution(address(0), "", false), false, 0, address(0));
        users[msg.sender].puzzle_ids.push(puzzle_id);
        transfer(CONTRACT_ADDRESS, _reward);
        return puzzle_id;
    }

    // post multiple puzzles with same description, reward and rating
    function postMultiplePuzzles(string[] memory _p_strings,
                                 string memory _desc,
                                 uint _reward_per_puzzle,
                                 uint _rating) public userAction {
        for (uint i = 0; i < _p_strings.length; ++i) {
            postPuzzle(_p_strings[i], _desc, _reward_per_puzzle, _rating);
        }
    }

    function checkUser() public view returns(bool) {
        if (users[msg.sender].active)
            return true;
        return false;
    }

    // make sure user can answer
    function canSolve(uint _puzzle_id) private view returns(bool) {
        Puzzle memory p = puzzles[_puzzle_id];
        require(calculateRating(msg.sender) >= p.rating);
        if (p.sol.solved)
            return false;
        return true;
    }

    // check if puzzle is reserved to sender
    function checkReserved(uint _puzzle_id) private view returns(bool) {
        Puzzle memory p = puzzles[_puzzle_id];
        if (p.reserved_by == msg.sender && block.timestamp - p.reserved_time <= RESERVE_SECONDS)
            return true;
        return false;
    } 

    // reserve solution to prevent frontrunning
    function reserveSolution(uint _puzzle_id) public userAction returns(bool) {
        if (canSolve(_puzzle_id) == false)
            return false;

        Puzzle memory p = puzzles[_puzzle_id];
        if (block.timestamp - p.reserved_time > RESERVE_SECONDS) {
            puzzles[_puzzle_id].reserved_by = msg.sender;
            puzzles[_puzzle_id].reserved_time = block.timestamp;
            return true;
        }
        return false;
    }

    // post a soluiton to an unsolved puzzle
    function postSolution(string memory _solution, uint _puzzle_id)
        public userAction returns (bool) {

        if (canSolve(_puzzle_id) == false || checkReserved(_puzzle_id) == false)
            return false;

        Puzzle memory p = puzzles[_puzzle_id];
        puzzles[_puzzle_id].sol = Solution(msg.sender, _solution, true);
        transferFromContract(msg.sender, p.reward);

        users[msg.sender].solved++;
        users[p.issuer].created_puzzles_completed++;
        return true;
    }

    function transferFromContract(address to, uint tokensAmount) private returns (bool success) {
        require(tokensAmount <= balances[CONTRACT_ADDRESS]);
        balances[CONTRACT_ADDRESS] = safeSub(balances[CONTRACT_ADDRESS], tokensAmount);
        balances[to] = safeAdd(balances[to], tokensAmount);
        emit Transfer(CONTRACT_ADDRESS, to, tokensAmount);
        return true;
    }

    // used to dispute a puzzle
    function disputePuzzle(uint _puzzle_id) public {
        Puzzle memory p = puzzles[_puzzle_id];
        require(msg.sender == p.issuer); // make sure only issuer can dispute
        require(p.disputed == false); // disable disputing twice
        puzzles[_puzzle_id].disputed = true;
        users[p.sol.solver].disputes++;
        users[p.issuer].puzzles_disputed++;
    }

    // used for user to remove a puzzle from the blockchain
    function removePuzzle(uint _puzzle_id) public {
        Puzzle memory p = puzzles[_puzzle_id];
        require(msg.sender == p.issuer);
        puzzle_ids.remove(_puzzle_id);
        delete puzzles[_puzzle_id];
    }

    function getPuzzleCount() public view returns (uint) {
        return puzzle_ids.length();
    }

    // use this method to get all puzzles, use getPuzzleCount to find how
    // much puzzles there are
    function getPuzzle(uint _index) public view returns (Puzzle memory) {
        uint puzzle_id = puzzle_ids.at(_index);
        return puzzles[puzzle_id];
    }

    function calculateRating(address _user) public view returns(uint) {
        require(users[_user].active);
        User memory user = users[_user];
        if (user.solved < SCORE_THRESHOLD)
            return START_SCORE;
        return MAX_SCORE * (1 - user.disputes / user.solved);
    }

    function getUserData() public view userAction returns(User memory) {
        return users[msg.sender];
    }

    function getSpecificUser(address _user) public view userAction returns(User memory) {
        return users[_user];
    }

}
