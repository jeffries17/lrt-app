document.addEventListener('DOMContentLoaded', function() {
  const weeksInput = document.getElementById('weeks');
  const unitSelect = document.getElementById('unit');
  const trainingPlanOutput = document.getElementById('trainingPlanOutput');
  const goalTimeInput = document.getElementById('goalTime');
  const pacesCard = document.getElementById('pacesCard');

  const speedRunSessions = ["100m Intervals", "400m Intervals", "800m Intervals", "Hill Repeats"];
  const mediumRunSessions = ["Fartlek", "Tempo", "Progression", "Long Intervals", "Threshold"];
  const longRunSessions = ["Long Run"];

  function convertToMiles(km) {
    return km * 0.621371;
  }

  function getRandomSession(sessions) {
    return sessions[Math.floor(Math.random() * sessions.length)];
  }

  function generateAdvancedMarathonPlan() {
    const unitValue = unitSelect.value;
    const numberOfWeeksToTrain = parseInt(weeksInput.value);
    const goalTime = goalTimeInput ? goalTimeInput.value : null;

    if (!goalTime) {
      alert("Please enter a valid goal time in HH:MM:SS format.");
      return;
    }

    // Use calculateTrainingPaces from trainingpacescalculator.js to calculate the paces
    const paces = window.calculateTrainingPaces();
    if (!paces) {
      alert("Failed to calculate paces. Please ensure all required fields are filled correctly.");
      return;
    }

    // Display the paces in a card
    pacesCard.style.display = 'block';
    displayResults(paces);

    const minEasyRunDist = 8, maxEasyRunDist = 16;
    const minMedRunDist = 7, maxMedRunDist = 13;
    const minSpeedRunDist = 7, maxSpeedRunDist = 10;
    const minLongRunDist = 12, maxLongRunDist = 35;
    const taperWeeksCount = 3;

    function getIncreasingNumberBetween(min, max, week, totalWeeks) {
      const difference = max - min;
      const increment = difference / (totalWeeks - taperWeeksCount - 1);
      let distance = min + increment * (week - 1);
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
          <td>${(parseFloat(easyDist * 2) + parseFloat(medDist) + parseFloat(speedDist) + parseFloat(longDist)).toFixed(2)}${unitValue}</td>
        </tr>
      `;
      return row;
    }

    function handleTaperWeeks(taperWeeks, startWeekNumber) {
      let taperHtml = '';
      taperWeeks.forEach((week, index) => {
        const weekNumber = startWeekNumber + index;
        taperHtml += `
          <tr>
            <td>Taper Week ${weekNumber}</td>
            <td><a href="#rest">Rest or Crosstrain</a></td>
            <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${week.mediumRunDistance}${unitValue}</td>
            <td><a href="#easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
            <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${week.speedRunDistance}${unitValue}</td>
            <td><a href="#rest">Rest or Crosstrain</a></td>
            <td><a href="#easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
            <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${week.longRunDistance}${unitValue}</td>
            <td>${(parseFloat(week.easyRunDistance * 2) + parseFloat(week.mediumRunDistance) + parseFloat(week.speedRunDistance) + parseFloat(week.longRunDistance)).toFixed(2)}${unitValue}</td>
          </tr>
        `;
      });
      return taperHtml;
    }

    function createPlan() {
      let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th><th>Total Mileage</th></tr></thead><tbody>';
      const totalWeeks = numberOfWeeksToTrain;
      const trainingWeeks = totalWeeks - taperWeeksCount - 1;

      for (let week = 1; week <= trainingWeeks; week++) {
        const easyDist = getIncreasingNumberBetween(minEasyRunDist, maxEasyRunDist, week, totalWeeks);
        const medDist = getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, week, totalWeeks);
        const speedDist = getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, week, totalWeeks);
        const longDist = getIncreasingNumberBetween(minLongRunDist, maxLongRunDist, week, totalWeeks);
        planHtml += createWeekRow(week, easyDist, medDist, speedDist, longDist);
      }

      const taperWeeks = [
        { mediumRunDistance: getIncreasingNumberBetween(7, 10, 1, 3), speedRunDistance: getIncreasingNumberBetween(4, 8, 1, 3), easyRunDistance: 12, longRunDistance: 26 },
        { mediumRunDistance: getIncreasingNumberBetween(7, 8, 2, 3), speedRunDistance: getIncreasingNumberBetween(4, 6, 2, 3), easyRunDistance: 10, longRunDistance: 20 },
        { mediumRunDistance: getIncreasingNumberBetween(7, 7, 3, 3), speedRunDistance: getIncreasingNumberBetween(4, 4, 3, 3), easyRunDistance: 10, longRunDistance: 16 }
      ];
      const taperWeeksHtml = handleTaperWeeks(taperWeeks, totalWeeks - taperWeeksCount - 1 + 1);

      planHtml += taperWeeksHtml;

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
          <td>${(5 + 3).toFixed(2)}${unitValue}</td>
        </tr>
      `;
      planHtml += raceWeekRow;
      planHtml += '</tbody></table>';
      trainingPlanOutput.innerHTML = planHtml;

      document.getElementById('selectedWeeks').value = totalWeeks;
      addDownloadAndEmailButtons();
    }

    createPlan();
  }

  function displayResults(paces) {
    document.getElementById('racePaceKm').innerText = `Race Pace (per km): ${formatPace(paces.racePaceKm)}`;
    document.getElementById('racePaceMile').innerText = `Race Pace (per mile): ${formatPace(paces.racePaceMile)}`;
    document.getElementById('recoveryPaceKm').innerText = `Recovery Pace (per km): ${formatPace(paces.recoveryPaceKm)}`;
    document.getElementById('recoveryPaceMile').innerText = `Recovery Pace (per mile): ${formatPace(paces.recoveryPaceMile)}`;
    document.getElementById('progressionPaceKm').innerText = `Progression Pace (per km): ${formatPace(paces.progressionPaceKm)}`;
    document.getElementById('progressionPaceMile').innerText = `Progression Pace (per mile): ${formatPace(paces.progressionPaceMile)}`;
    document.getElementById('fartlekPaceKm').innerText = `Fartlek Pace (per km): ${formatPace(paces.fartlekPaceKm)}`;
    document.getElementById('fartlekPaceMile').innerText = `Fartlek Pace (per mile): ${formatPace(paces.fartlekPaceMile)}`;
    document.getElementById('time400m').innerText = `400m: ${formatPace(paces.pace400m)}`;
    document.getElementById('time600m').innerText = `600m: ${formatPace(paces.pace600m)}`;
    document.getElementById('time800m').innerText = `800m: ${formatPace(paces.pace800m)}`;
    document.getElementById('time1200m').innerText = `1200m: ${formatPace(paces.pace1200m)}`;
  }

  function formatPace(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemain = Math.round(seconds % 60);
    return `${minutes}m ${secondsRemain}s`;
  }

  document.getElementById('generatePlan').addEventListener('click', generateAdvancedMarathonPlan);
});
