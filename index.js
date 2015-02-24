var express = require('express'),
    request = require('request'),
    moment = require('moment'),
    app = express(),
    cheerio = require('cheerio');

// global vars
var items = [],
    urls = [];

// should probably add some config here
var config = {
    "days" : 3
    // results per page
    // how many pages
    // price history (days, months or alltime)
    // item category
};



/**
 * Finds out if buying item could be profitable or not
 */
function getProfit() {

}


/**
 * Parse through JavaScript in page DOM to get item price history
 * @param  {String} body page DOM
 * @return {Array}      array of objects containing date, price, quantity
 */
function parseHistory(body) {
    var historyParsed = [];

    // search to start with "line1=["
    var historyStart = body.indexOf("line1=[");
    
    // search to end with "];"
    var historyEnd = body.indexOf("]];");

    // history string
    //console.log(body.slice(historyStart, historyEnd));
    var history = body.slice(historyStart + 9, historyEnd); // returns string without start and end
    history = history.split('"],["');

    var tmp, 
        itemDate,
        curDate = moment().subtract(config.days, 'days');

    for (item in history) {
        tmp = history[item].split(/\"*,\"*/);
        
        itemDate = moment(tmp[0]);

        if(itemDate.isAfter(curDate)) { // returns only a fraction of history (set in config)
            historyParsed.push({
                "date" : itemDate,
                "price" : tmp[1],
                "quantity" : tmp[2]
            });    
        }
    }

    return historyParsed;
}


/**
 * Parse through page DOM to get individual item data
 * @param  {String} body page DOM
 */
function parseItem(body) {
    $ = cheerio.load(body);

    if($("body").length) {
        console.log("got actual data");
    } else {
        console.log("no data");
    }

    // just first item from listings
    item = $("#searchResultsRows .market_listing_row").first();

    items.push({
        "name" : item.find(".market_listing_item_name").text(),
        "img" : item.find(".market_listing_item_img").attr("src"),
        "history" : parseHistory(body)
    });
}


/**
 * Makes a request to each items page for dom
 * @param  {Object} answ used to return answer to browser
 */
function getItems(answ) {
    var totalReq = 0;
    items = [];

    if(urls.length) {
        for (url in urls) {
            totalReq++;

            request(urls[url], (function() {
                return function(err, res, body) {
                    if (err) { // if something goes bad log the error
                        console.log(err); 
                        error = true;
                    } else {
                        console.log("got item response");
                    }

                    parseItem(body);

                    totalReq--;
                    if(totalReq == 0) {
                        answ.json(items);
                    }                
                }
            })());
        }
    } else {
        answ.json("error");    
    }
}


/**
 * Parse through DOM of search page to get just the item links
 * @param  {String} body page DOM
 */
function parseSearch(body) {
    $ = cheerio.load(body);

    if($("body").length) {
        console.log("got search data");
    } else {
        console.log("no search data");
    }

    $('#searchResultsRows .market_listing_row_link').each(function() {
        urls.push($(this).attr("href"));
    });
}


/**
 * Makes a request for search page DOM
 * @param  {Object} answ used to return answer to browser (passed down to other function)
 */
function getSearch(answ) {
    var url = 'http://steamcommunity.com/market/search?q=&category_730_ItemSet%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Weapon%5B%5D=any&category_730_Type%5B%5D=tag_CSGO_Type_Pistol&category_730_Type%5B%5D=tag_CSGO_Type_SMG&category_730_Type%5B%5D=tag_CSGO_Type_Rifle&category_730_Type%5B%5D=tag_CSGO_Type_Shotgun&category_730_Type%5B%5D=tag_CSGO_Type_SniperRifle&category_730_Type%5B%5D=tag_CSGO_Type_Machinegun&category_730_Type%5B%5D=tag_CSGO_Type_Knife&appid=730';
    urls = [];

    request(url, (function() {
        return function(err, res, body) {
            if (err) { // if something goes bad log the error
                console.log(err); 
                error = true;
            } else {
                console.log("got search response");
            }
            
            parseSearch(body);

            getItems(answ);            
        }
    })());
}


// This is where the party starts
app.get('/', function(req, answ){
    console.log("request market");

    getSearch(answ);
});

app.listen('80');
console.log('server started at port 80');
exports = module.exports = app;