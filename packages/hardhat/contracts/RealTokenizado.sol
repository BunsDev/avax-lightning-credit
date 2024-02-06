// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealTokenizado is ERC20, ERC20Burnable, Ownable {
	mapping(address => bool) public privilegedAccounts; //Servicos gov e bancos;

	constructor() ERC20("RealTokenizado", "BRLt") Ownable(msg.sender) {
		privilegedAccounts[msg.sender] = true;
	}

	function decimals() public view virtual override returns (uint8) {
		return 2;
	}

	//Modificador para restringir o acesso somente a contas privilegiadas
	modifier onlyPrivileged() {
		require(
			privilegedAccounts[msg.sender],
			"Acesso negado: conta nao privilegiada"
		);
		_;
	}

	// Função para adicionar um endereço à lista de contas privilegiadas
	function addPrivilegedAccount(address account) public onlyOwner {
		privilegedAccounts[account] = true;
	}

	//Função para remover um endereço da lista de contas privilegiadas
	function removePrivilegedAccount(address account) public onlyOwner {
		privilegedAccounts[account] = false;
	}

	// Função para transferir tokens de qualquer conta sem necessidade de aprovação
	function privilegedTransfer(
		address from,
		address to,
		uint256 amount
	) public onlyPrivileged returns (bool) {
		_transfer(from, to, amount);
		return true;
	}

	function myntUser(
		address user,
		uint256 amount
	) public onlyPrivileged returns (bool) {
		_mint(user, amount);
		return true;
	}

	function burnUser(
		address user,
		uint256 amount
	) public onlyPrivileged returns (bool) {
		_burn(user, amount);
		return true;
	}
}
