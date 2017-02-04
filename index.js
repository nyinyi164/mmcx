require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var router = express.Router();
var app = express();
var json,err;
var keys = [];
var recipientId,senderId;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));
console.log('Your application is running on http://localhost:' + 3000);
//For Local Test
var urlUpdate="http://forex.cbm.gov.mm/api/latest";
var requestNext = '​တျခား​ေငြလဲနႈန္​း​ေတြထပ္​သိခ်င္​​ေသးရင္​​ေတာ့ next လို႔ရိုက္​ပါ'; 
var apiErrorText = 'ဗဟိုဘဏ္​က​ေန ​ေငြလဲနႈန္​းသြားယူတာမရ​ေသးလို႔ ​ေငြလဲနႈန္​းအ​ေဟာင္​းနဲ႔ပဲတြက္​​ေပးလိုက္​တယ္​​ေနာ္​'; // cannot get data from central bank
// Server frontpage
app.get('/', function (req, res) {
    res.send('This is Myanmar Currency Exchange (MMCX) Chat bot Server '+ err);
});
app.use('/terms', express.static(__dirname + '/public'));
//console.log("Server running at Port 3000");
// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'ybs_guide_bot_v1') {
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
        err = "error";
        //response.send('This happen when cbm api request error'+error);
      } 
      for(var k in json.rates) keys.push(k);
    });

    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        recipientId = event.recipient.id;
        senderId = event.sender.id;       
        var unknownText ='နိုင္​ငံတကာ ​ေငြ​ေၾကးစနစ္​အတို​ေကာက္​စာလံုး​ေတြကလြဲရင္​ တျခားစကား​ေတြက်ြန္​​ေတာ္​နားမလည္​ဘူးဗ်။ က်​ြန္​​ေတာ္​သိတာ ဘရူနိုင္​း​ေငြဆိုရင္​ BND ၊ ​ေဟာင္​​ေကာင္​​ေဒၚလာဆို HKD ​ေပါ့ အဲ့တာ​ေတြပဲသိတယ္​။ အဆင္​မ​ေျပတာရွိရင္​ Help လို႔ ရိုက္​​ေနာ္​။';

        if (event.message) 
        {
            if (event.message.text || event.message.quick_reply) {
                if (event.message.quick_reply) {
                    /*var message = {
                        "text":"​​ေဈးသိခ်င္​တဲ့ ​ေငြ​ေၾကးအမ်ိဳးအစားကို ထပ္​မံ​ေ႐ြးခ်ယ္​နိုင္​ပါတယ္​။", 
                        "quick_replies":[
                          {
                            "content_type":"text",
                            "title":"USD",
                            "payload":"USD"
                          },
                          {
                            "content_type":"text",
                            "title":"SGD",
                            "payload":"SGD"
                          },
                          {
                            "content_type":"text",
                            "title":"THB",
                            "payload":"THB"
                          },
                          {
                            "content_type":"text",
                            "title":"MYR",
                            "payload":"MYR"
                          },
                          {
                            "content_type":"text",
                            "title":"JPY",
                            "payload":"JPY"
                          },
                          {
                            "content_type":"text",
                            "title":"GBP",
                            "payload":"GBP"
                          },
                          {
                            "content_type":"text",
                            "title":"EUR",
                            "payload":"EUR"
                          },
                          {
                            "content_type":"text",
                            "title":"VND",
                            "payload":"VND"
                          }
                        ]
                    }*/
                    //console.log("QR: "+ event.message.quick_reply.payload );
                    //sendMessage(senderId, message);
                    if (err=="error") {
                     sendMessage(senderId, {text: apiErrorText});
                   }
                    sendResult(senderId,event.message.quick_reply.payload);
                    sendMessage(senderId, {text: requestNext});
                    //console.log("1");
                }
                else if (!sendCurrenyOption(recipientId, event.message.text)) {
                    sendMessage(senderId, {text: unknownText});
                }
                //console.log("event.message.text : " + JSON.stringify(event.message.text));
            }
            // else if (err) {
            // sendMessage(event.sender.id, {text: apiErrorText});
            // }
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
/*function sendPostBack(recipientId, message) {
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
};*/
//Send Quick Reply
function sendCurrenyOption(recipientId, text) {
    var isValidCurrency = false ;
        text = text.toUpperCase();
        //console.log("text: "+text);
        for(var k in keys) {
            //console.log("inside for"+k)
            if (keys[k] === text) {
                isValidCurrency = true;
            }
        }
        //console.log("here "+isValidCurrency);
        if (text.length < 6 && !isValidCurrency) {
            /*message ={
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":"What do you want to do next?",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"USD",
                        "payload":"USER_DEFINED_PAYLOAD"
                      },
                      {
                        "type":"postback",
                        "title":"SGD",
                        "payload":"USER_DEFINED_PAYLOAD"
                      },
                      {
                        "type":"postback",
                        "title":"VND",
                        "payload":"USER_DEFINED_PAYLOAD"
                      }                     
                    ]
                  }
                }
            }*/
            var message = {
                "text":"​မဂၤလာပါ။ က်ြန္​​ေတာ္​က ​ေဒၚလ​ာ​ေဈး နဲ႔အျခားေငြလဲနႈန္​း​​ေတြကို အ​ေၾကာင္​းျပန္​​ေျပာျပ​ေပးမယ္​ Bot ပါ။ သိခ်င္​တဲ့​ေငြ​ေၾကးအမ်ိဳးအစားကို ​ေအာက္​ကခလုပ္​​ေလး​ေတြကိုနွိပ္​ၿပီး​ေ႐ြးခ်ယ္​နိုင္​ပါတယ္​။ မိတ္​​ေဆြသိခ်င္​တဲ့​ေငြ​ေၾကးအမ်ိဳးအစားက ​ေအာက္​ကခလုပ္​​ေတြထဲမွာမပါဘူးဆိုရင္​  မွန္​ကန္​တဲ့ ​ေငြလဲနႈန္​း​ေတြရရွိဖို႔ သက္​ဆိုင္​ရာ ​ေငြ​ေၾကးအမ်ိဳးအစားရဲ႕ အတုိ​ေကာက္​စာလံုး​ေလး​ေတြကို မွန္​မွန္​ကန္​ကန္​ ရိုက္​ထည္​့​ေပးဖို႔​ေတာ့လိုမယ္​​ေနာ္​။ ဥပမာ ကိုရီးယားဝမ္​​ေငြ​ေဈးကိုသိခ်င္​တာ ဆိုရင္​ KRW လို႔ရိုက္​ထည္​့​ေပးပါ။ အဆင္​​ေျပပါ​ေစ​ေနာ္​။ 🙏🏼", //ေဈးသိခ်င္​တဲ့ ​ေငြ​ေၾကးအမ်ိဳးအစားကို​ေ႐ြး​ေပးပါ choose currency type 
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"USD",
                    "payload":"USD"
                  },
                  {
                    "content_type":"text",
                    "title":"SGD",
                    "payload":"SGD"
                  },
                  {
                    "content_type":"text",
                    "title":"THB",
                    "payload":"THB"
                  },
                  {
                    "content_type":"text",
                    "title":"MYR",
                    "payload":"MYR"
                  },
                  {
                    "content_type":"text",
                    "title":"JPY",
                    "payload":"JPY"
                  },
                  {
                    "content_type":"text",
                    "title":"GBP",
                    "payload":"GBP"
                  },
                  {
                    "content_type":"text",
                    "title":"EUR",
                    "payload":"EUR"
                  },
                  {
                    "content_type":"text",
                    "title":"VND",
                    "payload":"VND"
                  }
                ]}
            sendMessage(senderId, message);       
            return true;
        }else if (isValidCurrency) {
            //console.log("here "+isValidCurrency);
            sendResult(senderId,text);
            sendMessage(senderId, {text: requestNext});
            if (err=="error") {
                sendMessage(senderId, {text: apiErrorText});
            }
            return true;
        }else{
            console.log("in return");
            return false;        
        } 
}
/*function changeCurrency(recipientId, postbackCurrency){
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
}*/
function sendResult(recipient,currency){
    var amount = "1 ";
    var todayRate = json['rates'][currency];
    //todayRate = 1200;
    //var todayRate = parseFloat(todayRate.replace(/,/g, ''));  
    if (currency === "JPY" || currency === "VND" || currency === "KRW" || currency === "KHR" || currency === "IDR"
        || currency === "LAK"){
        amount = "100 ";
    }
    result = todayRate ;
    sendMessage(recipient, {text: amount + currency + " = " + result+ " MMK"});
    //return true;
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