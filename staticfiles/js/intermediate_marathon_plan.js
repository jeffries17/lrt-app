document.addEventListener('DOMContentLoaded', function() {
  const weeksInput = document.getElementById('weeks');
  const unitSelect = document.getElementById('unit');
  const trainingPlanOutput = document.getElementById('trainingPlanOutput');

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
  ];

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
    const selectedDistance = document.getElementById('selectedDistance').value;
    const unitValue = unitSelect.value;
    const numberOfWeeksToTrain = parseInt(weeksInput.value);

    let minEasyRunDist, maxEasyRunDist, minMedRunDist, maxMedRunDist, minSpeedRunDist, maxSpeedRunDist, minLongRunDist, maxLongRunDist, taperWeeksCount = 0;

    switch (selectedDistance) {
      case "intermediate-marathon":
        minEasyRunDist = 8; maxEasyRunDist = 16;
        minMedRunDist = 7; maxMedRunDist = 13;
        minSpeedRunDist = 7; maxSpeedRunDist = 10;
        minLongRunDist = 12; maxLongRunDist = 20;
        taperWeeksCount = 3;
        break;
    }

    function getIncreasingNumberBetween(min, max, week, totalWeeks) {
      const difference = max - min;
      const increment = difference / (totalWeeks - taperWeeksCount - 1);
      let distance = min + increment * (week - 1);
      if (unitValue === 'km') {
        distance = convertToKilometers(distance);
      }
      return distance.toFixed(2);
    }

    function createWeekRow(weekNumber, easyDist, medDist, speedDist, longDist) {
      const unitText = unitValue === 'miles' ? 'miles' : 'km';
      const row = `
        <tr>
          <td>Week ${weekNumber}</td>
          <td><a href="#rest">Rest or Crosstrain</a></td>
          <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${medDist} ${unitText}</td>
          <td><a href="#easy">Easy</a> - ${easyDist} ${unitText}</td>
          <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${speedDist} ${unitText}</td>
          <td><a href="#rest">Rest or Crosstrain</a></td>
          <td><a href="#easy">Easy</a> - ${easyDist} ${unitText}</td>
          <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${longDist} ${unitText}</td>
          <td>${(parseFloat(easyDist * 2) + parseFloat(medDist) + parseFloat(speedDist) + parseFloat(longDist)).toFixed(2)} ${unitText}</td>
        </tr>
      `;
      return row;
    }

    function handleTaperWeeks(taperWeeks, startWeekNumber) {
      let taperHtml = '';
      taperWeeks.forEach((week, index) => {
        const weekNumber = startWeekNumber + index;
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

      const trainingWeeks = totalWeeks - taperWeeksCount - 1;

      for (let week = 1; week <= trainingWeeks; week++) {
        const easyDist = getIncreasingNumberBetween(minEasyRunDist, maxEasyRunDist, week, totalWeeks);
        const medDist = getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, week, totalWeeks);
        const speedDist = getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, week, totalWeeks);
        const longDist = getIncreasingNumberBetween(minLongRunDist, maxLongRunDist, week, totalWeeks);
        planHtml += createWeekRow(week, easyDist, medDist, speedDist, longDist);
      }

      const taperWeeks = [
        { mediumRunDistance: getIncreasingNumberBetween(7, 10, 1, 3), speedRunDistance: getIncreasingNumberBetween(4, 8, 1, 3), easyRunDistance: 12, longRunDistance: 22 },
        { mediumRunDistance: getIncreasingNumberBetween(7, 8, 2, 3), speedRunDistance: getIncreasingNumberBetween(4, 6, 2, 3), easyRunDistance: 10, longRunDistance: 20 },
        { mediumRunDistance: getIncreasingNumberBetween(7, 7, 3, 3), speedRunDistance: getIncreasingNumberBetween(4, 4, 3, 3), easyRunDistance: 10, longRunDistance: 16 }
      ];
      const taperWeeksHtml = handleTaperWeeks(taperWeeks, totalWeeks - taperWeeksCount - 1 + 1);

      planHtml += taperWeeksHtml;

      const raceWeekRow = `
        <tr>
          <td>Week ${totalWeeks}</td>
          <td><a href="#rest">Rest or Crosstrain</a></td>
          <td><a href="#easy">Easy</a> - 5 ${unitValue}</td>
          <td><a href="#rest">Rest or Crosstrain</a></td>
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

      document.getElementById('selectedWeeks').value = totalWeeks;

      addDownloadAndEmailButtons();
    }

    createPlan();
  }

  document.getElementById('generatePlan').addEventListener('click', generateRunToFinishPlan);
});
