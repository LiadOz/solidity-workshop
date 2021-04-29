//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2; // needed to return arrays
// EnumerableSet, EnumerableMap by OpenZeppelin

import "contracts/Tags.sol";

contract TagMe is Tags {
    
    uint MAX_SCORE = 100;
    uint START_SCORE = 80;
    address CONTRACT_ADDRESS = address(this);

    struct User {
        bool active;
        uint solved;
        uint disputes;
        uint[] puzzle_ids;
    }

    struct Puzzle {
        address issuer;
        string puzzle_string;
        string puzzle_desc;
        uint reward;
        uint rating;
        Solution sol;
    }

    struct Solution {
        address solver;
        string result;
        bool solved;
    }

    mapping (address => User) users;
    Puzzle[] puzzles;

    function createUser() public {
        require(!users[msg.sender].active);
        uint[] memory ids;
        users[msg.sender] = User(true, 0, 0, ids);
    }

    modifier userAction {
        require(users[msg.sender].active);
        _;
    }
    
    function postPuzzle(string memory _p_string, string memory _desc, uint _reward,
                        uint _rating) public userAction returns(uint) {
        require(_rating <= MAX_SCORE);
        puzzles.push(Puzzle(msg.sender, _p_string, _desc, _reward, _rating,
                            Solution(address(0), "", false)));
        users[msg.sender].puzzle_ids.push(puzzles.length - 1);
        transfer(CONTRACT_ADDRESS, _reward);
        return puzzles.length - 1;
    }

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

    function postSolution(string memory _solution, uint _puzzle_id)
        public userAction returns (bool) {
        Puzzle memory p = puzzles[_puzzle_id];
        require(calculateRating(msg.sender) >= p.rating);
        if (p.sol.solved)
            return false;
        puzzles[_puzzle_id].sol = Solution(msg.sender, _solution, true);
        transferFromContract(msg.sender, p.reward);
        users[msg.sender].solved++;
        return true;
    }

    function transferFromContract(address to, uint tokensAmount) private returns (bool success) {
        require(tokensAmount <= balances[CONTRACT_ADDRESS]);
        balances[CONTRACT_ADDRESS] = safeSub(balances[CONTRACT_ADDRESS], tokensAmount);
        balances[to] = safeAdd(balances[to], tokensAmount);
        emit Transfer(CONTRACT_ADDRESS, to, tokensAmount);
        return true;
    }

    function disputePuzzle(uint _puzzle_id) public {
        Puzzle memory p = puzzles[_puzzle_id];
        require(msg.sender == p.issuer);
        users[p.sol.solver].disputes++;
    }

    function getPuzzles() public view returns (Puzzle[] memory) {
        return puzzles;
    }

    function calculateRating(address _user) public view returns(uint) {
        require(users[_user].active);
        User memory user = users[_user];
        if (user.solved < 10)
            return START_SCORE;
        return MAX_SCORE * (1 - user.disputes / user.solved);
    }

    function getUserData() public view userAction returns(User memory) {
        return users[msg.sender];
    }

}
