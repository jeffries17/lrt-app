document.addEventListener('DOMContentLoaded', function () {
  const calculateButton = document.getElementById('calculateButton');
  if (calculateButton) {
    calculateButton.addEventListener('click', calculateCalories);
  } else {
    console.error("Calculate button not found.");
  }

  function calculateCalories() {
    console.log("Button clicked, starting calculation...");
    const weight = parseFloat(document.getElementById('weight').value);
    const weightUnit = document.querySelector('input[name="weightUnit"]:checked') ? document.querySelector('input[name="weightUnit"]:checked').value : 'kg';
    const distance = parseFloat(document.getElementById('distance').value);
    const distanceUnit = document.querySelector('input[name="distanceUnit"]:checked') ? document.querySelector('input[name="distanceUnit"]:checked').value : 'km';
    const durationHours = parseInt(document.getElementById('durationHours').value) || 0;
    const durationMinutes = parseInt(document.getElementById('durationMinutes').value) || 0;
    const durationSeconds = parseInt(document.getElementById('durationSeconds').value) || 0;
    const elevation = parseFloat(document.getElementById('elevation').value) || 0;
    const elevationUnit = document.querySelector('input[name="elevationUnit"]:checked') ? document.querySelector('input[name="elevationUnit"]:checked').value : 'meters';

    const weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const distanceInKm = distanceUnit === 'miles' ? distance * 1.60934 : distance;
    const durationInHours = durationHours + (durationMinutes / 60) + (durationSeconds / 3600);
    const elevationInMeters = elevationUnit === 'feet' ? elevation * 0.3048 : elevation;

    let gradePercentage = 0;
    if (distanceInKm > 0 && elevationInMeters > 0) {
      gradePercentage = (elevationInMeters / (distanceInKm * 1000)) * 100;
    }

    const flatMet = 9.8;
    const elevationAdjustment = gradePercentage * 0.1;
    const totalMet = flatMet + elevationAdjustment;

    const caloriesBurned = totalMet * weightInKg * durationInHours;

    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
      const resultElement = document.createElement('div');
      resultElement.className = 'card mt-3';
      resultElement.innerHTML = `
        <div class="card-header">Estimated Calories Burned</div>
        <div class="card-body">
          <p>${caloriesBurned.toFixed(2)} calories</p>
        </div>
      `;

      resultsContainer.innerHTML = ''; // Clear previous results
      resultsContainer.appendChild(resultElement);
    } else {
      console.error("Results container not found.");
    }
  }
});
