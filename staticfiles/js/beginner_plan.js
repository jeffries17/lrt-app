document.addEventListener('DOMContentLoaded', function() {
    const trainingDaysSelect = document.getElementById('trainingDays');
    const trainingWeeksSelect = document.getElementById('trainingWeeks');
    const unitSelect = document.getElementById('unit');
    const trainingPlanOutput = document.getElementById('planOutput');

    function convertToMiles(km) {
        return km * 0.621371;
    }

    function convertToKilometers(miles) {
        return miles / 0.621371;
    }

    function roundDistance(distance, unit) {
        if (unit === 'miles') {
            return (Math.round(distance * 2) / 2).toFixed(1);  // Round to nearest 0.5
        } else {
            return Math.round(distance).toFixed(0);  // Round to nearest whole number
        }
    }

    function generatePlan(planType) {
        const trainingDays = parseInt(trainingDaysSelect.value);
        const numberOfWeeksToTrain = parseInt(trainingWeeksSelect.value);
        const unit = unitSelect.value;
        let minEasyRunDist, maxEasyRunDist, minLongRunDist, maxLongRunDist, taperWeeksCount;

        if (planType === 'half-marathon') {
            minEasyRunDist = unit === 'miles' ? 3 : convertToKilometers(3);
            maxEasyRunDist = unit === 'miles' ? 5 : convertToKilometers(5);
            minLongRunDist = unit === 'miles' ? 6 : convertToKilometers(6);
            maxLongRunDist = unit === 'miles' ? 12 : convertToKilometers(12);
            taperWeeksCount = 2;
        } else if (planType === 'marathon') {
            minEasyRunDist = unit === 'miles' ? 3 : convertToKilometers(3);
            maxEasyRunDist = unit === 'miles' ? 8 : convertToKilometers(8);
            minLongRunDist = unit === 'miles' ? 6 : convertToKilometers(6);
            maxLongRunDist = unit === 'miles' ? 20 : convertToKilometers(20);
            taperWeeksCount = 3;
        }

        function getIncreasingNumberBetween(min, max, week, totalWeeks) {
            const difference = max - min;
            const increment = difference / totalWeeks;
            let distance = min + increment * week;
            return roundDistance(distance, unit);
        }

        function createWeekRow(weekNumber, easyDist, longDist) {
            let row = `<tr><td>Week ${weekNumber}</td>`;
            if (trainingDays === 3) {
                row += `
                    <td>Rest or Crosstrain</td>
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Rest or Crosstrain</td>
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Rest</td>
                    <td>Long Run - ${longDist} ${unit}</td>
                    <td>Rest</td>
                `;
            } else if (trainingDays === 4) {
                row += `
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Rest or Crosstrain</td>
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Rest</td>
                    <td>Long Run - ${longDist} ${unit}</td>
                    <td>Rest</td>
                `;
            } else if (trainingDays === 5) {
                row += `
                    <td>Rest or Crosstrain</td>
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Rest or Crosstrain</td>
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Rest</td>
                    <td>Easy Run - ${easyDist} ${unit}</td>
                    <td>Long Run - ${longDist} ${unit}</td>
                `;
            }
            row += `<td>${(parseFloat(easyDist) * (trainingDays - 1) + parseFloat(longDist)).toFixed(2)} ${unit}</td></tr>`;
            return row;
        }

        function handleTaperWeeks(startWeekNumber, totalWeeks) {
            let taperHtml = '';
            for (let week = startWeekNumber; week <= totalWeeks - 1; week++) {
                const taperFactor = (totalWeeks - week) / taperWeeksCount;
                const taperEasyDist = roundDistance(minEasyRunDist * taperFactor, unit);
                const taperLongDist = roundDistance(maxLongRunDist * taperFactor, unit);
                taperHtml += createWeekRow(week, taperEasyDist, taperLongDist);
            }
            return taperHtml;
        }

        function createPlan() {
            let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th><th>Total Mileage</th></tr></thead><tbody>';
            for (let week = 1; week <= numberOfWeeksToTrain - taperWeeksCount - 1; week++) {
                const easyDist = getIncreasingNumberBetween(minEasyRunDist, maxEasyRunDist, week, numberOfWeeksToTrain - taperWeeksCount - 1);
                const longDist = getIncreasingNumberBetween(minLongRunDist, maxLongRunDist, week, numberOfWeeksToTrain - taperWeeksCount - 1);
                planHtml += createWeekRow(week, easyDist, longDist);
            }

            planHtml += handleTaperWeeks(numberOfWeeksToTrain - taperWeeksCount, numberOfWeeksToTrain);

            // Add race week
            const raceDistance = unit === 'miles' ? (planType === 'half-marathon' ? 13.1 : 26.2) : (planType === 'half-marathon' ? 21.1 : 42.2);
            const raceWeekRow = `
                <tr>
                    <td>Week ${numberOfWeeksToTrain}</td>
                    <td>Rest or Crosstrain</td>
                    <td>Easy Run - ${roundDistance(3, unit)} ${unit}</td>
                    <td>Rest or Crosstrain</td>
                    <td>Easy Run - ${roundDistance(2, unit)} ${unit}</td>
                    <td>Rest</td>
                    <td>Race Day - ${roundDistance(raceDistance, unit)} ${unit}</td>
                    <td>Rest</td>
                    <td>${(3 + 2 + raceDistance).toFixed(2)} ${unit}</td>
                </tr>
            `;
            planHtml += raceWeekRow;

            planHtml += '</tbody></table>';
            trainingPlanOutput.innerHTML = planHtml;
            addDownloadAndEmailButtons(trainingPlanOutput);
        }

        createPlan();
    }

    document.getElementById('generatePlan').addEventListener('click', function() {
        const planType = document.getElementById('planType').value;
        generatePlan(planType);
    });
});
