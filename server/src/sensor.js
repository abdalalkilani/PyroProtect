const HOST = 'http://13.41.188.158:8080';

const msg = window.location.search;

const args= msg.slice(1).split('&');

const params= new Map(args.map((str) =>{
    return str.split('=');
}));

const sensorId = params.get('sensorId');


fetch(HOST + '/api/allData' + sensorId).then((res) => {
    return res.json();
}).then((data) => {
    console.log(data);
})
