var express = require('express'),
    request = require('request'),
    app = express(),
    cheerio = require('cheerio');

// global vars
var items = [];

var getSearch = function(answ) {
    var options = { // request options
        url: 'http://steamcommunity.com/market/search?q=&category_730_ItemSet%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Weapon%5B%5D=any&appid=730',
        headers: {
            'User-Agent': 'Linux / Chrome 34: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36',
            'Content-Type' : 'text/html'
        }
    };

    request(options, (function() {
        return function(err, res, body) {
            if (err) { // if something goes bad log the error
                console.log(err); 
                error = true;
            } else {
                console.log("got some data");
            }

            
            

            $ = cheerio.load(body);

            $('#searchResultsRows .market_listing_row_link').each(function() {
                items.push({
                    "name" : $(this).find(".market_listing_item_name").text(),
                    "img" : $(this).find(".market_listing_item_img").attr("src"),
                    "quantity" : $(this).find(".market_listing_num_listings_qty").text(),
                    "link" : $(this).attr("href"),
                    "price" : $(this).find(".market_table_value span").text(),
                });  
            });

            console.log("sending response");
            answ.json(items);
        }
    })());
}

/**
 * Deal with page request
 */
app.get('/', function(req, answ){
    console.log("request market");

    getSearch(answ);
});

app.listen('80');
console.log('server started at port 80');
exports = module.exports = app;