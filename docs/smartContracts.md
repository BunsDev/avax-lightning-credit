
## 👩‍💻 Smart Contracts Docs


### 1) Brazilian CBDC (BRLt.sol)
Contract address on Fuji Testnet: 0x3B7aA83D8525C0260F4861E14f87506ed0244A9F

A smart contract developed in the ERC-20 standard to simulate the Brazilian CBDC. In addition to the essential ERC-20 functions, the following features were also developed:

**1.1) privilegedAccounts:** permissioning so that only the addresses of financial institutions, the Central Bank, and government services have access to these functions. Thus, it is up to the Central Bank to call the addPrivilegedAccount function to allow a new financial institution to operate with the Brazilian CBDC.

**1.2) privilegedTransfer:** a function developed for banks to have access to transfer Brazilian CBDC tokens from clients' and users' wallets.

**1.3) functions mintUser and burnUser:** a function developed for financial institutions and the Central Bank to have access to mint and burn tokens of their clients. For example, a user has R$1000 in Brazilian CBDC and wishes to withdraw this money in physical currency at the bank branch. The bank can then burn these tokens and make the payment in person to the customer.

### 2) National Treasury Bonds token (NTBt.sol)
Contract address on Fuji Testnet: 0xA9C5c74C998d18266118aa60CFBd9bBF89BDdb8f

A smart contract for the tokenization of National Treasury bonds. Also developed with the ERC-20 standard, this contract presents greater complexity, and below are the main features:

**2.1) Privileged Accounts:** all the logic already explained previously.

**2.2) Variables and Constructor:** the deployment of this contract should be carried out to issue a tokenized National Treasury bond. When deploying, it is necessary to pass in the constructor some relevant variables such as the name of the bond, symbol, maximum amount of tokens to be issued, initial unit price, maturity date, minimum investment, type of asset, and the address of the Brazilian CBDC. In this contract, we are considering the tokenization of a Tesouro Selic bond, which yields according to the variation of the Selic rate (it gets from Selic Oracle contract).

**2.3) function getTokenPrice:** a function responsible for calculating the asset's current price. For this, the interestRate, a variable that stores the profitability of the asset in question, is used.

**2.4) function updateCurrentPrice:** function which is called daily by **Chainlink Automation** 10 minutes after sendRequest (in SelicOracle). So, first SelicOracle updates daily interestRate and 10 minutes after we update this asset token price according to the interest rate.

**2.5) function invest:** a function that the bank/financial institution must call to make an on-chain investment in this bond by one of its clients. The function will receive the individual's contribution amount, check if it is higher than the minimum investment, receive the CBDC from the user's wallet corresponding to the investment, send the NTBt tokens based on the asset price at the time, and list the investor in the list of investors for that asset. If the investor is already listed, they will not be added again.

**2.6) function withdrawInvestor:** a function used for the financial institution to liquidate an investor's bonds. In this function, the opposite mechanism of invest is performed: the smart contract receives the number of NTBt tokens from the user's wallet and pays the investor with Brazilian CBDC based on the asset's current price.

**2.7) function withdrawBacen:** a function used for the Central Bank to receive the Brazilian CBDC tokens from all investments made in that bond.

### 3) ALC (ALC.sol)
Contract address on Fuji Testnet: 

**3.1) struct liquidityRequest:** a Solidity struct that stores a series of relevant data from each liquidity request, such as the institution, wallet, total amount, raised amount, collateral asset, collateral smart contract, date, and a list with the liquidity providers and how much each provided.

**3.2) Privileged accounts:** all the permissioning logic already explained previously.

**3.3) function createLiquidityRequest:** a function to be called to create a liquidity request and lock the collateral assets in the smart contract.

**3.4) function provideLiquidity:** a function used to provide liquidity, that is, to send money (BRLt) to those requesting liquidity and store it in smart contracts. This is registered in the smart contract to later perform payment operations.

**3.5) function payCreditors:** a function with the implementation to calculate the amount that should be paid to each liquidity provider and pay them automatically with interest. In addition, this marks the end of that operation, leaving it with a Closed status.

**3.6) function defaultPayment:** a function that should be called by liquidity providers to redeem the guarantee related to that operation in case of default (+ 24 hours).

### 4) Selic Rate Oracle (SelicOracle.sol)
Contract address on Fuji Testnet: 0x3ca34895dbed1cdbcc86a6ce234cbc79db140fb8

A smart contract developed by using **Chainlink Functions** to get Selic Rate Oracle from **[Central Bank of Brazil API](https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json)**

**4.1) struct Rate:** it stores Selic Rate;

**4.2) sendRequest:** function which is called by **Chainlink Automation** everyday at 00:01AM to update daily Selic Rate.

### 5) Math (math.sol)
Smart contract from the DSMath library for mathematical calculations in Solidity.
