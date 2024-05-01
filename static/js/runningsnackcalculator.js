function updateAidStations() {
  var aidStations = document.getElementById("aidStations").value;
  var container = document.getElementById("aidStationDetails");
  container.innerHTML = ''; // Clear previous inputs

  for (let i = 1; i <= aidStations; i++) {
      let card = document.createElement('div');
      card.className = 'col-md-4 mb-3';
      card.innerHTML = `
          <div class="card">
              <div class="card-body">
                  <label for="station${i}">Aid Station ${i} Distance (${document.getElementById("unit").value}):</label>
                  <input type="number" class="form-control" id="station${i}" required>
              </div>
          </div>`;
      container.appendChild(card);
  }
}

function calculateSnacks() {
  var unit = document.getElementById("unit").value;
  var raceLength = parseFloat(document.getElementById("raceLength").value);
  var finishTime = parseFloat(document.getElementById("finishTime").value);
  var aidStations = parseInt(document.getElementById("aidStations").value);
  var resultContainer = document.getElementById("result");
  resultContainer.innerHTML = ""; // Clear previous results

  var row = document.createElement('div');
  row.className = 'row';
  resultContainer.appendChild(row);

  var previousStationDistance = 0;

  for (let i = 1; i <= aidStations; i++) {
      var currentStationDistance = parseFloat(document.getElementById(`station${i}`).value);
      var segmentDistance = currentStationDistance - previousStationDistance;
      var timeForSegment = (segmentDistance / raceLength) * finishTime;
      var caloriesBurned = timeForSegment * 250;

      var bananasNeeded = Math.ceil(caloriesBurned / 89);
      var cookiesNeeded = Math.ceil(caloriesBurned / 100);
      var watermelonNeeded = Math.ceil(caloriesBurned / 60);
      var trailMixNeeded = Math.ceil(caloriesBurned / 140);
      var picklesNeeded = Math.ceil(caloriesBurned / 5);

      let card = document.createElement('div');
      card.className = 'col-md-4'; // This ensures 3 cards per row
      card.innerHTML = `
          <div class="card mt-3">
              <div class="card-header">Aid Station ${i} (Distance: ${currentStationDistance} ${unit})</div>
              <div class="card-body">
                  <h6 class="card-subtitle mb-2 text-muted">Time Elapsed: ${timeForSegment.toFixed(2)} hours, Calories Burned: ${caloriesBurned.toFixed(0)}</h6>
                  <div>
                      <p><strong>Bananas:</strong> ${Array(bananasNeeded).fill(`<img src="${staticBaseUrl}images/banana.png" alt="Banana" style="width: 30px;">`).join('')}</p>
                      <p><strong>Cookies:</strong> ${Array(cookiesNeeded).fill(`<img src="${staticBaseUrl}images/cookie.png" alt="Cookie" style="width: 30px;">`).join('')}</p>
                      <p><strong>Watermelon slices:</strong> ${Array(watermelonNeeded).fill(`<img src="${staticBaseUrl}images/watermelon.png" alt="Watermelon" style="width: 30px;">`).join('')}</p>
                      <p><strong>Trail Mix (servings):</strong> ${Array(trailMixNeeded).fill(`<img src="${staticBaseUrl}images/trailmix.png" alt="Trail Mix" style="width: 30px;">`).join('')}</p>
                      <p><strong>Pickles(servings):</strong> ${Array(picklesNeeded).fill(`<img src="${staticBaseUrl}images/pickle.png" alt="Pickle" style="width: 30px;">`).join('')}</p>
                  </div>
              </div>
          </div>`;
      row.appendChild(card);

      previousStationDistance = currentStationDistance; // Update previous station distance
  }
}


document.addEventListener("DOMContentLoaded", function() {
  // This ensures that the updateAidStations function is available after the page is fully loaded
  document.getElementById("aidStations").addEventListener("input", updateAidStations);
});
