document.addEventListener('DOMContentLoaded', function() {
  const paceMinutesSelect = document.getElementById('paceMinutes');
  const paceSecondsSelect = document.getElementById('paceSeconds');

  // Populate minutes dropdown
  for (let i = 3; i <= 25; i++) {
      let option = document.createElement('option');
      option.value = i;
      option.text = i;
      paceMinutesSelect.appendChild(option);
  }

  // Populate seconds dropdown
  for (let i = 0; i < 60; i++) {
      let option = document.createElement('option');
      option.value = i;
      option.text = i.toString().padStart(2, '0');
      paceSecondsSelect.appendChild(option);
  }
});

function calculateTimes() {
  const minutes = parseInt(document.getElementById('paceMinutes').value);
  const seconds = parseInt(document.getElementById('paceSeconds').value);
  const unit = document.getElementById('unit').value;
  const pacePerUnit = minutes * 60 + seconds; // total pace in seconds

  const distances = [1, 2, 3, 3.10686, 4, 5, 6.21371, 7, 8, 9, 10, 10.5, 13.1094, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26.2188, 27, 28, 29, 30, 31]; // Distances in miles with key race points
  let tableHTML = '';

  distances.forEach(distance => {
      const baseTime = pacePerUnit * distance;
      const rowHTML = `
          <tr>
              <td>${distance.toFixed(2)} ${unit}</td>
              <td>${formatTime(baseTime - 10 * distance)}</td>
              <td>${formatTime(baseTime - 5 * distance)}</td>
              <td>${formatTime(baseTime)}</td>
              <td>${formatTime(baseTime + 5 * distance)}</td>
              <td>${formatTime(baseTime + 10 * distance)}</td>
          </tr>
      `;
      tableHTML += rowHTML;
  });

  document.getElementById('resultsTable').innerHTML = tableHTML;
}

function formatTime(seconds) {
  seconds = Math.round(seconds); // Round to nearest whole number
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}