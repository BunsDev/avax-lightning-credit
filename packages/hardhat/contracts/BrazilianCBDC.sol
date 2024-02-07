// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BrazilianCBDC is ERC20, ERC20Burnable, Ownable {
	mapping(address => bool) public privilegedAccounts; //Banks, institutions and government services;

	constructor() ERC20("BrazilianCBDC", "BRLt") Ownable(msg.sender) {
		privilegedAccounts[msg.sender] = true;
	}

	function decimals() public view virtual override returns (uint8) {
		return 2;
	}

	//Access control
	modifier onlyPrivileged() {
		require(
			privilegedAccounts[msg.sender],
			"Acesso negado: conta nao privilegiada"
		);
		_;
	}

	//Add account for onlyPrivileged
	function addPrivilegedAccount(address account) public onlyOwner {
		privilegedAccounts[account] = true;
	}

	//Remove account for onlyPrivileged
	function removePrivilegedAccount(address account) public onlyOwner {
		privilegedAccounts[account] = false;
	}

	// Funtion to allow privileged accounts to make transactions
	function privilegedTransfer(
		address from,
		address to,
		uint256 amount
	) public onlyPrivileged returns (bool) {
		_transfer(from, to, amount);
		return true;
	}

	//Function to allow banks and financial institutions to mint tokens for their users
	function mintUser(
		address user,
		uint256 amount
	) public onlyPrivileged returns (bool) {
		_mint(user, amount);
		return true;
	}

	//Function to allow banks and financial institutions to burn tokens for their users
	function burnUser(
		address user,
		uint256 amount
	) public onlyPrivileged returns (bool) {
		_burn(user, amount);
		return true;
	}
}
