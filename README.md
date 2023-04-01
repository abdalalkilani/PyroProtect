# PyroProtect

Internet of Things (IoT) device network that generates a probability map for the location of a fire outbreak in a specific area.
We use a Raspberry PI Zero WH with a temperature sensor, gas sensor, wind sensor and a rain sensor to read mesurements and send them to a server, which processes the data and comes up with the probability map. The server also distributes HTML files and JavaScript code for the website.

## Running code

To run the code, for example if the code has been cloned to a server, navigate to the [server](/server/) folder and run the command:
```
node index.js
```
Then navigate to website http://13.41.188.158:8080.

When the sensors are not connected however, the website will display unusual (sometimes simulated) outputs.

## Raspberry PI

### Sensor Setup
The Raspberry Pi code for this project can be found in the [Sensor](/Sensors/) folder. The project utilizes four sensors, including a temperature sensor, a relative humidity sensor, a precipitation sensor, and a wind speed sensor.

### I2C Communication
The temperature and relative humidity sensors are connected to the Raspberry Pi via the I2C communication protocol. Please ensure that I2C is enabled in the Raspberry Pi configuration settings and the relevant kernel modules are loaded.

The ADS1115 Analog-to-Digital Converter (ADC) is also connected to the Raspberry Pi via I2C communication protocol.

### Analog-to-Digital Conversion
The precipitation and wind speed sensors provide analog output, which needs to be converted to digital signals for processing. An ADS1115 Analog-to-Digital Converter (ADC) is used to accomplish this conversion.

Additionally, the precipitation sensor also connects to a digital GPIO pin, which provides a boolean value to determine whether it is currently raining or not.

### Sensor Data
The code in the Sensor folder retrieves and logs data from the four sensors mentioned above. Please refer to the comments in the code for more information on the data format and storage.

## Server

### Frontend

The HTML and CSS files are located in the [server](/server/) folder, while the JavaScript code that these HTML files use are located in the [server/src](/server/src/) folder.
The server runs on the [index.js](/server/index.js) file and implements a simple API to get data to and from the server.

### API

The main functionalities are:
- GET /api/cachedData: requests latest data about the sensors
- GET /api/heatMap: requests data about the probability heat map to be displayed on the overlay of the Google maps API
- GET /api/initData: requests the data necessary to initialise the heat map grid
- GET /api/getSampleRate: requests the sample rate for the Raspberry PI
- POST /api/recData: posts the sensor readings to the server
- POST /api/EmailSubmission: adds new email to the email list
- POST /api/SampleRateChange: updates the sample rate for the Raspberry PI
- POST /api/ChangePosition: updates the position of a Raspberry PI


### Data Processing

The data processing part of the code is located in [server/processing](/server/processing/) folder, written in TypeScript, and compiled into the [server/include](/server/include/) folder.
This section is structured in the following:
- Station: the parent class, which stores essential information about server readings necessary for all fire indices.
- FWIStation: a child of the Station class which implements the Canadian FWI fire index.
- StationBuilder (reffered to as stationHQ): partly an implementation of the builder design pattern, but it mainly stores instances of station along with their id, positions on the grid and their radius (which is calculated from the fire index of instances of station).
- CircleFunctions: many mathematical functions which all help to transform the fire index into a 2d array of probabilities, which is then used to display the heat map.
