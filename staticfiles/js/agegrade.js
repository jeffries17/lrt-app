async function loadAgeData(gender, distance) {
  const response = await fetch(`/static/csv/bestracetimes/${gender}-${distance}.csv`);
  const data = await response.text();
  return parseCSV(data);
}

function parseCSV(csvData) {
  const lines = csvData.split("\n");
  const result = [];
  lines.forEach((line, index) => {
      if (index > 0 && line.trim() !== "") {
          const columns = line.split(",");
          if (columns.length > 4) {
              const age = columns[2].trim();
              const timeString = columns[4].trim();

              if (age && timeString) {
                  const timeParts = timeString.split(":");
                  let totalSeconds = 0;
                  if (timeParts.length === 3) { // hh:mm:ss
                      totalSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);
                  } else if (timeParts.length === 2) { // mm:ss
                      totalSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                  } else if (timeParts.length === 1) { // ss
                      totalSeconds = parseInt(timeParts[0]);
                  }
                  result.push({
                      age: parseInt(age),
                      time: totalSeconds
                  });
              }
          }
      }
  });
  console.log(result);
  return result;
}

function findClosestRecord(data, age) {
  let closest = data.reduce((prev, curr) => {
      return (Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev);
  });
  return closest; // Returns the closest data object
}

function findStandardRecordTime(data) {
  return Math.min(...data.map(record => record.time));
}

function calculateAgeGradedTime(athleteTime, ageFactor) {
  return athleteTime * ageFactor;
}

function calculateAgeGradingPercentage(standardTime, ageGradedTime) {
  return (standardTime / ageGradedTime) * 100;
}

async function calculateAgeGrading() {
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const distance = document.getElementById('distance').value.replace(' ', '_').toLowerCase();
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;
  const athleteTime = hours * 3600 + minutes * 60 + seconds;

  const ageData = await loadAgeData(gender, distance);
  const standardRecordTime = findStandardRecordTime(ageData);
  const closestRecord = findClosestRecord(ageData, age);
  const ageFactor = athleteTime / closestRecord.time;
  const ageGradedTime = calculateAgeGradedTime(athleteTime, ageFactor);
  const ageGradingPercentage = calculateAgeGradingPercentage(standardRecordTime, ageGradedTime);

  // Update HTML with results
  document.getElementById('ageFactor').textContent = ageFactor.toFixed(3);
  document.getElementById('ageGradedResult').textContent = formatTime(ageGradedTime);
  document.getElementById('ageGradedScore').textContent = ageGradingPercentage.toFixed(2) + '%';
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}