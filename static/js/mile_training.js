// Populate the minutes and seconds dropdowns
document.addEventListener('DOMContentLoaded', function() {
  const currentMinutes = document.getElementById('currentMinutes');
  const currentSeconds = document.getElementById('currentSeconds');

  for (let i = 0; i <= 20; i++) {
      let minuteOption = document.createElement('option');
      minuteOption.value = i;
      minuteOption.textContent = `${i} minutes`;
      currentMinutes.appendChild(minuteOption);
  }

  for (let i = 0; i < 60; i++) {
      let secondOption = document.createElement('option');
      secondOption.value = i;
      secondOption.textContent = `${i} seconds`;
      currentSeconds.appendChild(secondOption);
  }
});

document.getElementById('generatePlan').addEventListener('click', function() {
  const currentMinutes = parseInt(document.getElementById('currentMinutes').value);
  const currentSeconds = parseInt(document.getElementById('currentSeconds').value);
  const unit = document.getElementById('unit').value;

  const currentMileTime = (currentMinutes * 60) + currentSeconds;
  const goalMileTime = currentMileTime * 0.95; // 5% faster

  const goalMinutes = Math.floor(goalMileTime / 60);
  const goalSeconds = Math.round(goalMileTime % 60);

  const targetPace400 = goalMileTime / 4;
  const targetPace800 = goalMileTime / 2;
  const targetPace1200 = goalMileTime * 3 / 4;

  function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  const previousBestTime = `${currentMinutes} minutes and ${currentSeconds} seconds`;

  const planOutput = `
      <p>Your previous best mile time is: ${previousBestTime}</p>
      <p>Your goal mile time is: ${goalMinutes} minutes and ${goalSeconds} seconds</p>
      <p>Target paces:</p>
      <ul>
          <li>400m: ${formatTime(targetPace400)}</li>
          <li>800m: ${formatTime(targetPace800)}</li>
          <li>1200m: ${formatTime(targetPace1200)}</li>
      </ul>
      <div id="trainingPlan"></div>
  `;

  document.getElementById('planOutput').innerHTML = planOutput;

  const csvUrl = document.getElementById('planOutput').dataset.csvUrl;

  // Load the CSV data and populate the table
  fetch(csvUrl)
      .then(response => response.text())
      .then(csv => {
          const lines = csv.split('\n');
          const tableByPeriod = {
              'Preparation': {},
              'Build': {},
              'Peaking': {}
          };

          // Skip the header line
          lines.slice(1).forEach((line, index) => {
              const columns = line.split(',');
              if (columns.length === 5) {
                  const period = columns[0].trim();
                  const week = columns[1].trim();
                  const day = columns[2].trim();
                  let activity = columns[3].trim();
                  let details = columns[4];

                  if (details.includes('Pace')) {
                      details = details
                          .replace('3200 Pace', `3200 Pace: ${formatTime(targetPace1200)}`)
                          .replace('1600 Pace', `1600 Pace: ${formatTime(goalMileTime)}`)
                          .replace('800 Pace', `800 Pace: ${formatTime(targetPace800)}`)
                          .replace('400 Pace', `400 Pace: ${formatTime(targetPace400)}`);
                      details = `<span style="color:darkblue">Pace: ${details}</span>`;
                  }

                  if (!tableByPeriod[period][week]) {
                      tableByPeriod[period][week] = {
                          Sunday: '',
                          Monday: '',
                          Tuesday: '',
                          Wednesday: '',
                          Thursday: '',
                          Friday: '',
                          Saturday: ''
                      };
                  }
                  tableByPeriod[period][week][day] = `<strong>${activity}</strong><br>${details}`;
              }
          });

          const trainingPlanDiv = document.getElementById('trainingPlan');
          Object.keys(tableByPeriod).forEach((period, index, periodKeys) => {
              let periodHTML = `<div class="rounded-container"><h3>${period}</h3>`;

              Object.keys(tableByPeriod[period]).forEach(week => {
                  periodHTML += `
                      <h4>${week}</h4>
                      <table class="table">
                          <thead>
                              <tr>
                                  <th>Sunday</th>
                                  <th>Monday</th>
                                  <th>Tuesday</th>
                                  <th>Wednesday</th>
                                  <th>Thursday</th>
                                  <th>Friday</th>
                                  <th>Saturday</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>${tableByPeriod[period][week].Sunday}</td>
                                  <td>${tableByPeriod[period][week].Monday}</td>
                                  <td>${tableByPeriod[period][week].Tuesday}</td>
                                  <td>${tableByPeriod[period][week].Wednesday}</td>
                                  <td>${tableByPeriod[period][week].Thursday}</td>
                                  <td>${tableByPeriod[period][week].Friday}</td>
                                  <td>${tableByPeriod[period][week].Saturday}</td>
                              </tr>
                          </tbody>
                      </table>`;
              });

              periodHTML += '</div>';
              if (index < periodKeys.length - 1) {
                  periodHTML += '<hr style="border: 1px solid #ccc;">';
              }
              trainingPlanDiv.innerHTML += periodHTML;
          });
      })
      .catch(error => {
          console.error('Error loading CSV:', error);
      });
});
