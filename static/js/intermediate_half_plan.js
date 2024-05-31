document.addEventListener('DOMContentLoaded', function() {
    const weeksInput = document.getElementById('trainingWeeks');
    const unitSelect = document.getElementById('unit');
    const trainingPlanOutput = document.getElementById('trainingPlanOutput');

    // Adding hidden fields to store selected values
    let hiddenFields = `
        <input type="hidden" id="selectedDistance" value="half-marathon">
        <input type="hidden" id="selectedWeeks" value="">
    `;
    document.body.insertAdjacentHTML('beforeend', hiddenFields);

    const mediumRunSessions = [
        "Fartlek",
        "Tempo",
        "Progression",
        "Long Intervals",
        "Threshold",
    ];

    const speedRunSessions = [
        "100m Intervals",
        "400m Intervals",
        "800m Intervals",
        "Hill Repeats",
    ];

    const longRunSessions = [
        "Long Run", 
    ];

    function convertToMiles(km) {
        return km * 0.621371;
    }

    function convertToKilometers(miles) {
        return miles / 0.621371;
    }

    function getRandomSession(sessions) {
        return sessions[Math.floor(Math.random() * sessions.length)];
    }

    function generateIntermediateHalfMarathonPlan() {
        const unitValue = unitSelect.value;
        const numberOfWeeksToTrain = parseInt(weeksInput.value);

        const minEasyRunDist = 7;
        const maxEasyRunDist = 12;
        const minMedRunDist = 6;
        const maxMedRunDist = 10;
        const minSpeedRunDist = 5;
        const maxSpeedRunDist = 10;
        const minLongRunDist = 10;
        const maxLongRunDist = 18;
        const taperWeeksCount = 2;

        function getIncreasingNumberBetween(min, max, week, totalWeeks) {
            const difference = max - min;
            const increment = difference / (totalWeeks - taperWeeksCount - 1);
            let distance = min + increment * (week - 1);
            if (unitValue === 'miles') {
                distance = convertToMiles(distance);
            }
            return distance.toFixed(2);
        }

        function createWeekRow(weekNumber, easyDist, medDist, speedDist, longDist) {
            return `
                <tr>
                    <td>Week ${weekNumber}</td>
                    <td><a href="#rest">Rest or Crosstrain</a></td>
                    <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${medDist}${unitValue}</td>
                    <td><a href="#easy">Easy</a> - ${easyDist}${unitValue}</td>
                    <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${speedDist}${unitValue}</td>
                    <td><a href="#rest">Rest or Crosstrain</a></td>
                    <td><a href="#easy">Easy</a> - ${easyDist}${unitValue}</td>
                    <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${longDist}${unitValue}</td>
                    <td>${(parseFloat(easyDist*2) + parseFloat(medDist) + parseFloat(speedDist) + parseFloat(longDist)).toFixed(2)}${unitValue}</td>
                </tr>
            `;
        }

        function handleTaperWeeks(taperWeeks, startWeekNumber) {
            let taperHtml = '';
            taperWeeks.forEach((week, index) => {
                const weekNumber = startWeekNumber + index;
                taperHtml += `
                    <tr>
                        <td>Taper Week ${weekNumber}</td>
                        <td><a href="#rest">Rest or Crosstrain</a></td>
                        <td><a href="#${getRandomSession(mediumRunSessions).toLowerCase()}">${getRandomSession(mediumRunSessions)}</a> - ${week.mediumRunDistance}${unitValue}</td>
                        <td><a href="#easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
                        <td><a href="#${getRandomSession(speedRunSessions).toLowerCase()}">${getRandomSession(speedRunSessions)}</a> - ${week.speedRunDistance}${unitValue}</td>
                        <td><a href="#rest">Rest or Crosstrain</a></td>
                        <td><a href="#easy">Easy</a> - ${week.easyRunDistance}${unitValue}</td>
                        <td><a href="#${getRandomSession(longRunSessions).toLowerCase()}">${getRandomSession(longRunSessions)}</a> - ${week.longRunDistance}${unitValue}</td>
                        <td>${(parseFloat(week.easyRunDistance*2) + parseFloat(week.mediumRunDistance) + parseFloat(week.speedRunDistance) + parseFloat(week.longRunDistance)).toFixed(2)}${unitValue}</td>
                    </tr>
                `;
            });
            return taperHtml;
        }

        function createPlan() {
            let planHtml = '<table class="table table-bordered"><thead><tr><th>Week</th><th>Day 1</th><th>Day 2</th><th>Day 3</th><th>Day 4</th><th>Day 5</th><th>Day 6</th><th>Day 7</th><th>Total Mileage</th></tr></thead><tbody>';
            const totalWeeks = numberOfWeeksToTrain;
            const trainingWeeks = totalWeeks - taperWeeksCount - 1;

            for (let week = 1; week <= trainingWeeks; week++) {
                const easyDist = getIncreasingNumberBetween(minEasyRunDist, maxEasyRunDist, week, totalWeeks);
                const medDist = getIncreasingNumberBetween(minMedRunDist, maxMedRunDist, week, totalWeeks);
                const speedDist = getIncreasingNumberBetween(minSpeedRunDist, maxSpeedRunDist, week, totalWeeks);
                const longDist = getIncreasingNumberBetween(minLongRunDist, maxLongRunDist, week, totalWeeks);
                planHtml += createWeekRow(week, easyDist, medDist, speedDist, longDist);
            }

            const taperWeeks = [
                { mediumRunDistance: getIncreasingNumberBetween(6, 7, 1, 2), speedRunDistance: getIncreasingNumberBetween(5, 7, 1, 2), easyRunDistance: 10, longRunDistance: 15 },
                { mediumRunDistance: getIncreasingNumberBetween(6, 7, 2, 2), speedRunDistance: getIncreasingNumberBetween(5, 7, 2, 2), easyRunDistance: 10, longRunDistance: 12 }
            ];
            planHtml += handleTaperWeeks(taperWeeks, totalWeeks - taperWeeksCount - 1 + 1);

            // Add race week
            const raceWeekRow = `
                <tr>
                    <td>Week ${totalWeeks}</td>
                    <td><a href="#rest">Rest or Crosstrain</a></td>
                    <td><a href="#easy">Easy</a> - 5${unitValue}</td>
                    <td><a href="#rest">Rest or Crosstrain</a></td>
                    <td>Rest</td>
                    <td><a href="#easy">Easy</a> - 3${unitValue}</td>
                    <td>Rest</td>
                    <td>Race Day!</td>
                    <td>${(5 + 3).toFixed(2)}${unitValue}</td>
                </tr>
            `;
            planHtml += raceWeekRow;
            planHtml += '</tbody></table>';
            trainingPlanOutput.innerHTML = planHtml;

            // Update hidden fields
            document.getElementById('selectedDistance').value = "half-marathon";
            document.getElementById('selectedWeeks').value = totalWeeks;

            addDownloadAndEmailButtons();
        }

        createPlan();
    }

    document.getElementById('generatePlan').addEventListener('click', generateIntermediateHalfMarathonPlan);
});
