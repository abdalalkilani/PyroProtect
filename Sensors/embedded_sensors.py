import time
import smbus2
from time import sleep
# from ccs811 import ccs811Begin, CCS811_driveMode_1sec, ccs811SetEnvironmentalData, ccs811CheckDataAndUpdate, ccs811GetCO2, ccs811GetTVOC, ccs811CheckForError, ccs811PrintError
import RPi.GPIO as GPIO
import json
import requests


ID = 1
ADDRESS = 'http://13.41.188.158:8080/api/recdata'
GetADDRESS = 'http://13.41.188.158:8080/api/getSampleRate'
DATA = {}
def init():
        DATA['id'] = 'device' + str(ID)
def sendData():

        json_data = json.dumps(DATA)
        headers = {'Content-type': 'application/json'}
        try:
                response = requests.post(ADDRESS, data=json_data, headers=headers)
        except:
                print("Couldn't reach host")
def getData():
    try:
        response = requests.get(GetADDRESS)
        if response.status_code == 200:
            server_data = response.json()
            print(server_data)
            if 'sampling_rate' in server_data:
                    return  int(server_data['sampling_rate'])
                # print("Sampling rate changed to", server_data['sampling_rate'])
    except requests.exceptions.RequestException as e:
        return 2


        
                



GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
DIGITAL_PIN = 17
GPIO.setup(DIGITAL_PIN, GPIO.IN)

si7021_ADD = 0x40 #Add the I2C bus address for the sensor here
si7021_READ_TEMPERATURE = 0xF3 #Add the command to read temperature here
si7021_READ_HUMIDITY = 0xF5

ADS1115_ADD = 0x48
# ADS1115_READ_A0 = ??
# ADS1115_READ_A1 = ??

bus = smbus2.SMBus(1)


# ccs811 stuff
# ccs811Begin(CCS811_driveMode_1sec)                                      #start CCS811, data update rate at 1sec
init()
while(1):
        #Analog stuff
        # Wind Stuff
        bus.write_i2c_block_data(0x48, 0x01, [0xC3,0x83])
        time.sleep(0.1)
        # ADS1115 address, 0x48(72)
        # Read data back from 0x00(00), 2 bytes
        # raw_adc MSB, raw_adc LSB
        data = bus.read_i2c_block_data(0x48, 0x00, 2)
        # Convert the data
        wind_raw_adc = data[0] * 256 + data[1]
        windvoltage = wind_raw_adc* 4.096 / 32767
        # print ("Digital Value of Analog Input on Channel-0: ", windvoltage)
        
        #change this to 0.5?
        if windvoltage > 0.4:
                windspeed = (-2.62534 * pow(windvoltage, 6)) + (20.87142 * pow(windvoltage, 5)) \
                        + (-68.14970 * pow(windvoltage, 4)) + (117.16178 * pow(windvoltage, 3)) \
                        + (-111.95726 * pow(windvoltage, 2)) + (58.03388 * pow(windvoltage, 1)) \
                        + -12.00028
                print("Wind speed: ", round(windspeed, 2), "m/s")
                DATA['wind'] = windspeed
        else:
                print("Wind speed: 0m/s (too low so flow is reversed)")
                DATA['wind'] = 0.0
        
        # Rain stuff
        bus.write_i2c_block_data(0x48, 0x01, [0xD3,0x83])
        time.sleep(0.1)
        data = bus.read_i2c_block_data(0x48, 0x00, 2)
        rain_raw_adc = data[0] * 256 + data[1]
        rainvoltage = (rain_raw_adc* 4.096) / 32767
        # print ("Digital Value of Analog Input on Channel-1: ", rain_raw_adc)
        
        if GPIO.input(DIGITAL_PIN)==0:
                print('Raining!')
                rainvoltage = (rain_raw_adc* 4.096) / 32767
                # rainVal = 100 - (analog_values[1] * 100 / 32767)
                print("Moisture: ", round(rainvoltage,2) , "%")
                DATA['rain'] = rainvoltage
                
        else:
                print('Not raining!')
                rainvoltage = (rain_raw_adc* 4.096) / 32767
                print("Moisture: ", round(rainvoltage,2) , "%")
                DATA['rain'] = 0.0
        
        
        #Temp readings
        cmd_meas_temp = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_TEMPERATURE])
        read_result_temp = smbus2.i2c_msg.read(si7021_ADD,2)
        bus.i2c_rdwr(cmd_meas_temp)
        time.sleep(0.1)
        bus.i2c_rdwr(read_result_temp)
        temperature = int.from_bytes(read_result_temp.buf[0]+read_result_temp.buf[1],'big')
        tempc = (175.72 * temperature / 65536) - 46.85

        #Repeat for Humidity
        cmd_meas_humidity = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_HUMIDITY])
        read_result_humidity = smbus2.i2c_msg.read(si7021_ADD,2)
        bus.i2c_rdwr(cmd_meas_humidity)
        time.sleep(0.1)
        bus.i2c_rdwr(read_result_humidity)
        humidity = int.from_bytes(read_result_humidity.buf[0]+read_result_humidity.buf[1],'big')
        humidity_perc = (125 * humidity / 65536) - 6

        print("Temperature in °C: ", round(tempc, 2))
        print("Humidity in %: ", round(humidity_perc, 2))
        DATA['temp'] = tempc
        DATA['humidity'] = humidity_perc

        # Use temp and humidity to get CO2 and tVOC from
        # ccs811SetEnvironmentalData(tempc, humidity_perc)

        # if ccs811CheckDataAndUpdate():
        #         CO2 = ccs811GetCO2()
        #         tVOC = ccs811GetTVOC()
        #         print ("CO2 : %d ppm" %CO2)
        #         print ("tVOC : %d ppb" %tVOC)
        #         DATA['Co2'] = CO2
        #         DATA['tVoc'] = tVOC
        # elif ccs811CheckForError():
        #         ccs811PrintError()
        sendData()
        sleep(getData()-0.3)