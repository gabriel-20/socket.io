var fs = require('fs');
var app = require('express')();
var util = require('util')
const request = require('request');
var httpss = require('https');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//getCall();

var clients = [ ];
var trainers = [ ];

var auth = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIzZmE4NWJhODJmZDhjNzBiOWZlMDhiMmI5MDRkNDJjZDBjYjM4Zjg3OTlhYzZkNjM3OGM4YTcyY2I0YjQ5N2RhYThmMTllZjUxYjVlYjhkIn0.eyJhdWQiOiIzIiwianRpIjoiMjNmYTg1YmE4MmZkOGM3MGI5ZmUwOGIyYjkwNGQ0MmNkMGNiMzhmODc5OWFjNmQ2Mzc4YzhhNzJjYjRiNDk3ZGFhOGYxOWVmNTFiNWViOGQiLCJpYXQiOjE1NDkzNzI1OTIsIm5iZiI6MTU0OTM3MjU5MiwiZXhwIjoxNTgwOTA4NTkyLCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.EPY6bLbYwoPrtwKjChlsZqcEQPcarrcttaGziTaOvt5didcsWE25tQOH4k_7DKqVUgzyRLFDjHqQqrVstAX2fTusKhjZ-_N2-1SPh3rhVLEHS1WEBAF59FVdar-RGFPPsrmXm7cZDwpUjJWmXcwbr58HGnuIKVEuxpch4HhLACTuSwfTOXByrvqmywykhsUlRWM_-rGCo7zd5B0Y-GkmpPAg5eMplAdc78dmVEtaDoKktS6QjyphuZDkqmoxWVAPFJgi5bl5CiheQqYzXwLhSXRUWLx2g-aiDmuu5bU5NYxNdaqzF_E9iIm_DrAc_ey098CeE4nqwJdIHD8ygkeSlsde1U8PrHXf9598zVckch5ZyGNXKVUMUcpTz8Ic5PXuo9fXEvLO5qdU5CkxhCEzLVLew8iTkDq4SB-iqjLoj3bDz6k74EX_9-N0w9IIDdVcwQnw5mbAMGEWQnudJp5ytuKCeL5BTrqJd1gcDcP5URsku7lUUY6AyNfGIRc81dWRg7AMROCULQZM46crhcYGVer_Lce6wtVYQRL4SwXxDvl_Otm5QN42LdECzXYLjC36b5wZHm9EM8Xc4xKZef14mgtrb4qIs1Lanvdg21RBgUQ0ArPLflBQx4DzUCkCTMS7JbEA09miWXKs3pyAfXtRfMnXs2JEIKN2bAxixbc1AW4';
var apidomain = 'https://api.studio20.group/api/';
var url_allmodels = apidomain + 'allmodels';
var url_shifttimes = apidomain + 'shifttime/';
var url_updatemymodels = apidomain + 'updatemymodels';
var url_getmodels = apidomain + 'getmymodels';
var url_trainergetmodel = apidomain + 'trainergetmodelinfo';
var url_gettrainers = apidomain + 'gettrainers';
var url_removemodeltrainer = apidomain + 'removemodeltrainer';
var url_chathistory = apidomain + 'insertchathistory';
var url_getchathistory = apidomain + 'getchathistory';
var url_modelstartshift = apidomain + 'modelpresent';
var url_modelendShift = apidomain + 'modelendshift';
var url_getshiftstatus = apidomain + 'modelstartshift';
var url_getShiftReportData = apidomain + 'getshiftreportdata';
var url_trainerStartShift = apidomain + 'trainerstartshift';
var url_trainerEndShift = apidomain + 'trainerendshift';
var url_sendShiftReportData = apidomain + 'sendshiftreportdata';
var url_logTrainerDisconnect = apidomain + 'logtrainerdisconnect';



var callback = (error, response, body) => {
  var modelname = body.modelname;
  io.sockets.to(modelname).emit('sendshifttime', body );
}


var callback_logTrainerDisconnect = (error, response, body) => {
    console.log(body);
  }

var callback_sendShiftReportData = (error, response, body) => {
    console.log("callback_sendShiftReportData");
    console.log(body);

    //send models updated to trainer
    optionsRequest.url = url_getmodels;
    optionsRequest.method = 'POST';
    optionsRequest.json = { id: body.trainer };

    console.log("option request");
    console.log(optionsRequest.json);

    request(optionsRequest, callback_mymodels);


  }

var callback_getshiftstatus = (error, response, body) => {
  var modelname = body.modelname;
  io.sockets.to(modelname).emit('shiftstart', body );
}

var callback_modelpresent = (error, response, body) => {
    console.log(body);

    //send models updated to trainer
      optionsRequest.url = url_getmodels;
      optionsRequest.method = 'POST';
      optionsRequest.json = { id: body.trainer_id };
      request(optionsRequest, callback_mymodels);
}

var callback_getShiftReportData = (error, response, body) => {
    console.log(body);
    io.sockets.to(body.trainer).emit('retriveShiftReportData', body );
}
  
var callback_modelendshift = (error, response, body) => {

    console.log("body");
    console.log(body);

    //send models updated to trainer
    optionsRequest.url = url_getmodels;
    optionsRequest.method = 'POST';
    optionsRequest.json = { id: body.trainer_id };
    request(optionsRequest, callback_mymodels);

}

var callback_getchathistory_trainer = (error, response, body) => {
 
  console.log(body);
  var trainer = body.trainer;

  io.sockets.to(trainer).emit('chatHistory', body );

}

var callback_getchathistory  = (error, response, body) => {
  var model = body.model;
  io.sockets.to(model).emit('chatHistory', body );
}

var callback_insertchathistory = (error, response, body) => {

  //insert success

}

var callback_removemodeltrainer = (error, response, body) => {
    console.log("callback_removemodeltrainer");
  console.log(body);

  let from = body.from;
  io.sockets.to(from).emit('updateMyModels', body );

  let to = body.to;
  if (to !== "Remove") {
    io.sockets.to(to).emit('updateMyModels', body );
  }

 
}

var callback_gettrainers = (error, response, body) => {
  console.log(body);
  console.log("callback_gettrainers");
  //.. emit to trainer x -> list with trainers -> for model y
  io.sockets.to(body.trainer).emit('modelRealocate', body );
}

var callback_trainerStartShift  = (error, response, body) => {
    console.log("callback_trainerStartShift");

    console.log(body);
  
  }

  var callback_trainerEndShift  = (error, response, body) => {
    console.log(body);
    console.log("callback_trainerEndShift");

  
  }  

var callback_aupdatemymodels = (error, response, body) => {
    console.log("callback_aupdatemymodels");
  var trainer = body.trainer;
  //io.sockets.to(trainer).emit('retrivemymodels', body );

}

var callback_allmodels = (error, response, body) => {
    console.log("callback_allmodels!!!->>>>" + body);

  //console.log(response.statusCode);
  //socket.to(body.name).emit('allmodels', body);
  io.sockets.to(body.name).emit('allmodels', body );

}
var callback_mymodels = (error, response, body) => {
    console.log(body);
    console.log("resp my models :" + body.shift);
    console.log("resp my models name :" + body.name);
    var sResp = [];
    var resp = body.data;
    var name = body.name;
    var shift = body.shift;
  //console.log('callback response = '+ resp);
  //console.log('namee frommm  response = '+ name);

  for (mName in resp) {
    //console.log('value from = '+ mName);
    var mymodels = {};
    mymodels.name = mName;
    mymodels.status = resp[mName];
    mymodels.chat = "inactive";
    mymodels.shift = shift.includes(mName);
    //console.log('value = '+ mName + ": " + resp[mName]);


    for (const [index, value] of clients.entries()) {
      if ( value.name == mName ) {
        mymodels.chat = "active";
      } 
      //console.log('mymodels = '+ mymodels);
    }

  
  //console.log('mymodels value '+ mymodels);
  sResp.push(mymodels);
  }
  body.data = sResp;

  //socket.to("trainer1").emit('retrivemymodels', body);
  io.sockets.to(name).emit('retrivemymodels', body );

}

var callback_trainergetmodelinfo = (error, response, body) => {
    console.log("callback_trainergetmodelinfo");

  var name = body.trainer;

  io.sockets.to(name).emit('retriveselectedmodel', body );

}

var optionsRequest = {
  url: '',
  method: 'GET',
  json: true,
  headers: {
    'User-Agent': 'node js request',
    'Authorization': auth,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};


var options = {
  key: fs.readFileSync('/home/serverg20/public_html/work/file.pem'),
  cert: fs.readFileSync('/home/serverg20/public_html/work/file.crt')
};

var https = require('https').Server(options, app);

var io = require('socket.io')(https);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    
	
  	socket.on('disconnect', function(){

        
        clients.forEach(function (value, i) {
            if (value.id == socket.id) {
                console.log('user '+ value.name + ' disconnected')
                clients.splice(i, 1);
                io.sockets.emit('chat',{ clients });
            }
        });

        trainers.forEach(function (value, i) {
          if (value.id == socket.id) {
              console.log('trainer '+ value.name + ' disconnected');
              //console.log('trainer '+ JSON.stringify(trainers[i].trainer_id) + ' disconnected');
              var trainer_id = trainers[i].trainer_id;
              trainers.splice(i, 1);
              io.sockets.emit('chat_trainers',{ trainers });

              //log trainer disconnect
              optionsRequest.url = url_logTrainerDisconnect;
              optionsRequest.method = 'POST';
              optionsRequest.json = { trainer_id: trainer_id};
          
              request(optionsRequest, callback_logTrainerDisconnect);

          }
      });

        //emit to web app
        var all = trainers.concat(clients);
        io.sockets.emit('allbuilds_response',{ all });


      });
      
      socket.on('trainerusername', function(msg){
        console.log('trainer username_message: ' + msg);
        var name = msg[0];
        var build = msg[1];
        var id = msg[2];

        //temp fix to stop flood
        //var requestAllmodels = 0;
        //var requestMymodels = 0;
        
        //join trainer room
        socket.join(name);

        //add trainer to trainer array
        //var obj = {"id" : socket.id, "name" : name, "type":"trainer", "build":build, "trainer_id":id, "requestAllmodels":requestAllmodels, "requestMymodels":requestMymodels}
        var obj = {"id" : socket.id, "name" : name, "type":"trainer", "build":build, "trainer_id":id}

        trainers.push(obj);

        //emit to web app
        var all = trainers.concat(clients);
        io.sockets.emit('allbuilds_response',{ all });

    });


socket.on('getShiftReportData', function(msg){
    console.log('getShiftReportData: ' + msg);

    optionsRequest.url = url_getShiftReportData;
    optionsRequest.method = 'POST';
    optionsRequest.json = { trainer_id: msg[0], model: msg[1]};

    request(optionsRequest, callback_getShiftReportData);

});

socket.on('TRAINER_START_SHIFT', function(msg){
    console.log('TRAINER_START_SHIFT: ' + msg);

    optionsRequest.url = url_trainerStartShift;
    optionsRequest.method = 'POST';
    optionsRequest.json = { trainer_id: msg[0], time: msg[1]};

    request(optionsRequest, callback_trainerStartShift);
});

socket.on('TRAINER_END_SHIFT', function(msg){
    console.log('TRAINER_END_SHIFT: ' + msg);

    optionsRequest.url = url_trainerEndShift;
    optionsRequest.method = 'POST';
    optionsRequest.json = { trainer_id: msg[0], time: msg[1]};

    request(optionsRequest, callback_trainerEndShift);
});




socket.on('sendShiftReportData', function(msg){
    console.log('sendShiftReportData: ' + msg);

    //{trainer.name, selectedModel, room, place, points, field1, field2, field3, field4, field5, field6};

    optionsRequest.url = url_sendShiftReportData;
    optionsRequest.method = 'POST';
    optionsRequest.json = { trainer_id: msg[0], model: msg[1], room: msg[2], place: msg[3], points: msg[4], field1: msg[5], field2: msg[6], field3: msg[7], field4: msg[8], field5: msg[9], field6: msg[10]};

    request(optionsRequest, callback_sendShiftReportData);

});


socket.on('startShift', function(msg){
    console.log('startShift: ' + msg);

    optionsRequest.url = url_modelstartshift;
    optionsRequest.method = 'POST';
    optionsRequest.json = { trainer_id: msg[0], model: msg[1], text: msg[2], time: msg[3]};

    request(optionsRequest, callback_modelpresent);

});

socket.on('endShift', function(msg){
    console.log('endShift: ' + msg);

    optionsRequest.url = url_modelendShift;
    optionsRequest.method = 'POST';
    optionsRequest.json = { trainer_id: msg[0], model: msg[1], text: msg[2], time: msg[3], room:msg[4], awards:msg[5], place:msg[6]};

    request(optionsRequest, callback_modelendshift);

});

  socket.on('trainergetchathistory', function(msg){
    console.log('trainergetchathistory: ..');
    optionsRequest.url = url_getchathistory;
    optionsRequest.method = 'POST';
    optionsRequest.json = { trainer: msg[0], model: msg[1]};

      request(optionsRequest, callback_getchathistory_trainer);

  });

  socket.on('allbuilds', function(msg){

    var all = trainers.concat(clients);

    io.sockets.emit('allbuilds_response',{ all });

});
		
		socket.on('username', function(msg){
            console.log('username_message: ' + msg);
            var mytrainer = msg[2];
            var obj = {"id" : socket.id, "name" : msg[0], "build": msg[1], "mytrainer": mytrainer, "type":"model"}
            clients.push(obj); 
            io.sockets.emit('username',{ clients });
            
            //join trainer room
            socket.join(mytrainer);

            //join personal room
            socket.join(msg[0]);

            //console.log("ROOMS:" + JSON.stringify(io.sockets.adapter.rooms));

            //get chat history for model -> trainer
            optionsRequest.url = url_getchathistory;
            optionsRequest.method = 'POST';
            optionsRequest.json = { trainer: mytrainer, model: msg[0]};
            request(optionsRequest, callback_getchathistory);

            //get shift status or start shift
            optionsRequest.url = url_getshiftstatus;
            optionsRequest.method = 'POST';
            optionsRequest.json = { model: msg[0] };
            request(optionsRequest, callback_getshiftstatus);

            //emit to web app
            var all = trainers.concat(clients);
            io.sockets.emit('allbuilds_response',{ all });


  });

  socket.on('closeapp', function(msg){
    console.log('close aapp  trainer: ' + msg.id );
    console.log(msg);

    socket.to(msg.id).emit('CLOSE_APP', msg);

    //   optionsRequest.url = url_gettrainers;
    //   optionsRequest.method = 'POST';
    //   optionsRequest.json = { trainer: msg[0], model: msg[1], studio: msg[2] };

    //   request(optionsRequest, callback_gettrainers);

});

  
  socket.on('getOnlineTrainersStudio', function(msg){
    console.log('from trainer: ' + msg);

      optionsRequest.url = url_gettrainers;
      optionsRequest.method = 'POST';
      optionsRequest.json = { trainer: msg[0], model: msg[1], studio: msg[2] };

      request(optionsRequest, callback_gettrainers);

});

socket.on('realocateRemoveModel', function(msg){
  console.log('from trainer: ' + msg);

    optionsRequest.url = url_removemodeltrainer;
    optionsRequest.method = 'POST';
    optionsRequest.json = { fromtrainer: msg[0], model: msg[1], totrainer: msg[2] };

    request(optionsRequest, callback_removemodeltrainer);

});
  

socket.on("TRAINER_SEND_CHAT", function(msg){
            var date = new Date();
            var timestamp = date.getTime();
            msg[3] = timestamp;
           console.log('to ' + msg[0] + ' from: ' + msg[1] + ' message: ' + msg[2] + ' time:' + msg[3]);
           socket.to(msg[0]).emit('trainerchat', msg);

           //insert into database
           insertChatHistory(msg[1], msg[0], msg[2], msg[3]);
       });

socket.on("MODEL_SEND_CHAT", function(msg){
        var date = new Date();
        var timestamp = date.getTime();
        msg[3] = timestamp;
        console.log('to: ' + msg[0] + ' from: ' + msg[1] + 'message: ' + msg[2] + ' time:' + msg[3]);
        socket.to(msg[0]).emit('modelchat', msg);
        insertChatHistory(msg[0], msg[1], msg[2], msg[3]);
    });



	socket.on('message', function(msg){
    		console.log('message: ' + msg);
    });
    
    socket.on('updatemymodels', function(msg){
        console.log('updatemymodels: ');
      optionsRequest.url = url_updatemymodels;
      optionsRequest.method = 'POST';
      optionsRequest.json = { id: msg.id, models: msg.models };

      request(optionsRequest, callback_aupdatemymodels);

  });
        
  socket.on('chat', function(msg){
            console.log('chat: ' + msg);
            let sid = socket.id;
            io.sockets.emit('chat',{ sid, msg });
    });

    socket.on('getmodelinfo', function(msg){
      console.log('getmodelinfo: ' + msg[0] + msg[1]);

  
      optionsRequest.url = url_trainergetmodel;
      optionsRequest.method = 'POST';
      optionsRequest.json = { trainer:msg[0], modelname: msg[1] };
      request(optionsRequest, callback_trainergetmodelinfo);

});

    socket.on('getmymodels', function(msg){


        //fix for flood
        // trainers.forEach(function (value, i) {
        //     if (value.id == socket.id) {
        //         if (trainers[i].requestMymodels == 0) {
                    
        //             console.log('getmymodels: ' + msg);
        //             optionsRequest.url = url_getmodels;
        //             optionsRequest.method = 'POST';
        //             optionsRequest.json = { id: msg };
        //             request(optionsRequest, callback_mymodels);

        //             trainers[i].requestMymodels = 1;
      
        //         }
  
  
        //     }
        // });


      console.log('getmymodels: ' + msg);
      optionsRequest.url = url_getmodels;
      optionsRequest.method = 'POST';
      optionsRequest.json = { id: msg };
      request(optionsRequest, callback_mymodels);
      
});
    
    
    socket.on('allmodels', function(msg){

        //fix for flood
        // trainers.forEach(function (value, i) {
        //     if (value.id == socket.id) {
        //         if (trainers[i].requestAllmodels == 0) {

        //             optionsRequest.url = url_allmodels;
        //             optionsRequest.method = 'GET';
        //             optionsRequest.json = { name: msg[0],studio: msg[1] };
        //             request(optionsRequest, callback_allmodels);
        //             trainers[i].requestAllmodels = 1;
      
        //         }
  
  
        //     }
        // });


 
      optionsRequest.url = url_allmodels;
      optionsRequest.method = 'GET';
      optionsRequest.json = { name: msg[0],studio: msg[1] };
      console.log('allmodels->studio ' + msg)

      request(optionsRequest, callback_allmodels);


    });

  socket.on('getshifttime', function(msg){

  //   clients.forEach(function (value, i) {
  //     if (value.id == socket.id) {


  //     }
  // });

  console.log("get shift time: " + msg);

      optionsRequest.url = url_shifttimes + msg;
      optionsRequest.method = 'GET';
      request(optionsRequest, callback);


});
    

    //io.sockets.emit('broadcast',{ clients });

	var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;

	console.log('New connection from ' + socketId + ':' + clientIp);

});

https.listen(3000, function(){
  console.log('listening on *:3000');
});


Array.prototype.remove = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
			what = a[--L];
			while ((ax = this.indexOf(what)) !== -1) {
					this.splice(ax, 1);
			}
	}
	return this;
};

function insertChatHistory(to, from, message, time){


    optionsRequest.url = url_chathistory;
    optionsRequest.method = 'POST';
    optionsRequest.json = { fromid: from, toid: to, message: message, timestamp:time };


    request(optionsRequest, callback_insertchathistory);


}

function getCall() {

    var options = {
        hostname: 'partner-api.modelcenter.jasmin.com',
        port: 443,
        path: '/v1/performer-states?screenNames[]=MellanieRouge&screenNames[]=AdaniaBelle&screenNames[]=BrandyArper&screenNames[]=AileyBlake&screenNames[]=EvaInkz&screenNames[]=SilviaEyrie&screenNames[]=YvoneBoobs&screenNames[]=TanyaWelss&screenNames[]=AubreyNovaa&screenNames[]=IAmKallisa&screenNames[]=NadiiaBlack&screenNames[]=MoniquePure&screenNames[]=JessieRyah&screenNames[]=LollaGodiva&screenNames[]=RebeccaBlussh&screenNames[]=LeylaDuchess&screenNames[]=SiaEmerald&screenNames[]=DeviousAngell&screenNames[]=RaquelleDiva&screenNames[]=AmaryGrace&screenNames[]=AlexyaFay&screenNames[]=AryaWilde&screenNames[]=TommyBlame&screenNames[]=ErvinBloom&screenNames[]=HarleyTricks&screenNames[]=VanesaRulz&screenNames[]=AmelieSlade&screenNames[]=SoniaJayy&screenNames[]=MissRixye&screenNames[]=Rubyconne&screenNames[]=LaraRyse&screenNames[]=SophyDavis&screenNames[]=LexyRulz&screenNames[]=EveliynDiva&screenNames[]=SusanBirdy&screenNames[]=EllaVonDee&screenNames[]=AmeliaReea&screenNames[]=TrixieVault&screenNames[]=EveVonDee&screenNames[]=MadisonDivaa&screenNames[]=RanyaDream&screenNames[]=NikkySauvage&screenNames[]=NatashaVause&screenNames[]=AamirDesire&screenNames[]=AnaysCharm&screenNames[]=BlondViolinn&screenNames[]=ArielleFlame&screenNames[]=EvaDevine&screenNames[]=DamonVeins&screenNames[]=AshlleyOwen',
        method: 'GET',
        headers:{
            Authorization: 'Bearer 406ad45b5ed5748abb871cc99ef69bc45d0ad2779f9034f91de5af254f8a9902'
        }
    };


    var getReq = httpss.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
            console.log( JSON.parse(data) );
        });

    });


    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    });

    setInterval(getCall, 20000);


}