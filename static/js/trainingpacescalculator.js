document.addEventListener('DOMContentLoaded', function() {
  const raceSelection = document.getElementById('raceSelection');
  const distanceUnit = document.getElementById('distanceUnit');
  const calculateButton = document.getElementById('calculateButton');

  if (raceSelection) {
    raceSelection.addEventListener('change', function() {
      toggleCustomDistance();
      updateYassoLabel();
    });
  }

  if (distanceUnit) {
    distanceUnit.addEventListener('change', updateYassoLabel);
  }

  if (calculateButton) {
    calculateButton.addEventListener('click', calculatePaces);
  }
});

function toggleCustomDistance() {
  const raceSelection = document.getElementById('raceSelection');
  const customDistanceInput = document.getElementById('customDistanceInput');
  if (raceSelection && customDistanceInput) {
    customDistanceInput.style.display = raceSelection.value === 'custom' ? 'block' : 'none';
  }
}

function updateYassoLabel() {
  const raceSelection = document.getElementById('raceSelection');
  const customDistance = document.getElementById('customDistance');
  const distanceUnit = document.getElementById('distanceUnit');
  const label800m = document.getElementById('label800m');

  if (raceSelection && customDistance && distanceUnit && label800m) {
    const isMarathon = raceSelection.value === '42.195' || 
                       (raceSelection.value === 'custom' &&
                        parseFloat(customDistance.value) === 42.195 &&
                        !distanceUnit.checked);
    label800m.innerText = isMarathon ? 'Yasso 800s' : '800m';
  }
}

function calculatePaces() {
  const raceSelection = document.getElementById('raceSelection');
  const customDistanceElem = document.getElementById('customDistance');
  const distanceUnit = document.getElementById('distanceUnit');
  const goalTimeElem = document.getElementById('goalTime');

  if (!raceSelection || !customDistanceElem || !distanceUnit || !goalTimeElem) {
    console.error('One or more required elements are missing');
    return null;
  }

  let raceDistance = raceSelection.value;
  const customDistance = parseFloat(customDistanceElem.value);
  const isCustom = raceDistance === 'custom';
  let raceName = isCustom ? (distanceUnit.checked ? customDistance + " miles" : customDistance + " km") : document.querySelector('#raceSelection option:checked').text;

  if (isCustom && distanceUnit.checked) {
    raceDistance = customDistance * 1.60934; // Convert miles to kilometers if custom and miles selected
  } else if (isCustom) {
    raceDistance = customDistance; // Use custom kilometers directly
  }

  const goalTime = goalTimeElem.value;
  const timeParts = goalTime.split(':');
  const totalSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);

  const pacePerKm = totalSeconds / raceDistance;
  const pacePerMile = totalSeconds / (raceDistance / 1.60934); // Correct pace per mile

  const paces = {
    racePaceKm: pacePerKm,
    racePaceMile: pacePerMile,
    recoveryPaceKm: pacePerKm + 60 / 1.60934,
    recoveryPaceMile: pacePerMile + 60,
    progressionPaceKm: pacePerKm * 0.95,
    progressionPaceMile: pacePerMile * 0.95,
    fartlekPaceKm: pacePerKm * 0.85,
    fartlekPaceMile: pacePerMile * 0.85,
    pace400m: pacePerKm * 0.4,
    pace600m: pacePerKm * 0.6,
    pace800m: pacePerKm * 0.8,
    pace1200m: pacePerKm * 1.2
  };

  displayResults(paces, raceName, goalTime);
  displaySpeedWork(paces);
  
  return paces; // Return the calculated paces for use in other scripts
}

function displayResults(paces, raceName, goalTime) {
  document.getElementById('resultsHeader').innerText = `Training Paces for Running a ${raceName} in ${goalTime}`;
  document.getElementById('resultsContainer').style.display = 'block';

  const updateText = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerText = text;
    } else {
      console.error(`Element with ID ${id} not found.`);
    }
  };

  updateText('racePaceKm', formatPace(paces.racePaceKm));
  updateText('racePaceMile', formatPace(paces.racePaceMile));
  updateText('recoveryPaceKm', formatPace(paces.recoveryPaceKm));
  updateText('recoveryPaceMile', formatPace(paces.recoveryPaceMile));
  updateText('progressionPaceKm', formatPace(paces.progressionPaceKm));
  updateText('progressionPaceMile', formatPace(paces.progressionPaceMile));
  updateText('fartlekPaceKm', formatPace(paces.fartlekPaceKm));
  updateText('fartlekPaceMile', formatPace(paces.fartlekPaceMile));
}

function displaySpeedWork(paces) {
  document.getElementById('time400m').innerText = formatPace(paces.pace400m);
  document.getElementById('time600m').innerText = formatPace(paces.pace600m);
  document.getElementById('time800m').innerText = formatPace(paces.pace800m);
  document.getElementById('time1200m').innerText = formatPace(paces.pace1200m);
}

function formatPace(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemain = Math.round(seconds % 60);
  return `${minutes}m ${secondsRemain}s`;
}

// Make calculatePaces globally available
window.calculateTrainingPaces = calculatePaces;
