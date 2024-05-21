document.addEventListener('DOMContentLoaded', function() {
  const distanceSelect = document.getElementById('distance');
  const weeksInput = document.getElementById('weeks');
  const unitSelect = document.getElementById('unit');
  const trainingPlanOutput = document.getElementById('trainingPlanOutput');

  const previousDistanceSelect = document.getElementById('previous-distance');
  const previousTimeInput = document.getElementById('previous-time');
  const newDistanceSelect = document.getElementById('new-distance');
  const weeksFasterInput = document.getElementById('weeks-faster');
  const unitFasterSelect = document.getElementById('unit-faster');
  const fasterPlanOutput = document.getElementById('fasterPlanOutput');
  const paceBreakdown = document.getElementById('paceBreakdown');
  const paceSlider = document.getElementById('pace-slider');
  const paceSliderValue = document.getElementById('pace-slider-value');
  const sliderContainer = document.getElementById('slider-container');

  const speedRunSessions = [
      "100m Intervals",
      "400m Intervals",
      "800m Intervals",
      "Hill Repeats",
  ];

  const mediumRunSessions = [
      "Fartlek",
      "Tempo",
      "Progression",
      "Long Intervals",
      "Threshold",
  ];

  const longRunSessions = [
      "Long Run",
      "Long Run",
      "Long Run",
      "Long Run (Sprint Finish)",
      "Long Run (Sprint Finish)",
      "Long Run (Progression)",
      "Long Run (Progression)",
      "Long Run (Race Pace)",
  ];

  function convertToMiles(km) {
      return km * 0.621371;
  }

  function convertToKilometers(miles) {
      return miles / 0.621371;
  }

  function convertTimeToSeconds(time) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  }

  function calculatePace(totalSeconds, distance) {
      return totalSeconds / distance;
  }

  function formatPace(secondsPerUnit) {
      const minutes = Math.floor(secondsPerUnit / 60);
      const seconds = Math.round(secondsPerUnit % 60);
      return `${minutes}m ${seconds}s`;
  }

  function getRandomSession(sessions) {
      return sessions[Math.floor(Math.random() * sessions.length)];
  }

  function generateRunToFinishPlan() {
      const distanceValue = distanceSelect.value;
      const unitValue = unitSelect.value;
      let numberOfWeeksToTrain = parseInt(weeksInput.value);

      let minEasyRunDist, maxEasyRunDist, minMedRunDist, maxMedRunDist, minSpeedRunDist, maxSpeedRunDist, minLongRunDist, maxLongRunDist;
      let taperWeeksCount = 0;

      switch (distanceValue) {
          case "5k":
              minEasyRunDist = 5; maxEasyRunDist = 8;
              minMedRunDist = 4; maxMedRunDist = 5;
              minSpeedRunDist = 3; maxSpeedRunDist = 4;
              minLongRunDist = 8; maxLongRunDist = 12;
              break;
          case "10k":
              minEasyRunDist = 6; maxEasyRunDist = 9;
              minMedRunDist = 5; maxMedRunDist = 8;
              minSpeedRunDist = 4; maxSpeedRunDist = 7;
              minLongRunDist = 8; maxLongRunDist = 14;
              break;
          case "half-marathon":
              minEasyRunDist = 7; maxEasyRunDist = 12;
              minMedRunDist = 6; maxMedRunDist = 10;
              minSpeedRunDist = 5; maxSpeedRunDist = 10;
              minLongRunDist = 10; maxLongRunDist = 18;
              taperWeeksCount = 2;
              numberOfWeeksToTrain -= taperWeeksCount;  // taper weeks
              break;
          case "marathon":
              minEasyRunDist = 8; maxEasyRunDist = 16;
              minMedRunDist = 7; maxMedRunDist = 13;
              minSpeedRunDist = 7; maxSpeedRunDist = 10;
              minLongRunDist = 12; maxLongRunDist = 35;
              taperWeeksCount = 3;
              numberOfWeeksToTrain -= taperWeeksCount;  // taper weeks
              break;
      }

      numberOfWeeksToTrain -= 1;  // reserve last week for race week

      function getIncreasingNumberBetween(min, max, week, totalWeeks) {
          const difference = max - min;
          const increment = difference / totalWeeks;
          let distance = Math.round(min + increment * week);
          if (unitValue === 'miles') {
              distance = convertToMiles(distance);
          }
          return distance.toFixed(2);
      }

      function createWeekRow(weekNumber, easyDist, medDist, speedDist, longDist) {
          const row = `
              <tr>
                  <td>Week ${weekNumber}</td>
                  <td><a href="#rest">Rest or Crosstrain</a></td>
                  <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${medDist}${unitValue}</td>
                  <td><a href="#easy">Easy</a> - ${easyDist}${unitValue}</td>
                  <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${speedDist}${unitValue}</td>
                  <td><a href="#rest">Rest or Crosstrain</a></td>
                  <td><a href="#easy">Easy</a> - ${easyDist}${unitValue}</td>
                  <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${longDist}${unitValue}</td>
              </tr>
          `;
          return row;
      }

      function handleTaperWeeks(taperWeeks, startWeekNumber) {
          let taperHtml = '';
          taperWeeks.forEach((week, index) => {
              const mediumRunSession = getRandomSession(mediumRunSessions);
              const mediumRunSessionLink = mediumRunSession.replace(/\s+/g, "-").toLowerCase();
              const speedRunSession = getRandomSession(speedRunSessions);
              const speedRunSessionLink = speedRunSession.replace(/\s+/g, "-").toLowerCase();
              const longRunSession = getRandomSession(longRunSessions);
              const longRunSessionLink = longRunSession.replace(/\s+/g, "-").replace(/\(/g, "").replace(/\)/g, "").toLowerCase();

              const weekNumber = startWeekNumber + index;
              taperHtml += `
                  <tr>
                      <td>Week ${weekNumber}</td>
                      <td><a href="#run-type-rest-crosstrain">Rest or <br>Crosstrain</a></td>
                      <td><a href="#run-type-${mediumRunSessionLink}">${mediumRunSession}</a> - ${week.mediumRunDistance}${unitValue}</td>
                      <td><a href="#run-type-easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
                      <td><a href="#run-type-${speedRunSessionLink}">${speedRunSession}</a> - ${week.speedRunDistance}${unitValue}</td>
                      <td><a href="#run-type-rest-crosstrain">Rest or <br>Crosstrain</a></td>
                      <td><a href="#run-type-easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
                      <td><a href="#run-type-${longRunSessionLink}">${longRunSession}</a> - ${week.longRunDistance}${unitValue}</td>
                  </tr>
              `;
          });
          return taperHtml;
      }

      function createPlan() {
          let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th></tr></thead><tbody>';
          for (let week = 1; week <= numberOfWeeksToTrain; week++) {
              const easyDist = getIncreasingNumberBetween(minEasyRunDist, maxEasyRunDist, week, numberOfWeeksToTrain);
              const medDist = getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, week, numberOfWeeksToTrain);
              const speedDist = getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, week, numberOfWeeksToTrain);
              const longDist = getIncreasingNumberBetween(minLongRunDist, maxLongRunDist, week, numberOfWeeksToTrain);
              planHtml += createWeekRow(week, easyDist, medDist, speedDist, longDist);
          }

          // Add taper weeks if necessary
          let taperWeeksHtml = '';
          if (distanceValue === "half-marathon") {
              const taperWeeks = [
                  { mediumRunDistance: getIncreasingNumberBetween(6, 7, 1, 2), speedRunDistance: getIncreasingNumberBetween(5, 7, 1, 2), easyRunDistance: 10, longRunDistance: 15 },
                  { mediumRunDistance: getIncreasingNumberBetween(6, 7, 2, 2), speedRunDistance: getIncreasingNumberBetween(5, 7, 2, 2), easyRunDistance: 10, longRunDistance: 12 }
              ];
              taperWeeksHtml = handleTaperWeeks(taperWeeks, numberOfWeeksToTrain + 1);
          }

          if (distanceValue === "marathon") {
              const taperWeeks = [
                  { mediumRunDistance: getIncreasingNumberBetween(7, 10, 1, 3), speedRunDistance: getIncreasingNumberBetween(4, 8, 1, 3), easyRunDistance: 12, longRunDistance: 26 },
                  { mediumRunDistance: getIncreasingNumberBetween(7, 8, 2, 3), speedRunDistance: getIncreasingNumberBetween(4, 6, 2, 3), easyRunDistance: 10, longRunDistance: 20 },
                  { mediumRunDistance: getIncreasingNumberBetween(7, 7, 3, 3), speedRunDistance: getIncreasingNumberBetween(4, 4, 3, 3), easyRunDistance: 10, longRunDistance: 16 }
              ];
              taperWeeksHtml = handleTaperWeeks(taperWeeks, numberOfWeeksToTrain + 1);
          }

          planHtml += taperWeeksHtml;

          // Add race week
          const totalWeeks = parseInt(weeksInput.value);
          const raceWeekRow = `
              <tr>
                  <td>Week ${totalWeeks}</td>
                  <td><a href="#rest">Rest or Crosstrain</a></td>
                  <td><a href="#easy">Easy</a> - 5${unitValue}</td>
                  <td><a href="#rest">Rest or Crosstrain</a></td>
                  <td>Rest</td>
                  <td><a href="#easy">Easy</a> - 3${unitValue}</td>
                  <td>Rest</td>
                  <td>Race Day!</td>
              </tr>
          `;
          planHtml += raceWeekRow;
          planHtml += '</tbody></table>';
          trainingPlanOutput.innerHTML = planHtml;
      }

      createPlan();
  }

  function generateRunToGoFasterPlan() {
      const previousDistance = previousDistanceSelect.value;
      const previousTime = previousTimeInput.value;
      const newDistance = newDistanceSelect.value;
      const unitValue = unitFasterSelect.value;
      let numberOfWeeksToTrain = parseInt(weeksFasterInput.value);

      const previousDistanceInKm = unitValue === 'miles' ? convertToKilometers(parseFloat(previousDistance)) : parseFloat(previousDistance);
      const previousTimeInSeconds = convertTimeToSeconds(previousTime);
      const previousPace = calculatePace(previousTimeInSeconds, previousDistanceInKm);

      // Adjust the previous pace by dropping 15 seconds per mile (convert to seconds per km for consistency)
      const newPace = previousPace - (15 / 1.60934);
      const newFinishTimeInSeconds = newPace * previousDistanceInKm;

      sliderContainer.style.display = 'block';  // Show the slider
      paceSlider.value = 0;
      paceSlider.max = 60;
      paceSlider.min = -60;

      paceSlider.addEventListener('input', function() {
          const adjustedPace = newPace + parseInt(paceSlider.value);
          paceSliderValue.textContent = paceSlider.value;

          const trainingPaces = calculateTrainingPaces(adjustedPace);
          displayPaceBreakdown(previousTime, previousPace, adjustedPace, trainingPaces);
      });

      const trainingPaces = calculateTrainingPaces(newPace);
      displayPaceBreakdown(previousTime, previousPace, newPace, trainingPaces);

      function calculateTrainingPaces(basePace) {
          return {
              racePace: basePace,
              recoveryPace: basePace + 90,
              progressionPace: basePace * 0.95,
              fartlekPace: basePace * 0.85,
              pace400m: basePace / 4,
              pace600m: basePace * (600 / 1000),
              pace800m: basePace * (800 / 1000),
              pace1200m: basePace * (1200 / 1000)
          };
      }

      function formatTime(seconds) {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const remainingSeconds = Math.round(seconds % 60);
          return `${hours}h ${minutes}m ${remainingSeconds}s`;
      }

      function displayPaceBreakdown(previousTime, previousPace, newPace, trainingPaces) {
          const newFinishTime = formatTime(newPace * previousDistanceInKm);
          const previousPaceFormatted = formatPace(previousPace);
          const newPaceFormatted = formatPace(newPace);

          paceBreakdown.innerHTML = `
              <div style="margin-bottom: 20px;">
                  <h5>Previous Race Time: ${previousTime}</h5>
                  <h5>Previous Race Pace: ${previousPaceFormatted} per ${unitValue === 'miles' ? 'mile' : 'km'}</h5>
              </div>
              <div>
                  <h5>New Proposed Race Pace: ${newPaceFormatted} per ${unitValue === 'miles' ? 'mile' : 'km'}</h5>
                  <h5>New Proposed Finish Time: ${newFinishTime}</h5>
              </div>
              <div id="slider-container" class="mt-2 mb-3">
                  <label for="pace-slider">Adjust New Race Pace:</label>
                  <input type="range" id="pace-slider" min="-60" max="60" value="0" step="1">
                  <span id="pace-slider-value">0</span> seconds per km
              </div>
              <table class="table table-bordered">
                  <thead><tr><th>Run Type</th><th>New Pace</th></tr></thead>
                  <tbody>
                      <tr><td>Race Pace</td><td>${formatPace(trainingPaces.racePace)} per ${unitValue === 'miles' ? 'mile' : 'km'}</td></tr>
                      <tr><td>Recovery Pace</td><td>${formatPace(trainingPaces.recoveryPace)} per ${unitValue === 'miles' ? 'mile' : 'km'}</td></tr>
                      <tr><td>Progression Pace</td><td>${formatPace(trainingPaces.progressionPace)} per ${unitValue === 'miles' ? 'mile' : 'km'}</td></tr>
                      <tr><td>Fartlek Pace</td><td>${formatPace(trainingPaces.fartlekPace)} per ${unitValue === 'miles' ? 'mile' : 'km'}</td></tr>
                  </tbody>
              </table>
              <table class="table table-bordered">
                  <thead><tr><th>Interval Distance</th><th>New Pace</th></tr></thead>
                  <tbody>
                      <tr><td>400m</td><td>${formatPace(trainingPaces.pace400m)}</td></tr>
                      <tr><td>600m</td><td>${formatPace(trainingPaces.pace600m)}</td></tr>
                      <tr><td>800m</td><td>${formatPace(trainingPaces.pace800m)}</td></tr>
                      <tr><td>1200m</td><td>${formatPace(trainingPaces.pace1200m)}</td></tr>
                  </tbody>
              </table>
          `;
      }

      function createWeekRow(weekNumber, easyDist, medDist, speedDist, longDist) {
          const row = `
              <tr>
                  <td>Week ${weekNumber}</td>
                  <td><a href="#rest">Rest or Crosstrain</a></td>
                  <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${medDist}${unitValue}</td>
                  <td><a href="#easy">Easy</a> - ${easyDist}${unitValue}</td>
                  <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${speedDist}${unitValue}</td>
                  <td><a href="#rest">Rest or Crosstrain</a></td>
                  <td><a href="#easy">Easy</a> - ${easyDist}${unitValue}</td>
                  <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${longDist}${unitValue}</td>
              </tr>
          `;
          return row;
      }

      function createPlan() {
          let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th></tr></thead><tbody>';
          for (let week = 1; week <= numberOfWeeksToTrain; week++) {
              const easyDist = 5; // Example distance
              const medDist = 8;  // Example distance
              const speedDist = 3;  // Example distance
              const longDist = 15; // Example distance
              planHtml += createWeekRow(week, easyDist, medDist, speedDist, longDist);
          }

          planHtml += '</tbody></table>';
          fasterPlanOutput.innerHTML = planHtml;
      }

      createPlan();
  }

  window.generateRunToFinishPlan = generateRunToFinishPlan;
  window.generateRunToGoFasterPlan = generateRunToGoFasterPlan;
});
