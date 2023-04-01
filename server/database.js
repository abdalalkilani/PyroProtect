const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const url = 'mongodb://localhost:27017';
class Database {
    #dbClient = new MongoClient(url);
    constructor() {} 
  
    addData(sensorId, data) {
        this.#dbClient.connect((err, client) => {
            if (err) {
                throw err;
            }

            const db = client.db('sensorData');
            const collection = db.collection('sensorData');

            collection.insertOne({ sensorId, data }, (err, result) => {
                if (err) {
                    throw err;
                }

                client.close();
            });
        });
    }
  
    getData(sensorId) {
        return new Promise((resolve, reject) => {
            this.#dbClient.connect((err, client) => {
                if (err) {
                    reject(err);
                }

                const db = client.db('sensorData');
                const collection = db.collection('sensorData');

                collection.find({ sensorId }).toArray((err, result) => {
                    if (err) {
                        reject(err);
                    }

                    client.close();
                    resolve(result);
                });
            });
        });
    }
  
    // addSensor(sensorId) {
    //   if (!this.data[sensorId]) {
    //     this.data[sensorId] = [];
    //   }
    // }
    
  }

module.exports = {
    Database
}
  
//   sensorId
//   locationx
//   locationy 
//   status: 
//     gas
//     temp
    