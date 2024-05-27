// Function to calculate readiness for 'Running for Fun'
function calculateReadinessFun() {
    console.log("Starting calculation...");
  
    const raceDistance = parseFloat(document.getElementById('raceDistanceFun').value);
    const raceDate = new Date(document.getElementById('raceDateFun').value);
    const currentMileage = parseInt(document.getElementById('currentMileageFun').value);
  
    console.log("Race Distance:", raceDistance);
    console.log("Race Date:", raceDate);
    console.log("Current Mileage:", currentMileage);
  
    // Calculate weeks until race
    const today = new Date();
    const timeDiff = raceDate - today;
    const weeksUntilRace = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
    console.log("Weeks until race:", weeksUntilRace);
  
    // Recommendations based on current mileage
    let weeksNeeded = 0;
    if (currentMileage < 20) {
        weeksNeeded = 20;
    } else if (currentMileage >= 20 && currentMileage < 35) {
        weeksNeeded = 16;
    } else if (currentMileage >= 35) {
        weeksNeeded = 8;
    }
    console.log("Weeks needed:", weeksNeeded);
  
    // Generate result card
    let resultHeaderText = `Weeks until race: ${weeksUntilRace}`;
    let resultBodyText = `Based on your current weekly mileage of ${currentMileage} miles, `;
    if (weeksUntilRace >= weeksNeeded) {
        resultBodyText += "you have enough time to prepare for the marathon. Start training!";
    } else {
        resultBodyText += "you need more time to prepare. Consider postponing to a later date or increasing your training.";
    }
  
    const resultCard = document.createElement('div');
    resultCard.className = 'card mt-3';
    resultCard.innerHTML = `
      <div class="card-header">${resultHeaderText}</div>
      <div class="card-body">
        <p>${resultBodyText}</p>
      </div>
    `;
  
    // Clear previous results
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('resultsContainer').appendChild(resultCard);
  }
  
  // Function to calculate readiness for 'Running for Time'
  function calculateReadinessTime() {
    const raceDistance = parseFloat(document.getElementById('raceDistanceTime').value);
    const raceDate = new Date(document.getElementById('raceDateTime').value);
    const currentMileage = parseInt(document.getElementById('currentMileageTime').value);
    const currentPace = document.getElementById('currentPace').value;
    const goalPace = document.getElementById('goalPace').value;
    const trainingDays = parseInt(document.getElementById('trainingDaysTime').value);
  
    // Calculate weeks until race
    const today = new Date();
    const timeDiff = raceDate - today;
    const weeksUntilRace = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
  
    // Recommendations based on current mileage
    let weeksNeeded = 0;
    if (currentMileage < 20) {
        weeksNeeded = 20;
    } else if (currentMileage >= 20 && currentMileage < 35) {
        weeksNeeded = 16;
    } else if (currentMileage >= 35) {
        weeksNeeded = 8;
    }
  
    // Generate result card with advanced information
    let resultHeader = `Weeks until race: ${weeksUntilRace}`;
    let resultText = `Based on your current weekly mileage of ${currentMileage} miles, `;
    if (weeksUntilRace >= weeksNeeded) {
        resultText += "you have enough time to prepare for the marathon. Start training!";
    } else {
        resultText += "you need more time to prepare. Consider postponing to a later date or increasing your training.";
    }
    resultText += `<br><br>Additional Details for Racing for Time:<br>Current Time: ${currentPace}<br>Goal Time: ${goalPace}<br>Training Days per Week: ${trainingDays}`;
  
    const resultCard = document.createElement('div');
    resultCard.className = 'card mt-3';
    resultCard.innerHTML = `
      <div class="card-header">${resultHeader}</div>
      <div class="card-body">
        <p>${resultText}</p>
      </div>
    `;
  
    // Clear previous results
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('resultsContainer').appendChild(resultCard);
  }
  