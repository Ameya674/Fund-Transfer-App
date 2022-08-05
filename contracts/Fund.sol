// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Fund {
    uint public noOfFunders;

    mapping(uint => address) private funders;

    receive() external payable {
        
    }

    function transfer() external payable {
        funders[noOfFunders] = msg.sender;
    }

    function withdraw(uint withdrawAmount) external {
        require(withdrawAmount < 10000000000000000000, 'Amount exceeds withdraw limit(10 Ether)');
        payable(msg.sender).transfer(withdrawAmount);
    }
}