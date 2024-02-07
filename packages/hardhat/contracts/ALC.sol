//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface INTBt {
	function balanceOf(address) external returns (uint);

	function name() external returns (string memory);

	function symbol() external returns (string memory);

	function decimals() external returns (uint);

	function totalSupply() external returns (uint);

	function privilegedTransfer(address, address, uint) external returns (bool);

	function getTokenPrice() external returns (uint256);
}

interface IBRLt {
	function balanceOf(address) external returns (uint);

	function name() external returns (string memory);

	function symbol() external returns (string memory);

	function decimals() external returns (uint);

	function totalSupply() external returns (uint);

	function privilegedTransfer(address, address, uint) external returns (bool);
}

contract ALC is Ownable {
	address public BRLtAddress;
	mapping(address => bool) public privilegedAccounts; //Banks, financial institutions and Government services;
	mapping(address => mapping(address => uint256)) public debt;
	mapping(address => mapping(address => uint256)) public collateral;

	constructor(address _BRLtAddress) Ownable(msg.sender) {
		BRLtAddress = _BRLtAddress;
		privilegedAccounts[msg.sender] = true;
		privilegedAccounts[address(this)] = true;
	}

	modifier onlyPrivileged() {
		require(
			privilegedAccounts[msg.sender],
			"Access denied: account is not privileged."
		);
		_;
	}

	function addPrivilegedAccount(address account) public onlyOwner {
		privilegedAccounts[account] = true;
	}

	function removePrivilegedAccount(address account) public onlyOwner {
		privilegedAccounts[account] = false;
	}

	function creditOperation(
		address _investor,
		address _NTBtAddress,
		uint256 _BRLAmount
	) public onlyPrivileged returns (bool) {
		uint256 NTBtAmount = (_BRLAmount * 10 ** 18) /
			(INTBt(_NTBtAddress).getTokenPrice());

		//Locks collateral asset from user
		privilegedTransferNTBt(
			_NTBtAddress,
			_investor,
			address(this),
			NTBtAmount
		);

		//Sends Brazilian CBDC for the borrower;
		privilegedTransferReal(msg.sender, _investor, _BRLAmount);

		debt[_investor][msg.sender] += _BRLAmount;
		collateral[_investor][msg.sender] += _BRLAmount;
		return true;
	}

	//Borrower pays lender
	function payCreditor(
		address _investor,
		uint256 _BRLAmount
	) public onlyPrivileged returns (bool) {
		privilegedTransferReal(_investor, msg.sender, _BRLAmount);

		debt[_investor][msg.sender] -= _BRLAmount;

		return true;
	}

	//Borrower takes the collateral asset back
	function getCollateralBack(
		address _investor,
		address _NTBtAddress,
		uint256 _BRLAmount
	) public onlyPrivileged returns (bool) {
		uint256 debtCollateralBalance = collateral[_investor][msg.sender] -
			debt[_investor][msg.sender];
		require(
			debtCollateralBalance > _BRLAmount,
			"Collateral asset is not avaiable for withdraw."
		);

		uint256 NTBtAmount = (_BRLAmount * 10 ** 18) /
			(INTBt(_NTBtAddress).getTokenPrice());
		privilegedTransferNTBt(
			_NTBtAddress,
			address(this),
			_investor,
			NTBtAmount
		);
		collateral[_investor][msg.sender] -= _BRLAmount;

		return true;
	}

	function privilegedTransferReal(
		address _from,
		address _to,
		uint256 _amount
	) public onlyPrivileged {
		IBRLt(BRLtAddress).privilegedTransfer(_from, _to, _amount);
	}

	function privilegedTransferNTBt(
		address _NTBtAddress,
		address _from,
		address _to,
		uint256 _amount
	) public onlyPrivileged {
		INTBt(_NTBtAddress).privilegedTransfer(_from, _to, _amount);
	}
}
