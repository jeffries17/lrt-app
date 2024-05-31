document.addEventListener('DOMContentLoaded', function() {
  const distanceSelect = document.getElementById('distance');
  const weeksInput = document.getElementById('trainingWeeks');
  const unitSelect = document.getElementById('unit');
  const trainingPlanOutput = document.getElementById('trainingPlanOutput');
  const customDistanceInput = document.getElementById('customDistanceInput');
  const customDistanceField = document.getElementById('customDistance');

  const speedRunSessions = ["Hill Repeats"];
  const mediumRunSessions = ["Tempo", "Progression", "Long Intervals", "Threshold"];
  const longRunSessions = ["Long Run"];

  function convertToMiles(km) {
    return km * 0.621371;
  }

  function convertToKilometers(miles) {
    return miles / 0.621371;
  }

  function getRandomSession(sessions) {
    return sessions[Math.floor(Math.random() * sessions.length)];
  }

  function generateRunToFinishPlan() {
    const distanceValue = distanceSelect.value;
    const unitValue = unitSelect.value;
    const numberOfWeeksToTrain = parseInt(weeksInput.value);

    let minEasyRunDist, maxEasyRunDist, minMedRunDist, maxMedRunDist, minSpeedRunDist, maxSpeedRunDist, minLongRunDist, maxLongRunDist, taperWeeksCount = 0;

    switch (distanceValue) {
      case "marathon":
        minEasyRunDist = 8; maxEasyRunDist = 16;
        minMedRunDist = 7; maxMedRunDist = 13;
        minSpeedRunDist = 7; maxSpeedRunDist = 10;
        minLongRunDist = 12; maxLongRunDist = 35;
        taperWeeksCount = 3;
        break;
      case "50k":
        minEasyRunDist = 10; maxEasyRunDist = 20;
        minMedRunDist = 8; maxMedRunDist = 16;
        minSpeedRunDist = 7; maxSpeedRunDist = 12;
        minLongRunDist = 15; maxLongRunDist = 40;
        taperWeeksCount = 4;
        break;
      case "50 mile":
        minEasyRunDist = 12; maxEasyRunDist = 24;
        minMedRunDist = 10; maxMedRunDist = 20;
        minSpeedRunDist = 8; maxSpeedRunDist = 15;
        minLongRunDist = 20; maxLongRunDist = 50;
        taperWeeksCount = 4;
        break;
      case "100k":
        minEasyRunDist = 15; maxEasyRunDist = 30;
        minMedRunDist = 12; maxMedRunDist = 24;
        minSpeedRunDist = 10; maxSpeedRunDist = 18;
        minLongRunDist = 25; maxLongRunDist = 60;
        taperWeeksCount = 5;
        break;
      case "100 mile":
        minEasyRunDist = 20; maxEasyRunDist = 40;
        minMedRunDist = 15; maxMedRunDist = 30;
        minSpeedRunDist = 12; maxSpeedRunDist = 24;
        minLongRunDist = 30; maxLongRunDist = 80;
        taperWeeksCount = 6;
        break;
      case "custom":
        const customDistance = parseFloat(customDistanceField.value);
        if (unitValue === 'miles') {
          minEasyRunDist = convertToKilometers(customDistance) * 0.2;
          maxEasyRunDist = convertToKilometers(customDistance) * 0.4;
          minMedRunDist = convertToKilometers(customDistance) * 0.15;
          maxMedRunDist = convertToKilometers(customDistance) * 0.3;
          minSpeedRunDist = convertToKilometers(customDistance) * 0.1;
          maxSpeedRunDist = convertToKilometers(customDistance) * 0.2;
          minLongRunDist = convertToKilometers(customDistance) * 0.3;
          maxLongRunDist = convertToKilometers(customDistance) * 0.8;
        } else {
          minEasyRunDist = customDistance * 0.2;
          maxEasyRunDist = customDistance * 0.4;
          minMedRunDist = customDistance * 0.15;
          maxMedRunDist = customDistance * 0.3;
          minSpeedRunDist = customDistance * 0.1;
          maxSpeedRunDist = customDistance * 0.2;
          minLongRunDist = customDistance * 0.3;
          maxLongRunDist = customDistance * 0.8;
        }
        taperWeeksCount = 3;
        break;
    }

    function getIncreasingNumberBetween(min, max, week, totalWeeks) {
      const difference = max - min;
      const increment = difference / (totalWeeks - taperWeeksCount - 1);
      let distance = min + increment * (week - 1);
      if (unitValue === 'miles') {
        distance = convertToMiles(distance);
      }
      return Math.max(0, distance.toFixed(2));  // Ensures no negative distance
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
        const weekNumber = startWeekNumber + index + 1; // Adjust for correct week number
        const unitText = unitValue === 'miles' ? 'miles' : 'km';
        taperHtml += `
          <tr>
            <td>Taper Week ${weekNumber}</td>
            <td><a href="#rest">Rest or Crosstrain</a></td>
            <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${week.mediumRunDistance} ${unitText}</td>
            <td><a href="#easy">Easy</a> - ${week.easyRunDistance} ${unitText}</td>
            <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${week.speedRunDistance} ${unitText}</td>
            <td><a href="#rest">Rest or Crosstrain</a></td>
            <td><a href="#easy">Easy</a> - ${week.easyRunDistance} ${unitText}</td>
            <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${week.longRunDistance} ${unitText}</td>
            <td>${(parseFloat(week.easyRunDistance * 2) + parseFloat(week.mediumRunDistance) + parseFloat(week.speedRunDistance) + parseFloat(week.longRunDistance)).toFixed(2)} ${unitText}</td>
          </tr>
        `;
      });
      return taperHtml;
    }

    function createPlan() {
      let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th><th>Total Mileage</th></tr></thead><tbody>';
      const totalWeeks = numberOfWeeksToTrain;

      const trainingWeeks = totalWeeks - taperWeeksCount;

      for (let week = 1; week <= trainingWeeks; week++) {
        const easyDist = getIncreasingNumberBetween(minEasyRunDist, maxEasyRunDist, week, totalWeeks);
        const medDist = getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, week, totalWeeks);
        const speedDist = getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, week, totalWeeks);
        const longDist = getIncreasingNumberBetween(minLongRunDist, maxLongRunDist, week, totalWeeks);
        planHtml += createWeekRow(week, easyDist, medDist, speedDist, longDist);
      }

      const taperWeeks = [
        { mediumRunDistance: getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, 1, 3), speedRunDistance: getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, 1, 3), easyRunDistance: minEasyRunDist, longRunDistance: minLongRunDist },
        { mediumRunDistance: getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, 2, 3), speedRunDistance: getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, 2, 3), easyRunDistance: minEasyRunDist, longRunDistance: minLongRunDist },
        { mediumRunDistance: getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, 3, 3), speedRunDistance: getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, 3, 3), easyRunDistance: minEasyRunDist, longRunDistance: minLongRunDist }
      ];
      const taperWeeksHtml = handleTaperWeeks(taperWeeks, totalWeeks - taperWeeksCount);

      planHtml += taperWeeksHtml;

      const raceWeekRow = `
        <tr>
          <td>Week ${totalWeeks}</td>
          <td><a href="#rest">Rest or Crosstrain</a></td>
          <td><a href="#easy">Easy</a> - 5 ${unitValue}</td>
          <td>Rest</td>
          <td><a href="#easy">Easy</a> - 3 ${unitValue}</td>
          <td>Rest</td>
          <td>Race Day!</td>
          <td>${(5 + 3).toFixed(2)} ${unitValue}</td>
        </tr>
      `;
      planHtml += raceWeekRow;
      planHtml += '</tbody></table>';
      trainingPlanOutput.innerHTML = planHtml;

      document.getElementById('selectedDistance').value = distanceValue;
      document.getElementById('selectedWeeks').value = totalWeeks;

      addDownloadAndEmailButtons();
    }

    createPlan();
  }

  distanceSelect.addEventListener('change', function() {
    if (distanceSelect.value === 'custom') {
      customDistanceInput.style.display = 'block';
    } else {
      customDistanceInput.style.display = 'none';
    }
  });

  document.getElementById('generatePlan').addEventListener('click', generateRunToFinishPlan);

  window.generateRunToFinishPlan = generateRunToFinishPlan;
});
