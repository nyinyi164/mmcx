require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var router = express.Router();
var app = express();
var json,err;
var keys = [];
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));
console.log('Your application is running on http://localhost:' + 3000);
//For Local Test
var urlUpdate="http://forex.cbm.gov.mm/api/latest";

request(urlUpdate, function (error, response, body) {
  if (!error && response.statusCode == 200) {
        json = JSON.parse(body);
        //console.log(typeof json);
        
    }
  else {
        json = {
                "info":"Central Bank of Myanmar",
                "description":"Official Website of Central Bank of Myanmar",
                "timestamp":"1478764800",
                "rates":{"USD":"1,300.0","THB":"36.672","PKR":"12.276","KES":"12.637","CZK":"52.499","JPY":"1,216.6","SAR":"342.62",
                        "LAK":"15.773","HKD":"165.70","BRL":"402.22","NZD":"937.31","LKR":"8.6784","CAD":"958.17","GBP":"1,598.6",
                        "VND":"5.7323","PHP":"26.270","KRW":"111.30","AUD":"981.93","DKK":"190.65","RSD":"11.524","MYR":"302.50",
                        "INR":"19.319","BND":"918.38","EUR":"1,404.3","SEK":"142.64","NOK":"156.07","ILS":"337.35","CNY":"189.53",
                        "CHF":"1,305.9","RUB":"20.170","KWD":"4,243.9","BDT":"16.353","EGP":"74.380","ZAR":"10.00","NPR":"12.034",
                        "IDR":"9.8099","KHR":"31.709","SGD":"918.51"
                        }
                }
    err = error;
    //response.send('This happen when cbm api request error'+error);
  } 
  for(var k in json.rates) keys.push(k);
});

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is Myanmar Currency Exchange (MMCX) Chat bot Server '+ err);
});
app.use('/terms', express.static(__dirname + '/public'));
//console.log("Server running at Port 3000");
// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'mmcx_verify_token_v2') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});
/*app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});
*/
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        var requestHiText = '​ေအး​ေဆး​ေပါ့ဗ်ာ က်ြန္​​ေတာ့္ကို Hi လို႔နႈတ္​ဆက္​ပါဦး '; // request user to say hi or hello
        var apiErrorText = 'ဗဟိုဘဏ္​က​ေန ​ေငြလဲနႈန္​းသြားယူတာမရ​ေသးလို႔ ​ေငြလဲနႈန္​းအ​ေဟာင္​းနဲ႔ပဲတြက္​​ေပးလိုက္​တယ္​​ေနာ္​'; // cannot get data from central bank
        if (event.message && event.message.text) {
            if (!sendCurrenyOption(event.sender.id, event.message.text)) {
            sendMessage(event.sender.id, {text: requestHiText});
            }
            // else if (err) {
            // sendMessage(event.sender.id, {text: apiErrorText});
            // }
        }
        else if (event.quick_reply) 
        {
            console.log("quick_reply received: " + JSON.stringify(event.quick_reply));
            var postbackCurrency = event.quick_reply.payload;
            changeCurrency(recipientId, postbackCurrency);
            //console.log("Postback received: " + JSON.stringify(event.postback));
        }    
    }
    res.sendStatus(200);
}); 

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};
//Send Quick Reply
function sendCurrenyOption(recipientId, text) {
    if ( text.length < 3 ) {
        text = text.toUpperCase();
        if (text === "HI") {
            message = {
                "text":"​ေဈးသိခ်င္​တဲ့ ​ေငြ​ေၾကးအမ်ိဳးအစားကို​ေ႐ြး​ေပးပါ", // choose currency type
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"USA Dollar-USD",
                    "payload":"USD"
                  },
                  {
                    "content_type":"text",
                    "title":"Singapore Dollar-SGD",
                    "payload":"SGD"
                  },
                  {
                    "content_type":"text",
                    "title":"Thailand Baht-THB",
                    "payload":"THB"
                  },
                  {
                    "content_type":"text",
                    "title":"Malaysia Ringgit-MYR",
                    "payload":"MYR"
                  },
                  {
                    "content_type":"text",
                    "title":"Japan Yen-JPY",
                    "payload":"JPY"
                  },
                  {
                    "content_type":"text",
                    "title":"Great Britain Pound-GBP",
                    "payload":"GBP"
                  },
                  {
                    "content_type":"text",
                    "title":"EURO-EUR",
                    "payload":"EUR"
                  },
                  {
                    "content_type":"text",
                    "title":"Vietnam Dong-VND",
                    "payload":"VND"
                  }
                ]
            }
            sendMessage(recipientId, message);       
            return true;
        }
    }
    return false;
}
function changeCurrency(recipientId, postbackCurrency){
    var todayRate;
    var currency = postbackCurrency;
    var amount = 1;
    if (currency != null) {
        todayRate = json['rates'][currency];
        //todayRate = 1200;
        var todayRate = parseFloat(todayRate.replace(/,/g, ''));
        if (currency === "JPY" || currency === "VND" || currency === "KRW")
        todayRate = todayRate / 100;
        sendMessage(recipientId, {text: amount+" " + currency + " = " + todayRate + " MMK"});
        return true;
    }
    return false;
}
/*function doConversion(recipientId, text) {
    var amount,inputCurrency,todayRate;
    var currency = null;
    text = text || "";
    var values = text.split(' ');
    if (values.length == 2 ) {
        if (Number(values[0]) > 0) {
            amount = Number(values[0]);
            inputCurrency = values[1].toUpperCase();
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] === inputCurrency) {
                    currency = inputCurrency;
                } 
            }
            if (currency != null) {
                todayRate = json['rates'][currency];
                //todayRate = 1200;
                var todayRate = parseFloat(todayRate.replace(/,/g, ''));
                if (currency === "JPY" || currency === "VND" || currency === "KRW")
                todayRate = todayRate / 100;
                result = todayRate * amount;
                sendMessage(recipientId, {text: amount+" " + currency + " = " + result+ " MMK"});
                return true;
            }
            return false;
        }
    }
    else if (values[0].toUpperCase() === 'HELP' || values[0].toUpperCase() === 'HELLO') {
            var helpText = 'You can check your currency exchange rate to Myanmar Kyats(MMK). '+
                            'Use this format "Amount<space>Currency". For eg,"100 USD" for US$. '+
                            'You can use other abbreviation (SGD,GBP,EUR,JPY,THB,MYR,HKD,INR,KRW,...) to check their respective exchange rates. ';
                            
            sendMessage(recipientId, {text: helpText});
            //sendMessage(recipientId, {text: helpText1});
            return true;
        }
    return false;
}*/