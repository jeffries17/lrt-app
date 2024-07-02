// base_building_plan.js

document.addEventListener('DOMContentLoaded', function() {
  const generatePlanButton = document.getElementById('generatePlan');
  generatePlanButton.addEventListener('click', generateBaseBuildingPlan);
});

function generateBaseBuildingPlan() {
  const startingMileage = parseInt(document.getElementById('startingMileage').value);
  const unit = document.getElementById('unit').value;
  const weeks = 12;
  const totalIncrease = unit === 'miles' ? 25 : 40; // 25 miles or 40 km

  if (isNaN(startingMileage) || startingMileage < 0) {
      alert('Please enter a valid starting mileage.');
      return;
  }

  const weeklyIncrease = totalIncrease / weeks;
  let plan = [];

  for (let week = 1; week <= weeks; week++) {
      const weeklyMileage = Math.round((startingMileage + weeklyIncrease * week) * 10) / 10;
      const longRunDistance = Math.round(weeklyMileage * 0.3 * 10) / 10;
      const easyRunDistance = Math.round((weeklyMileage - longRunDistance) / 4 * 10) / 10;

      plan.push({
          week: week,
          total: weeklyMileage,
          schedule: [
              { day: 'Monday', activity: `Easy Run: ${easyRunDistance} ${unit}` },
              { day: 'Tuesday', activity: `Easy Run: ${easyRunDistance} ${unit}` },
              { day: 'Wednesday', activity: 'Cross-Training or Rest' },
              { day: 'Thursday', activity: `Easy Run: ${easyRunDistance} ${unit}` },
              { day: 'Friday', activity: 'Rest' },
              { day: 'Saturday', activity: `Long Run: ${longRunDistance} ${unit}` },
              { day: 'Sunday', activity: `Easy Run: ${easyRunDistance} ${unit} or Cross-Training` }
          ]
      });
  }

  displayPlan(plan, unit);
}

function displayPlan(plan, unit) {
  let html = '<table class="table table-striped">';
  html += '<thead><tr><th>Week</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th><th>Sunday</th><th>Total</th></tr></thead>';
  html += '<tbody>';

  plan.forEach(week => {
      html += `<tr>
          <td>Week ${week.week}</td>
          ${week.schedule.map(day => `<td>${day.activity}</td>`).join('')}
          <td>${week.total} ${unit}</td>
      </tr>`;
  });

  html += '</tbody></table>';

  document.getElementById('trainingPlanOutput').innerHTML = html;
  addDownloadAndEmailButtons();
}

// The following line ensures that the shared functions are available
window.generateBaseBuildingPlan = generateBaseBuildingPlan;