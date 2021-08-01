const { getTrips, getDriver, getVehicle } = require('api');
const { normalizeAmount,toTwoDecimalPlace, getTotalDrivers, getTripsByDriver, getVehicleDetails, getMostTrips} = require('../src/utils');

/**
 * This function should return the data for drivers in the specified format
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
    let result = [];

    const drivers = await getTotalDrivers();
    const mostTrips = await getMostTrips();
  
    for (let driver of drivers) {
      const { name, id, phone, vehicleID } = driver;
      const vehicles = await getVehicleDetails(vehicleID);
      const trips = await getTripsByDriver(id);
      const cashTrips = trips.filter(trip => trip.isCash);
      const nonCashTrips = trips.filter(trip => !trip.isCash);
      const totalCashAmount = cashTrips.reduce((total, amount) => normalizeAmount(total) + normalizeAmount(amount.billed), 0);
      const totalNonCashAmount = nonCashTrips.reduce((total, amount) => normalizeAmount(total) + normalizeAmount(amount.billed), 0);
  
      response = {
        fullName: name,
        phone : phone,
        id,
        vehicles: vehicles[0] || [],
        noOfTrips: mostTrips[id].trips,
        noOfCashTrips: cashTrips.length,
        noOfNonCashTrips: nonCashTrips.length,
        trips,
        totalAmountEarned: toTwoDecimalPlace(totalCashAmount + totalNonCashAmount),
        totalCashAmount:  toTwoDecimalPlace(totalCashAmount),
        totalNonCashAmount: toTwoDecimalPlace(totalNonCashAmount),
      };
      clean(response);
      result.push(response);
    }
  
    return result;
}
function clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }
driverReport().then(data=> console.log(data));
module.exports = driverReport;
