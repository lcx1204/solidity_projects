pragma solidity ^0.7.4;

contract PredictionMarket {
    enum Side {Biden, Trump}
    struct Result {
        Side winner;
        Side loser;
    }

    bool public electionFinished;
    Result public result;

    // how much money has been put on biden or trump
    mapping(Side => uint256) public bets;

    // how much each gambler has put on biden or trump
    mapping(address => mapping(Side => uint256)) public betsPerGambler;
    address public oracle;

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function placeBets(Side _side) external payable {
        require(electionFinished == false, "election is finished");
        bets[_side] += msg.value;
        betsPerGambler[msg.sender][_side] += msg.value;
    }

    function withdrawGain() external {
        uint256 gamblerBet = betsPerGambler[msg.sender][result.winner];
        require(gamblerBet > 0, "you do not have any winning bet");
        require(electionFinished == true, "election not finished");

        // take back all his money in the winner pool
        // take back his winner pool share of the loser pool
        uint256 gain =
            gamblerBet +
                (bets[result.loser] * gamblerBet) /
                bets[result.winner];

        betsPerGambler[msg.sender][Side.Biden] = 0;
        betsPerGambler[msg.sender][Side.Trump] = 0;
        msg.sender.transfer(gain);
    }

    function reportResult(Side _winner, Side _loser) external {
        require(msg.sender == oracle, "only oracle can call this function");
        require(electionFinished == false, "election is already finished");
        result.winner = _winner;
        result.loser = _loser;
        electionFinished = true;
    }
}
