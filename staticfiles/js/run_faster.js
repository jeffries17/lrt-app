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