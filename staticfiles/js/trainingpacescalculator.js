document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('raceSelection').addEventListener('change', function() {
    toggleCustomDistance();
    updateYassoLabel();
  });
  document.getElementById('distanceUnit').addEventListener('change', updateYassoLabel);
  document.getElementById('calculateButton').addEventListener('click', calculatePaces);
});

function toggleCustomDistance() {
  const raceSelection = document.getElementById('raceSelection');
  const customDistanceInput = document.getElementById('customDistanceInput');
  customDistanceInput.style.display = raceSelection.value === 'custom' ? 'block' : 'none';
}

function updateYassoLabel() {
  const isMarathon = document.getElementById('raceSelection').value === '42.195' || 
                     (document.getElementById('raceSelection').value === 'custom' &&
                      parseFloat(document.getElementById('customDistance').value) === 42.195 &&
                      !document.getElementById('distanceUnit').checked); // Check if miles toggle is off
  document.getElementById('label800m').innerText = isMarathon ? 'Yasso 800s' : '800m';
}

function calculatePaces() {
  let raceDistance = document.getElementById('raceSelection').value;
  const customDistance = parseFloat(document.getElementById('customDistance').value);
  const isCustom = raceDistance === 'custom';
  let raceName = isCustom ? (document.getElementById('distanceUnit').checked ? customDistance + " miles" : customDistance + " km") : document.querySelector('#raceSelection option:checked').text;

  if (isCustom && document.getElementById('distanceUnit').checked) {
    raceDistance = customDistance * 1.60934; // Convert miles to kilometers if custom and miles selected
  } else if (isCustom) {
    raceDistance = customDistance; // Use custom kilometers directly
  }

  const goalTime = document.getElementById('goalTime').value;
  const timeParts = goalTime.split(':');
  const totalSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);

  const pacePerKm = totalSeconds / raceDistance;
  const pacePerMile = pacePerKm * 1.60934;

  displayResults(pacePerKm, pacePerMile, raceName, goalTime);
  displaySpeedWork(timeParts[0], timeParts[1], totalSeconds, raceDistance);
}

function displayResults(pacePerKm, pacePerMile, raceName, goalTime) {
  document.getElementById('resultsHeader').innerText = `Training Paces for Running a ${raceName} in ${goalTime}`;

  const updateText = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerText = text;
    } else {
      console.error(`Element with ID ${id} not found.`);
    }
    const marathonPaceSeconds = pacePerKm * (42.195 / 2); // Half-marathon pace
    displaySpeedWork(marathonPaceSeconds);
  };

  updateText('racePaceKm', formatPace(pacePerKm));
  updateText('racePaceMile', formatPace(pacePerMile));
  updateText('recoveryPaceKm', formatPace(pacePerKm + (90 /  1.60934)));
  updateText('recoveryPaceMile', formatPace(pacePerMile + 90));
  updateText('progressionPaceKm', formatPace(pacePerKm * 0.95));
  updateText('progressionPaceMile', formatPace(pacePerMile * 0.95));
  updateText('fartlekPaceKm', formatPace(pacePerKm * 0.85));
  updateText('fartlekPaceMile', formatPace(pacePerMile * 0.85));
}

function displaySpeedWork(hours, minutes, totalSeconds, raceDistance) {
  const isMarathon = raceDistance === 42.195; // Check if exactly marathon distance

  const pacePerMile = totalSeconds / (raceDistance / 1.60934); // Convert race distance to miles and calculate pace per mile
  const pace400m = formatPace(pacePerMile / 4); // 1/4 mile
  const pace600m = formatPace(pacePerMile * (600 / 1609)); // Convert to approximate fraction of a mile
  const pace800m = isMarathon ? `${hours}:${minutes}` : formatPace((totalSeconds / raceDistance) * (800 / 1000));
  const pace1200m = formatPace(pacePerMile * (1200 / 1609)); // Convert to approximate fraction of a mile

  document.getElementById('time400m').innerText = pace400m;
  document.getElementById('time600m').innerText = pace600m;
  document.getElementById('time800m').innerText = pace800m;
  document.getElementById('time1200m').innerText = pace1200m;
}

function formatPace(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemain = Math.round(seconds % 60);
  return `${minutes}m ${secondsRemain}s`;
}
