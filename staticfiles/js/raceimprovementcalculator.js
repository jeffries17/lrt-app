// Function to convert seconds to HH:MM:SS format
function toHHMMSS(sec_num) {
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }

  console.log(`Converted to HH:MM:SS -> ${hours}:${minutes}:${seconds}`);
  return hours + ':' + minutes + ':' + seconds;
}

// Function to calculate improved race time based on mileage and experience level
function calculateImprovedRaceTime(currentTime, mileage, trainingLevel) {
  var a = currentTime.split(':');  // Split current time into hours, minutes, seconds
  console.log(`Current time split into H:M:S -> ${a[0]}:${a[1]}:${a[2]}`);

  var seconds = (+a[0]) * 3600 + (+a[1]) * 60 + (+a[2]);  // Convert current time to total seconds
  console.log(`Converted current time to seconds -> ${seconds}`);

  // Base seconds of improvement per mile
  var baseImprovementPerMile = 30;

  // Adjust improvement factor based on experience level
  var improvementFactor;
  switch (trainingLevel) {
      case "beginner":
          improvementFactor = 0.8; // 80% of base improvement
          break;
      case "intermediate":
          improvementFactor = 1.2; // 120% of base improvement
          break;
      case "experienced":
          improvementFactor = 1.5; // 150% of base improvement
          break;
      default:
          improvementFactor = 1; // Default to 100% if no matching case
  }

  var totalImprovement = baseImprovementPerMile * mileage * improvementFactor;
  console.log(`Total improvement calculated -> ${totalImprovement} seconds for ${mileage} miles at ${trainingLevel} level`);

  seconds -= totalImprovement;  // Reduce the race time by the total improvement
  console.log(`New time in seconds after improvement -> ${seconds}`);

  return toHHMMSS(Math.max(seconds, 0));  // Ensure the result is non-negative
}

// Adjust the event listener to fetch the correct experience level from dropdown
jQuery(document).ready(function () {
  jQuery('#predicted-time-improvement').on('click', function () {
      console.log("Button clicked"); // Log to ensure the button click event is triggered

      var current_time = jQuery('#current-time').val();
      console.log(`Original race time entered -> ${current_time}`);

      var mileage = parseFloat(jQuery('#average-weekly-mileage').val());
      console.log(`Mileage entered -> ${mileage} miles/week`);

      var trainingLevel = jQuery('#quality-of-training').val();  // Fetch the quality of training from dropdown
      console.log(`Training level selected -> ${trainingLevel}`);

      var improvedTime = calculateImprovedRaceTime(current_time, mileage, trainingLevel);
      jQuery('#predicted-improvement').val(improvedTime);
      console.log(`Final predicted race time -> ${improvedTime}`);
  });
});

