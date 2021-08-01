const { getTrips, getDriver } = require('api');
const { normalizeAmount, getMostTrips, getMultipleVechileDrivers} = require('../src/utils');

/**
 * This function should return the trip data analysis
 *
 * @returns {any} Trip data analysis
 */
async function analysis() {
    const Totaltrips = await getTrips();

  const cashTrips = Totaltrips.filter(trip => trip.isCash === true);
  const cashBilledTotal = cashTrips.reduce((total, trip) => {
    trip.tripTotal = normalizeAmount(trip.billedAmount);
    return total + trip.tripTotal;
  }, 0);
 
  const nonCashTrips = Totaltrips.filter(trip => trip.isCash === false);
  
  const nonCashBilledTotal = nonCashTrips.reduce((total, trip) => {
    trip.tripTotal =  normalizeAmount(trip.billedAmount);
    totalCash = normalizeAmount(total + trip.tripTotal);
    return Number(totalCash.toFixed(2));
  }, 0);
  
  const noOfDriversWithMoreThanOneVehicle = await getMultipleVechileDrivers();
 
  const totalMostTrips = await getMostTrips();
  
  

  const sortedByTrips = Object.values(totalMostTrips).sort((a, b) => b.trips - a.trips);
 
  const driverWithMostTrips = sortedByTrips[0].driverId;
  
  
  let noOfTrips = sortedByTrips[0].trips;
 
  let totalAmountEarned = sortedByTrips[0].tripTotal;
  let driverDetails = await getDriver(driverWithMostTrips);
  
  let { name, email, phone } = driverDetails;

  let mostTripsByDriver = { name, email, phone, noOfTrips, totalAmountEarned };


  const sortedByBills = Object.values(totalMostTrips).sort((a, b) => b.tripTotal - a.tripTotal);
  const driverWithHighestBill = sortedByBills[0].driverId;
  noOfTrips = sortedByBills[0].trips;

  totalAmountEarned = sortedByBills[0].tripTotal;
  driverDetails = await getDriver(driverWithHighestBill);
  driverDetails = { name, email, phone } = driverDetails;

  const highestEarningDriver = { name, email, phone, noOfTrips, totalAmountEarned };

  const result = {
    noOfCashTrips: cashTrips.length,
    noOfNonCashTrips: nonCashTrips.length,
    billedTotal: cashBilledTotal + nonCashBilledTotal,
    cashBilledTotal,
    nonCashBilledTotal,
    noOfDriversWithMoreThanOneVehicle,
    mostTripsByDriver,
    highestEarningDriver
  };

  return result;

}

module.exports = analysis;
