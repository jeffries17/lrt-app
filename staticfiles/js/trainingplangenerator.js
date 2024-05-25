document.addEventListener('DOMContentLoaded', function() {
  const distanceSelect = document.getElementById('distance');
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
    const distanceValue = distanceSelect.value;
    const unitValue = unitSelect.value;
    const numberOfWeeksToTrain = parseInt(weeksInput.value);

    let minEasyRunDist, maxEasyRunDist, minMedRunDist, maxMedRunDist, minSpeedRunDist, maxSpeedRunDist, minLongRunDist, maxLongRunDist, taperWeeksCount = 0;

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
        break;
      case "marathon":
        minEasyRunDist = 8; maxEasyRunDist = 16;
        minMedRunDist = 7; maxMedRunDist = 13;
        minSpeedRunDist = 7; maxSpeedRunDist = 10;
        minLongRunDist = 12; maxLongRunDist = 35;
        taperWeeksCount = 3;
        break;
    }

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
          <td>${(parseFloat(easyDist*2) + parseFloat(medDist) + parseFloat(speedDist) + parseFloat(longDist)).toFixed(2)}${unitValue}</td>
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
            <td>Week ${weekNumber}</td>
            <td><a href="#rest">Rest or Crosstrain</a></td>
            <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${week.mediumRunDistance}${unitValue}</td>
            <td><a href="#easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
            <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${week.speedRunDistance}${unitValue}</td>
            <td><a href="#rest">Rest or Crosstrain</a></td>
            <td><a href="#easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
            <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${week.longRunDistance}${unitValue}</td>
            <td>${(parseFloat(week.easyRunDistance*2) + parseFloat(week.mediumRunDistance) + parseFloat(week.speedRunDistance) + parseFloat(week.longRunDistance)).toFixed(2)}${unitValue}</td>
          </tr>
        `;
      });
      return taperHtml;
    }

    function createPlan() {
      let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th><th>Total Mileage</th></tr></thead><tbody>';
      for (let week = 1; week <= numberOfWeeksToTrain - taperWeeksCount; week++) {
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
          <td>${(5 + 3).toFixed(2)}${unitValue}</td>
        </tr>
      `;
      planHtml += raceWeekRow;
      planHtml += '</tbody></table>';
      trainingPlanOutput.innerHTML = planHtml;

      // Update hidden fields
      document.getElementById('selectedDistance').value = distanceValue;
      document.getElementById('selectedWeeks').value = totalWeeks;

      addDownloadAndEmailButtons();
    }

    createPlan();
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  function savePlan() {
    const planHtml = document.getElementById('trainingPlanOutput').innerHTML;
    const distance = document.getElementById('selectedDistance').value;
    const weeks = document.getElementById('selectedWeeks').value;

    fetch('/generate_pdf/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            plan_html: planHtml,
            distance: distance,
            weeks: weeks
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'training_plan.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error:', error));
  }

  function sendPlanViaEmail() {
    const planHtml = document.getElementById('trainingPlanOutput').innerHTML;
    const distance = document.getElementById('selectedDistance').value;
    const weeks = document.getElementById('selectedWeeks').value;
    const email = prompt("Please enter your email address:");

    if (email) {
        fetch('/generate_pdf/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                plan_html: planHtml,
                distance: distance,
                weeks: weeks,
                email: email
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Plan sent to ' + email + ' successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
  }

  function addDownloadAndEmailButtons() {
    const existingDownloadButton = document.getElementById('downloadButton');
    if (existingDownloadButton) {
        existingDownloadButton.remove();
    }

    const existingEmailButton = document.getElementById('emailButton');
    if (existingEmailButton) {
        existingEmailButton.remove();
    }

    const downloadButton = document.createElement('button');
    downloadButton.id = 'downloadButton';
    downloadButton.type = 'button';
    downloadButton.className = 'btn btn-success mt-3';
    downloadButton.innerText = 'Download Plan as PDF';
    downloadButton.onclick = savePlan;

    const emailButton = document.createElement('button');
    emailButton.id = 'emailButton';
    emailButton.type = 'button';
    emailButton.className = 'btn btn-primary mt-3 ml-3';
    emailButton.innerText = 'Send Plan via Email';
    emailButton.onclick = sendPlanViaEmail;

    document.getElementById('trainingPlanOutput').insertAdjacentElement('afterend', downloadButton);
    downloadButton.insertAdjacentElement('afterend', emailButton);
  }

  window.generateRunToFinishPlan = generateRunToFinishPlan;
  window.savePlan = savePlan;
  window.sendPlanViaEmail = sendPlanViaEmail;
});