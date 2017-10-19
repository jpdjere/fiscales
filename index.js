var http = require('http');
var watson = require('watson-developer-cloud');
var qs = require('querystring');
var fs = require('fs');
var express = require('express');
var path = require('path');
var router = express.Router();
const util = require('util')

var wex = require('./routes/index');
//Credenciales de Conversation-GCBA-2
let conversation_user=process.env.CONVERSATION_USER;
let conversation_password=process.env.CONVERSATION_PASSWORD;
var workspaceID=process.env.WORKSPACE;

var conversation = watson.conversation({
  username: conversation_user,
  password: conversation_password,
  version: 'v1',
  version_date: '2016-09-20'
});
//gcba1
// var workspaceID="b69e22e3-bf63-4718-b778-221abdae8823";

//gcba-NuevaPropuesta
// var workspaceID="d746a3d1-af42-4961-9c3a-e20b61676a6d";

var fecha6meses = new Date().setMonth(new Date().getMonth() - 6);
var context = {
    "6meses": new Date(fecha6meses)
};
var json = '';
var wexResponse = '';

//var logfile = fs.createWriteStream('./logfile.log');
var preguntas = fs.createWriteStream('./preguntas.log');

var wexResult = '';

var confidenceLevel = 0.6;
var numeroArchivosTraer = 5;


router.get('/sendData', (req, res) => {

  // res.setHeader('Access-Control-Allow-Origin', '*');
  // // Request methods you wish to allow
  // res.setHeader('Access-Control-Allow-Methods', 'POST');
  // // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // // Set to true if you need the website to include cookies in the requests sent
  // // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

    var message= req.query.msg;
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log("-----------------------------------");
    console.log("message: ");
    console.log(message);

    try {
          preguntas.write(message + "\n");
          console.log("message es: "+message);
    }catch(err) {
          console.log("Hay un error");
    }
      //-->JMC - Comentado hasta que este entrenado en fase I
    conversation.message({
      workspace_id: workspaceID,
      input: {'text': message},
      context: context,
      alternate_intents: true
    },
    function(err, response) {
      if (err){
          console.log("Hubo un error en la respuesta de Converstaion: "+err)
          json = JSON.stringify({
            Response:response,
            Code:400,
            DescriptionMessage:err
          });
          res.send(json);
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log("-----------------------------------");
          console.log('error:'+JSON.stringify(err, null, 2));
      }else{
          console.log('response: '+JSON.stringify(response, null, 2));
          context = response.context;
          console.log("confidence is: ",response.intents[0].confidence)

            console.log("I'm in");
            // res.writeHead(200, {"Content-Type": "application/json"});
            json = JSON.stringify({
              Response:response,
              Code:200,
              DescriptionMessage:"OK"
            });
            res.send(json);


      }

  })

});

//Creo funcion para reemplazar todas las instancias de algo en un string.
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/*---------------------GET REQUEST ----------------------*/
router.get('/', function(req, res, next) {
  context = {};
  res.header("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
/*--------------------------------------------------------*/

module.exports = router;
