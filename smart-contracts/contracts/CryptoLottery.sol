// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CryptoLottery {
    address public owner;
    address[] public players;
    bool public isActive;
    uint public entryFee;
    uint public lotteryId;
    mapping(address => bool) public hasEntered;

    event LotteryStarted(uint lotteryId, uint entryFee);
    event PlayerEntered(address indexed player);
    event WinnerSelected(address indexed winner, uint amount);
    event LotteryReset();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier lotteryActive() {
        require(isActive, "Lottery is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
        lotteryId = 1;
    }

    function startLottery(uint _entryFee) external onlyOwner {
        require(!isActive, "Lottery already active");
        delete players;
        isActive = true;
        entryFee = _entryFee;
        emit LotteryStarted(lotteryId, entryFee);
    }

    function enter() external payable lotteryActive {
        require(msg.value == entryFee, "Incorrect ETH sent");
        require(!hasEntered[msg.sender], "Already entered this lottery");
        players.push(msg.sender);
        hasEntered[msg.sender] = true;
        emit PlayerEntered(msg.sender);
    }

    function pickWinner() external onlyOwner lotteryActive {
        require(players.length > 0, "No players joined");

        uint rand = uint(
            keccak256(
                abi.encodePacked(block.prevrandao, block.timestamp, players)
            )
        );
        uint winnerIndex = rand % players.length;
        address winner = players[winnerIndex];

        uint prize = address(this).balance;
        payable(winner).transfer(prize);

        emit WinnerSelected(winner, prize);
        isActive = false;
        lotteryId++;
        emit LotteryReset();
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
