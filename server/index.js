const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8080;
const { StationBuilder } = require('./include/StationBuilder');
const nodemailer = require('nodemailer');
const { sendEmail } = require('./src/mail')
const { spawn } = require('child_process');
const kmToSquareRatio = 1;
const {determineOverlapCase} = require('./include/CircleFunctions');


var sampleRate = 5;
//-------------------------------------------------------------------------------------------------------------------------------
//                                                  VARIABLES
//-------------------------------------------------------------------------------------------------------------------------------

const GRIDSIZE = 20;
const emailSubscribed = [];
const cachedData = {
    "device1": {
        deviceId: 1,
        x_pos: 2,
        y_pos: 1,
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    },
    "device2": {
        deviceId: 2,
        x_pos: 15,
        y_pos: 9,
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    },
    "device3":{
        deviceId: 3,
        x_pos: 10,
        y_pos: 7,
        status: {}
    }

}

var pos_array = fs.readFileSync("positions.txt").toString().split("\n").map(x => x.split(","));
const stationHQ = new StationBuilder('FWI');
const station1 = stationHQ.build(parseInt(pos_array[0][0]),parseInt(pos_array[0][1]));
const station2 = stationHQ.build(parseInt(pos_array[1][0]),parseInt(pos_array[1][1]));
const station3 = stationHQ.build(parseInt(pos_array[2][0]),parseInt(pos_array[2][1]));

const stationMap = {
    "station-0": station1,
    "station-1": station2,
    "station-2": station3
}

let tmpReadings = {
    temperature: 1,
    relativeHumidity: 1,
    windSpeed: 0,
    precipitation: 1
}
stationMap["station-0"].readings = tmpReadings;

stationMap["station-1"].readings = tmpReadings;
tmpReadings = {
    temperature: 1,
    relativeHumidity: 1,
    windSpeed: 0,
    precipitation:1
}
stationMap["station-2"].readings = tmpReadings;



//-------------------------------------------------------------------------------------------------------------------------------
//                                                  VARIABLE INIT
//-------------------------------------------------------------------------------------------------------------------------------

const initGrid = []
for(let i=0; i<GRIDSIZE; i++){
    const tmp = [];
    for(let j=0; j<GRIDSIZE; j++){
        tmp.push({
            deviceId: null,
            x: i,
            y: j,
            visibility: 'hidden',
            color: 'rgba(20,255,0,0.5)',
            probability: 0.00
        });
    }
    initGrid.push(tmp);
}
const HeatMap = []
for(let i=0; i<GRIDSIZE; i++){
    const tmp = [];
    for(let j=0; j<GRIDSIZE; j++){
        tmp.push({
            x: i,
            y: j,
            color: 'rgba(255,20,0,0.5)',
            probability: 0.3
        });
    }
    HeatMap.push(tmp);
}



const initData = {
    gridSize: GRIDSIZE,
    grid: initGrid
}

//-------------------------------------------------------------------------------------------------------------------------------
//         THING
//-------------------------------------------------------------------------------------------------------------------------------
function rearange(circle1, circle2, circle3){
    const Case= determineOverlapCase(circle1, circle2, circle3);

    let circle1_;
    let circle2_;
    let circle3_;
  
    const circle_config = Case[1];
  
    if (circle_config === 1) {
      circle1_ = circle1;
      circle2_ = circle2;
      circle3_ = circle3;
    } else if (circle_config === 2) {
      circle1_ = circle1; 
      circle2_ = circle3;
      circle3_ = circle2;
    } else if (circle_config === 3) {
      circle1_ = circle2;
      circle2_ = circle1;
      circle3_ = circle3;
    } else if (circle_config === 4) {
      circle1_ = circle3;
      circle2_ = circle1;
      circle3_ = circle2;
    } else if (circle_config === 5) {
      circle1_ = circle2;
      circle2_ = circle3;
      circle3_ = circle1;
    } else if (circle_config === 6) {
      circle1_ = circle3;
      circle2_ = circle2;
      circle3_ = circle1;
    }

    return [circle1_, circle2_, circle3_];
}


//-------------------------------------------------------------------------------------------------------------------------------
//                                                  MAILING LIST
//-------------------------------------------------------------------------------------------------------------------------------

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'asthmaticbois@gmail.com',
//       pass: 'LucIsVenom!'
//     }
//   });

//   const mailOptions = {
//     from: 'asthmaticbois@gmail.com',
//     to: 'kilaniabdal@gmail.com',
//     subject: 'Fire Alert',
//     text: 'A fire has been detected in your area. Please take necessary precautions.'
//   };
  

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

// function circleToHeat([radius1, radius2, radius3], array)
function circleToHeat([circle1, circle2, circle3], array)
{
    HeatMap.forEach((row) =>{
        row.forEach((element) =>{
            // var distance1 = Math.sqrt(Math.pow(cachedData["device1"].x_pos - element.x,2) + Math.pow( cachedData["device1"].y_pos - element.y, 2));
            // var distance2 = Math.sqrt(Math.pow(cachedData["device2"].x_pos - element.x,2) + Math.pow( cachedData["device2"].y_pos - element.y, 2));
            // var distance3 = Math.sqrt(Math.pow(cachedData["device3"].x_pos - element.x,2) + Math.pow( cachedData["device3"].y_pos - element.y, 2));
            let [circle1_, circle2_, circle3_] = rearange(circle1, circle2, circle3);
            let [radius1, radius2, radius3] = [circle1_.r, circle2_.r, circle3_.r];
            // console.log(circle1_);
            // console.log(circle2_);
            // console.log(circle3_);
            var distance1 = Math.sqrt(Math.pow(circle1_.x - element.x, 2) + Math.pow(circle1_.y - element.y, 2));
            var distance2 = Math.sqrt(Math.pow(circle2_.x - element.x, 2) + Math.pow(circle2_.y - element.y, 2));
            var distance3 = Math.sqrt(Math.pow(circle3_.x - element.x, 2) + Math.pow(circle3_.y - element.y, 2));
            // [distance1, distance2, distance3] = stationHQ.stationList.map((stationInfo) => {
                // return Math.sqrt(Math.pow(stationInfo.circle.x - element.x, 2) + Math.pow(stationInfo.circle.y -element.y, 2));
            // });
            const x = [distance1 < radius1*kmToSquareRatio ? 1 : 0, distance2 < radius2*kmToSquareRatio  ? 1 : 0, distance3 < radius3*kmToSquareRatio  ? 1 : 0,];
            switch (x.join(' ')){
                case'0 0 0':
                    element.color = 'rgba(0,0,0,0)';
                    element.probability = 0;
                    break;
                case'1 0 0':
                    element.color = 'rgba(0,255,0,0.5)';
                    element.probability = Math.round(array[0][0]*100)/100;
                    break;
                case '0 1 0':
                    if (!array[0][3] || element.y > circle2_.y) {
                    element.color = 'rgba(75,218,75,0.5)';
                    element.probability = Math.round(array[0][1]*100)/100;
                    } else {
                    element.color = 'rgba(49,199,49,0.5)';
                    element.probability = Math.round(array[0][3]*100)/100;
                    }
                    break;  
                case '0 0 1':
                    element.color = 'rgba(8,189,8,0.5)';
                    element.probability = Math.round(array[0][2]*100)/100;
                    break;
                case '1 0 1':
                    element.color = 'rgba(255,255,0,0.5)';
                    element.probability = Math.round(array[1][2]*100)/100;
                    break;
                case '1 1 0':
                    element.color = 'rgba(218,218,5,0.5)';
                    element.probability = Math.round(array[1][0]*100)/100;
                    break;
                case '1 1 1':
                    element.color = 'rgba(255,0,0,0.5)';
                    element.probability = Math.round(array[2][0]*100)/100;
                    break;
                case '0 1 1':
                    if (!array[1][3] || element.y > circle1_.y) {
                    element.color = 'rgba(223,223,77,0.5)';
                    element.probability = Math.round(array[1][1]*100)/100;
                    } else {
                    element.color = 'rgba(238,238,141,0.5)';
                    element.probability = Math.round(array[1][3]*100)/100;
                    }
                    break;
                default:
                    break;
                }
            
            

        });
    });
    HeatMap[stationHQ.stationList[0].circle.x][stationHQ.stationList[0].circle.y].color = 'rgba(0,0,255, 0.5)';
    HeatMap[stationHQ.stationList[1].circle.x][stationHQ.stationList[1].circle.y].color = 'rgba(0,0,255, 0.5)';
    HeatMap[stationHQ.stationList[2].circle.x][stationHQ.stationList[2].circle.y].color = 'rgba(0,0,255, 0.5)';
}


//-------------------------------------------------------------------------------------------------------------------------------
//                                                  SERVER DEFINITION
//-------------------------------------------------------------------------------------------------------------------------------
const server = http.createServer((req, res) => {
    const endpoint = req.url.split('?')[0];
    console.log(`${req.socket.remoteAddress.substring(7)}---"${req.method} ${endpoint}"`);
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //                                              GET REQUETS
    //-------------------------------------------------------------------------------------------------------------------------------
    
    if(req.method == 'GET'){
        var fileUrl;
        if(req.url == '/'){
            fileUrl = '/index.html'
        }
        else if(req.url.startsWith('/sensor')){
            const deviceId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('deviceId');
            fileUrl = '/sensor/sensor.html'
        }
        else{
            fileUrl = req.url;
        }
        
        var filePath = path.resolve('.' + fileUrl);
        const fileExt = path.extname(filePath);
        if(fileExt == '.html'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if(fileExt == '.ico'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'image/x-icon');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.css') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/css');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.js'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/javascript');
                fs.createReadStream(filePath).pipe(res);
            });
            
        }
        else{
            if(req.url.startsWith('/api/cachedData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(cachedData));
                res.end();
            }
            else if(req.url.startsWith('/api/heatMap'))
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(HeatMap));
                res.end();
                // circleToHeat(1,1,0.6,[  [0.2, 0.3, 0.25, 0],
                //     [0.5, 0.3, 0.2, 0.2],
                //     [0.8, 0, 0, 0]
                //   ]);
                let circles = [stationHQ.stationList[0].circle, stationHQ.stationList[1].circle, stationHQ.stationList[2].circle]
                circleToHeat(circles, stationHQ.getProbabilities());
            }
            else if(req.url.startsWith('/api/initData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(initData));
                res.end();
            }
            else if(req.url.startsWith('/api/allData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write({'status': 'succ'});
                res.end();
            }
            else if(req.url.startsWith('/api/getSampleRate')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({'sampling_rate': sampleRate}));
                res.end();
            }
            
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({
                    rowSize: 10,
                    columnSize: 10
                }));
                res.end()
            }
        }
    }
    //-------------------------------------------------------------------------------------------------------------------------------
    //                                              POST REQUETS
    //-------------------------------------------------------------------------------------------------------------------------------
    else if(req.method == 'POST'){
        if(req.url.startsWith('/api/change-color-to-red')){
            Object.values(cachedData).forEach((device) => {
                device.color = 'red';
            });
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/change-color-to-green')){
            Object.values(cachedData).forEach((device) => {
                device.color = 'green';
            });
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/recdata')){
            var recieved = '';
            req.on('data', function(data)
            {
                recieved += data
            });
            req.on('end', function(){
                var data = JSON.parse(recieved);
                // cachedData[data['id']].status.temperature = data['temp'];
                // cachedData[data['id']].status.humidity = data['humidity'];
                // cachedData[data['id']].status.rain = data['rain'];
                // cachedData[data['id']].status.windSpeed = data['wind'];
                stationMap[data['id']].readings = {
                    temperature: data['temp'],
                    relativeHumidity: data['humidity'],
                    windSpeed: data['wind'],
                    precipitation: data['rain']
                }
            })
	    res.statusCode = 200;
	    res.end();
        }
        else if(req.url.startsWith('/api/EmailSubmission')){
            var recieved = '';
            req.on('data', function(data){
                recieved += data
            });
            req.on('end', function(){
                var data = JSON.parse(recieved);
                fs.appendFileSync("email.txt", data["email"] +"\n");
            })
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/SampleRateChange')){
            var recieved = '';
            req.on('data', function(data){
                recieved += data
            });
            req.on('end', function(){
                var data = JSON.parse(recieved);
                sampleRate = data["sample"];
            })
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/ChangePosition')){
            var recieved = '';
            req.on('data', function(data){
                recieved += data
            });
            req.on('end', function(){
                var data = JSON.parse(recieved);
                // console.log(data);
                var index = stationHQ.setPosition(data["device"], parseInt(data["x"]), parseInt(data["y"]));
                var pos = fs.readFileSync("positions.txt").toString().split("\n").map(x => x.split(","));
                pos[index] = [data["x"], data["y"]];
                fs.writeFileSync("positions.txt",
                    pos[0][0]+ "," + pos[0][1] + "\n" +
                    pos[1][0]+ "," + pos[1][1] + "\n" +
                    pos[2][0]+ "," + pos[2][1] + "\n" 
                );
            })
            res.statusCode = 301;
            res.write('http://13.41.188.158:8080');
            res.end();
        }
    }
});


server.listen(port, () => {
    console.log(`server listening on port ${port}...`)
    console.log('------------------------------------------------------------------------------------------')
});



// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const Id = {val: 0};
// async function incrId(Id){
//     while(1){
//         await sleep(1000);
//         Id.val += 1;
//         console.log(Id);
//     }
// }
// incrId(Id)
