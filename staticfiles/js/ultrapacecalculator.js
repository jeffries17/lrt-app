
document.getElementById("paceCalculator").onsubmit = function(event) {
  event.preventDefault();
  var distance = parseFloat(document.getElementById("distance").value);
  var distanceUnit = document.getElementById("distanceUnit").value;
  var elevationGain = parseFloat(document.getElementById("elevation").value);
  var elevationUnit = document.getElementById("elevationUnit").value;
  var recentDistance = parseFloat(document.getElementById("recentDistance").value);
  var recentDistanceUnit = document.getElementById("recentDistanceUnit").value;
  var recentTime = document.getElementById("recentTime").value;

  // Convert all inputs to a standard unit (kilometers and meters)
  if (distanceUnit === "miles") {
      distance = distance * 1.60934; // Convert miles to kilometers
  }
  if (elevationUnit === "feet") {
      elevationGain = elevationGain * 0.3048; // Convert feet to meters
  }
  if (recentDistanceUnit === "miles") {
      recentDistance = recentDistance * 1.60934; // Convert miles to kilometers
  }

  // Calculate base pace from recent race
  var basePace = calculateBasePace(recentDistance, recentTime);

  // Validate inputs
  if (isNaN(distance) || isNaN(elevationGain) || isNaN(basePace)) {
      document.getElementById("result").innerHTML = "Please enter valid numbers for distance, elevation gain, and recent race details.";
      return;
  }

  // Calculate adjusted distance based on elevation
  var adjustedDistance = calculateAdjustedDistance(distance, elevationGain);
  
  // Calculate pace based on adjusted distance and base pace
  var paceKM = calculatePace(adjustedDistance, distance, basePace); // Pace in km/min
  var paceMI = paceKM * 1.60934; // Corrected conversion for pace to mi/min

  // Format pace as minutes:seconds
  var formattedPaceKM = formatPace(paceKM);
  var formattedPaceMI = formatPace(paceMI);

  // Calculate the estimated finish time based on original distance and pace in km
  var finishTime = calculateFinishTime(paceKM, distance);
  
  document.getElementById("result").innerHTML = "Calculated Pace: " + formattedPaceKM + "/km (" + formattedPaceMI + "/mi)<br>Estimated Finish Time: " + finishTime;
};

function calculateBasePace(distance, timeString) {
  var timeParts = timeString.split(':');
  var timeInMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + parseInt(timeParts[2]) / 60;
  return timeInMinutes / distance; // Pace in min/km
}

function calculateAdjustedDistance(distance, elevationGain) {
  // Add 6m for every 1m of elevation gained
  return distance + (elevationGain * 6 / 1000); // Convert added distance to kilometers
}

function calculatePace(adjustedDistance, originalDistance, basePace) {
  // Adjust the pace based on the adjusted distance
  var adjustedPace = basePace * (adjustedDistance / originalDistance);
  return adjustedPace;
}

function formatPace(pace) {
  var minutes = Math.floor(pace);
  var seconds = Math.round((pace - minutes) * 60);
  if (seconds < 10) seconds = '0' + seconds; // Add leading zero if necessary
  return minutes + ':' + seconds;
}

function calculateFinishTime(pace, distance) {
  // Convert pace to hours and multiply by distance
  var totalTime = (pace / 60) * distance;
  var hours = Math.floor(totalTime);
  var minutes = Math.round((totalTime - hours) * 60);
  return hours + " hours and " + minutes + " minutes";
}
