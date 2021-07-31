const { getTrips, getDriver, getVehicle } = require('api');
function normalizeAmount(amount){
    if(typeof(amount) == "number"){
        return amount
    }
const response =  Number(amount.replace(/[^0-9.]/g,''));
return response;
}

const getTotalTrips = Promise.resolve(getTrips()).then(result => result);

async function getTotalDrivers() {
    const totalTrips = await getTotalTrips;
    const driverIds = totalTrips.map(trip => trip.driverID);
    //make sure no driver is repeated
    const unique = new Set(driverIds);
    uniqueIds = [...unique];
  
    const response = uniqueIds.map(id => {
      return getDriver(id)
        .then(driver => {
          driver.id = id;
          return driver;
        })
        .catch(err => {
          return { id, vehicleId: "Problem with vechile ID" };
        });
    });
    return Promise.all(response).then(drivers => {
      return drivers;
    });
  }
  async function getMostTrips() {
    const totalTrips = await getTotalTrips;
    let drivers = {};
    for (let [index, trip] of totalTrips.entries()) {
      trip.tripTotal = normalizeAmount(trip.billedAmount);
      const tripTotal = trip.tripTotal;
      let driverId = trip.driverID;
  
      if (!drivers[driverId]) {
        drivers[driverId] = { driverId, trips: 1, tripTotal };
      } else {
        drivers[driverId].trips++;
        drivers[driverId].tripTotal += tripTotal;
      }
    }
    return drivers;
  }

  async function getTripsByDriver(id) {
    const totalTrips = await getTotalTrips;
    let tripsByDriver = [];
  
    for (const [index, trip] of totalTrips.entries()) {
      if (trip.driverID == id) {
        trip.tripTotal = normalizeAmount(trip.billedAmount);
        const { tripTotal, user, pickup, destination, created, isCash } = trip;
        const trips = {
          user: user.name,
          created,
          pickup: pickup.address,
          destination: destination.address,
          billed: tripTotal,
          isCash
        };
        tripsByDriver.push(trips);
      }
    }
    return tripsByDriver;
  }


async function getVehicleDetails(vehiclesID) {
    const result = [];
    const vehicleDetails = vehiclesID.map(vehicleId => {
      return getVehicle(vehicleId)
        .then(data => {
          let { plate, manufacturer } = data;
          result.push({ plate, manufacturer });
          return result;
        })
        .catch(err => {
          console.log(err);
        });
    });
  
    return Promise.all(vehicleDetails).then(details => details);
  }


module.exports = { normalizeAmount, getTotalTrips, getTotalDrivers, getMostTrips, getTripsByDriver, getVehicleDetails} ;
//module.exports.normalizeAmount = normalizeAmount;