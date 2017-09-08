var http = require('http-request');
http.get('https://codetest.kube.getswift.co/drones', function (droneErr, droneRes) {
	http.get('https://codetest.kube.getswift.co/packages', function (packageErr, packageRes) {
		if (droneErr) {
			console.error(droneErr);
			return;
		}
		if (packageErr) {
			console.error(packageErr);
			return;
		}

		var drones = JSON.parse(droneRes.buffer.toString());
		var packages = JSON.parse(packageRes.buffer.toString());
		console.log(routeDrones(drones, packages));
	});
});

function routeDrones(d,p){
	var unixTimeNow = Math.round((new Date()).getTime() / 1000);
	var depotLocation = {latitude: -37.816664, longitude: 144.963848};
	var drones = [];
	var packages = [];
	var droneAssignments = [];
	var unassignedPackages = [];

	//Listing drones and packages into workable objects with readable calculations of time and distance
	d.forEach(function(drone){
		if (drone.packages.length !== 0){
			// console.log(drone)
			var dropOff = getDistance(drone.location.latitude, drone.location.longitude, drone.packages[0].destination.latitude, drone.packages[0].destination.longitude);
			var droneReturn = getDistance(drone.packages[0].destination.latitude, drone.packages[0].destination.longitude, depotLocation.latitude, depotLocation.longitude);
			drones.push({droneId: drone.droneId, minutes_until_pickup: twoDigitDecimal(((dropOff + droneReturn)/50) * 60), packageId:drone.packages[0].packageId});
		} else {
			var pickUp = getDistance(drone.location.latitude, drone.location.longitude, depotLocation.latitude, depotLocation.longitude);
			drones.push({droneId: drone.droneId, minutes_until_pickup: twoDigitDecimal((pickUp/50) * 60)});
		}
	})

	p.forEach(function(package){
		var deliveryDistance = getDistance(package.destination.latitude, package.destination.longitude, depotLocation.latitude, depotLocation.longitude);
		packages.push({packageId: package.packageId, distance_from_depot:deliveryDistance, estimated_minutes_until_delivery: twoDigitDecimal((deliveryDistance/50) * 60), minutes_until_deadline: twoDigitDecimal((package.deadline - unixTimeNow)/60)});
	});

	// Sorting based on which drones will go back to the depot soonest
	drones.sort(function(a, b) {
		return a.minutes_until_pickup - b.minutes_until_pickup;
	});
	
	//Sorting based on which deadlines are coming up soon
	packages.sort(function(a, b) {
		return a.minutes_until_deadline - b.minutes_until_deadline;
	});

	//Look into both sets of object to compare packages to drones
	packages.forEach(function(package){
		//Packages that do not have enough time to make the deadline
		if (package.estimated_minutes_until_delivery > package.minutes_until_deadline){
			unassignedPackages.push(package.packageId);
		//Packages that can reach the destination by the deadline
		} else {
			var deliveryOnTime = false;
			var i = 0;
			while ((deliveryOnTime === false) && i < drones.length - 1) {
				//If the package can be delivered, stop the loop, add to assigned list and remove from list of eligible drones
				if((drones[i].minutes_until_pickup + package.estimated_minutes_until_delivery) <= package.minutes_until_deadline){
					deliveryOnTime = true;
					drones.splice(i,1);
					droneAssignments.push({droneId: drones[i].droneId, packageId: package.packageId})
				}
				i++;
			};
			//If a package cannot be assigned to a drone based on time constraints
			if (deliveryOnTime === false){
				unassignedPackages.push(package.packageId);
				package.deliverable = false;
			};
		};
	});
	return {assignments: droneAssignments,unassignedPackageIds: unassignedPackages};
};


function twoDigitDecimal(number){
	return Math.round(number*100)/100;
};

/*The 2 algorithms below were borrowed from StackOverflow @
https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula*/
function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI/180);
};
