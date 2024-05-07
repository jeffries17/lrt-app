document.getElementById('generatePlan').addEventListener('click', function() {
  const days = parseInt(document.getElementById('trainingDays').value);
  generateTrainingPlan(days);
});

function generateTrainingPlan(days) {
  const weeks = 16;
  const plan = createPlan(days, weeks);

  displayPlan(plan, weeks, days);
}

function createPlan(days, weeks) {
  // Example data, in practice this should be more dynamic and probably based on user fitness level or goals.
  const runTypes = [
      ['Long Run', 'Tempo Run', 'Easy Jog'],
      ['Long Run', 'Tempo Run', 'Speed Work', 'Easy Jog'],
      ['Long Run', 'Tempo Run', 'Speed Work', 'Hill Repeats', 'Easy Jog'],
      ['Long Run', 'Tempo Run', 'Speed Work', 'Hill Repeats', 'Recovery Run', 'Easy Jog']
  ];

  const selectedRuns = runTypes[days - 3]; // Since the index should start from 0 for 3 days.
  let weeklyPlan = [];

  for (let week = 0; week < weeks; week++) {
      let weekRuns = [];
      for (let day = 0; day < days; day++) {
          weekRuns.push(selectedRuns[day % selectedRuns.length]);
      }
      weeklyPlan.push(weekRuns);
  }

  return weeklyPlan;
}

function displayPlan(plan, weeks, days) {
  const output = document.getElementById('planOutput');
  let tableHtml = '<table class="table table-striped"><thead><tr><th>Week</th>';

  for (let i = 1; i <= days; i++) {
      tableHtml += `<th>Day ${i}</th>`;
  }
  tableHtml += '</tr></thead><tbody>';

  for (let week = 0; week < weeks; week++) {
      tableHtml += `<tr><td>Week ${week + 1}</td>`;
      for (let day = 0; day < days; day++) {
          tableHtml += `<td>${plan[week][day]}</td>`;
      }
      tableHtml += '</tr>';
  }

  tableHtml += '</tbody></table>';
  output.innerHTML = tableHtml;
}
