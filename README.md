### What is this?
Scan Steam marketplace and find items that have large price fluctuations.
Find items that are undervalued.
Profit?

Example:
Lets say there is a `Glock-18` that for the last 5 days has had a highest price of 2 EUR and lowest price of 1 EUR. Now steam markup is 15% of item price. That means there is 0,85 cents to be made. 


### Getting started
It is really straight forward. Just run `npm install` to get dependencies and `node index.js` to start the app on `localhost:80`.


### Response
Example response.
```
[{
	"name": "Sawed-Off | Forest DDPAT (Field-Tested)",
	"link": "http://steamcommunity.com/market/listings/730/Sawed-Off%20%7C%20Forest%20DDPAT%20%28Field-Tested%29",
	"img": "http://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5oNfSwNDhhdDvKGJ9aWOU74DfhDCM7_cotAtXk8-5fcAjs5YOQYuIsYd8fScHRCfWDY1j7u0g9h6lfKseMpHjpjDOpZDlmf0CGVQ/62fx62f",
	"history": [{ // price history of X last days
		date": "2015-02-21T14:00:00.000Z",
		"price": 0.03,
		"quantity": 256
	},{..}],
	"profit": {
	    "lowPrice": 0.03,
	    "highPrice": 0.04,
	    "margin": 0.01, // highPrice - lowPrice
	    "markupPrice": 0.06, // lowPrice + 0.01 with steam markup
	    "markupMargin": -0.02, // highPrice - markupPrice
	    "totalSold": 10071 //
	}
},{..}]
```


### TO-DO
 * Implement a config file.


### Issues
Found a bug or better solution? Please report to the issue section.
