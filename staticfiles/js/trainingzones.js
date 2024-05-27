document.getElementById('hrZoneCalculator').addEventListener('submit', function(event) {
  event.preventDefault();
  const age = parseInt(document.getElementById('age').value);
  let maxHR = document.getElementById('maxHR').value ? parseInt(document.getElementById('maxHR').value) : 220 - age;
  let restHR = document.getElementById('restHR').value ? parseInt(document.getElementById('restHR').value) : 60;

  const zones = calculateHRZones(maxHR, restHR);
  displayResults(zones);
});

function calculateHRZones(maxHR, restHR) {
  return [
      { zone: 1, name: 'Recovery', intensity: `50-60%`, hr: `${Math.round(restHR + (maxHR - restHR) * 0.5)}-${Math.round(restHR + (maxHR - restHR) * 0.6)}` },
      { zone: 2, name: 'Endurance', intensity: `60-70%`, hr: `${Math.round(restHR + (maxHR - restHR) * 0.6)}-${Math.round(restHR + (maxHR - restHR) * 0.7)}` },
      { zone: 3, name: 'Aerobic', intensity: `70-80%`, hr: `${Math.round(restHR + (maxHR - restHR) * 0.7)}-${Math.round(restHR + (maxHR - restHR) * 0.8)}` },
      { zone: 4, name: 'Anaerobic', intensity: `80-90%`, hr: `${Math.round(restHR + (maxHR - restHR) * 0.8)}-${Math.round(restHR + (maxHR - restHR) * 0.9)}` },
      { zone: 5, name: 'VO2 max', intensity: `90-100%`, hr: `${Math.round(restHR + (maxHR - restHR) * 0.9)}-${Math.round(restHR + (maxHR - restHR) * 1.0)}` }
  ];
}

function displayResults(zones) {
  const resultsContainer = document.getElementById('resultsContainer');
  const resultCard = document.createElement('div');
  resultCard.className = 'card mt-3';
  resultCard.innerHTML = `
    <div class="card-header">Your Heart Rate Zones</div>
    <div class="card-body">
      ${zones.map(zone => `<p>Zone ${zone.zone}: <strong>${zone.name}</strong> (${zone.intensity}) - HR: ${zone.hr} bpm</p>`).join('')}
    </div>
  `;
  resultsContainer.innerHTML = ''; // Clear previous results
  resultsContainer.appendChild(resultCard);
}
