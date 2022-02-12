# Astroport Take Home Assignment

## Features
* Front end built with Chakra UI & Typescript
* Connect wallet via Terra Station
* View LUNA and UST balances
* Send LUNA or UST to any terra wallet
* View transaction in Terra Finder
* Error handling for invalid transactions

## Obstacles

* The Terra.js bank API lists UST as "uusd" and LUNA as "uluna." I displayed the names the BankAPI returned rather than the correct ones
* Could not retrieve and display token images from the API

I could have easily solved these obstacles by hard coding the proper names and token images in the code, but I thought that would cause issues in the future if the name or logo of anything changes. I thought there should be a better solution using the API, but I did not have time to find it. 

## Improvements

* Supporting additional tokens.
	* This is relatively trivial because nothing is hard coded. The UI gets an arbitrary list of token balances and denominations from the BankAPI. 
* Create event listener that updates the balances as they change
* Error handling for off chain transaction failures	
	* The UI shows errors for any transaction that fails to send (such as invalid address, or transaction denied in wallet), but if the transaction is sent then fails on chain, the UI will not show that failure. 