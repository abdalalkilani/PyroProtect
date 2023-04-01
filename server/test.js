const { Database } = require('./database');

const database = new Database()
const { test } = require('jest');


test('addData should add data to the database', async () => {
  const sensorId = 'testSensor1';
  const data = {
      temperature: 25,
      humidity: 50
  };

  await database.addData(sensorId, data);

  const result = await database.getData(sensorId);
  expect(result[0].sensorId).toBe(sensorId);
  expect(result[0].data).toEqual(data);
});

test('getData should retrieve data from the database', async () => {
  const sensorId = 'testSensor2';
  const data = {
      temperature: 30,
      humidity: 60
  };

  await database.addData(sensorId, data);

  const result = await database.getData(sensorId);
  expect(result[0].sensorId).toBe(sensorId);
  expect(result[0].data).toEqual(data);
});