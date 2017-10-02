# cognicity-sensors
Scaleable sensors infrastructure for CogniCity.

This repository contains code for AWS Lambda deployment to act as /sensors API endpoint

### Design
The CogniCity sensors project is designed to allow for easy consumption of external sensor data from APIs to be stored in a CogniCity schema instance, and serve the data through a standardised interface. For scaleability the schema component shall primairly store sensor objects in JSON/JSONB form (see below), therefore sensors does not impose strict schema on sensor data. Multiple sensor data structures for different sensors may be stored within the sensors table. Validity of sensor data is therefore the role of the sensor owner within the team, who will also be responsible for writing the required extract, transform and load (ETL) scripts to place data in the database.

#### Proposed Architecture
- An ETL module executed periodically polls external sensor data provider to get data
- The ETL module registers sensors and their data in CogniCity using the API endpoints
- The ETL module is responsible for checking whether external data represents new information to avoid duplication
- Once in the database, the client (e.g. urbanriskmap) may access sensor data via the API endpoints, and perform any additional ETL processes on the fly as required.

#### Filtering
- At the top level endpoint ("/") sensors can be filtered by bounding box
- At the sensor level endpoint ("/:id") sensors can be filtered by database update time. This is the time that the sensor data was placed into the database and does not necessarily correspond to time of sensor measurement

#### Endpoints
GET /sensors -> return list of sensors by id and their location as Geo/Topo json
- optionally filtered by bounding box
POST /sensors -> register a new sensor (API key protected)
GET /sensors/:id -> return list of sensor data
- optionally filtered by time entered into database
POST /sensors/:id -> post new data for sensor to database (API key protected)
GET /sensors/bulk -> optional endpoint for bulk sensor data streaming (API key protected)

#### Schema
- sensors
  - metadata:
    - id (assigned) ***bigint***
    - created ***timestamp with time zone***
    - properties ***json***
  - data:
    - id (assigned) ***bigint***
    - sensor_id (foreign key with metadata.id)
    - created ***timestamp with time zone***
    - properties ***json***

# Related repos:
* [schema](https://github.com/urbanriskmap/cognicity-schema) (WIP: https://github.com/urbanriskmap/cognicity-schema/issues/10)
* [API for stored sensor data](https://github.com/urbanriskmap/cognicity-server/) (WIP: https://github.com/urbanriskmap/cognicity-server/issues/57)
* [Sensor code](https://github.com/smart-facility/ttn-lopy-water-level) (WIP: https://github.com/smart-facility/ttn-lopy-water-level/issues/1)
