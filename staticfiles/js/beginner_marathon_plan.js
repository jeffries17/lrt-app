document.addEventListener('DOMContentLoaded', function() {
    const weeksInput = document.getElementById('weeks');
    const unitSelect = document.getElementById('unit');
    const trainingPlanOutput = document.getElementById('trainingPlanOutput');
  
    function convertToMiles(km) {
      return km * 0.621371;
    }
  
    function convertToKilometers(miles) {
      return miles / 0.621371;
    }
  
    function generateRunToFinishPlan() {
      const numberOfWeeksToTrain = parseInt(weeksInput.value);
      const unitValue = unitSelect.value;
  
      let minEasyRunDist = 3, maxEasyRunDist = 6, minLongRunDist = 6, maxLongRunDist = 20, taperWeeksCount = 3;
  
      function getIncreasingNumberBetween(min, max, week, totalWeeks) {
        const difference = max - min;
        const increment = difference / (totalWeeks - taperWeeksCount - 1);
        let distance = min + increment * (week - 1);
        if (unitValue === 'km') {
          distance = convertToKilometers(distance);
        }
        return distance.toFixed(2);
      }
  
      function createWeekRow(weekNumber, easyDist, longDist) {
        const unitText = unitValue === 'miles' ? 'miles' : 'km';
        const row = `
          <tr>
            <td>Week ${weekNumber}</td>
            <td><a href="#easy">Easy</a> - ${easyDist} ${unitText}</td>
            <td>Rest</td>
            <td><a href="#easy">Easy</a> - ${easyDist} ${unitText}</td>
            <td>Rest</td>
            <td><a href="#easy">Easy</a> - ${easyDist} ${unitText}</td>
            <td><a href="#long">Long Run</a> - ${longDist} ${unitText}</td>
            <td>${(parseFloat(easyDist * 3) + parseFloat(longDist)).toFixed(2)} ${unitText}</td>
          </tr>
        `;
        return row;
      }
  
      function handleTaperWeeks(taperWeeks, startWeekNumber) {
        let taperHtml = '';
        taperWeeks.forEach((week, index) => {
          const weekNumber = startWeekNumber + index;
          const unitText = unitValue === 'miles' ? 'miles' : 'km';
          taperHtml += `
            <tr>
              <td>Taper Week ${weekNumber}</td>
              <td><a href="#easy">Easy</a> - ${week.easyRunDistance} ${unitText}</td>
              <td>Rest</td>
              <td><a href="#easy">Easy</a> - ${week.easyRunDistance} ${unitText}</td>
              <td>Rest</td>
              <td><a href="#easy">Easy</a> - ${week.easyRunDistance} ${unitText}</td>
              <td><a href="#long">Long Run</a> - ${week.longRunDistance} ${unitText}</td>
              <td>${(parseFloat(week.easyRunDistance * 3) + parseFloat(week.longRunDistance)).toFixed(2)} ${unitText}</td>
            </tr>
          `;
        });
        return taperHtml;
      }
  
      function createPlan() {
        let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Total Mileage</th></tr></thead><tbody>';
        const totalWeeks = numberOfWeeksToTrain;
  
        const trainingWeeks = totalWeeks - taperWeeksCount - 1;
  
        for (let week = 1; week <= trainingWeeks; week++) {
          const easyDist = getIncreasingNumberBetween(minEasyRunDist, maxEasyRunDist, week, totalWeeks);
          const longDist = getIncreasingNumberBetween(minLongRunDist, maxLongRunDist, week, totalWeeks);
          planHtml += createWeekRow(week, easyDist, longDist);
        }
  
        const taperWeeks = [
          { easyRunDistance: getIncreasingNumberBetween(3, 4, 1, 3), longRunDistance: 15 },
          { easyRunDistance: getIncreasingNumberBetween(3, 3, 2, 3), longRunDistance: 10 },
          { easyRunDistance: getIncreasingNumberBetween(3, 2, 3, 3), longRunDistance: 5 }
        ];
        const taperWeeksHtml = handleTaperWeeks(taperWeeks, totalWeeks - taperWeeksCount - 1 + 1);
  
        planHtml += taperWeeksHtml;
  
        const raceWeekRow = `
          <tr>
            <td>Week ${totalWeeks}</td>
            <td><a href="#easy">Easy</a> - 3 ${unitValue}</td>
            <td>Rest</td>
            <td><a href="#easy">Easy</a> - 2 ${unitValue}</td>
            <td>Rest</td>
            <td>Rest</td>
            <td>Race Day!</td>
            <td>5 ${unitValue}</td>
          </tr>
        `;
        planHtml += raceWeekRow;
        planHtml += '</tbody></table>';
        trainingPlanOutput.innerHTML = planHtml;
  
        document.getElementById('selectedDistance').value = 'marathon';
        document.getElementById('selectedWeeks').value = totalWeeks;
  
        addDownloadAndEmailButtons();
      }
  
      createPlan();
    }
  
    document.getElementById('generatePlan').addEventListener('click', generateRunToFinishPlan);
  });
  