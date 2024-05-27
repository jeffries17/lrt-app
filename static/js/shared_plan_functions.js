function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function savePlan() {
  const planHtml = document.getElementById('trainingPlanOutput').innerHTML;
  const distance = document.getElementById('selectedDistance').value;
  const weeks = document.getElementById('selectedWeeks').value;

  fetch('/generate_pdf/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
          plan_html: planHtml,
          distance: distance,
          weeks: weeks
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.blob();
  })
  .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'training_plan.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
  })
  .catch(error => console.error('Error:', error));
}

function sendPlanViaEmail() {
  const planHtml = document.getElementById('trainingPlanOutput').innerHTML;
  const distance = document.getElementById('selectedDistance').value;
  const weeks = document.getElementById('selectedWeeks').value;
  const email = prompt("Please enter your email address:");

  if (email) {
      fetch('/generate_pdf/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({
              plan_html: planHtml,
              distance: distance,
              weeks: weeks,
              email: email
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.message) {
              alert('Plan sent to ' + email + ' successfully!');
          } else {
              alert('Error: ' + data.error);
          }
      })
      .catch(error => console.error('Error:', error));
  }
}

function addDownloadAndEmailButtons() {
  const existingDownloadButton = document.getElementById('downloadButton');
  if (existingDownloadButton) {
      existingDownloadButton.remove();
  }

  const existingEmailButton = document.getElementById('emailButton');
  if (existingEmailButton) {
      existingEmailButton.remove();
  }

  const downloadButton = document.createElement('button');
  downloadButton.id = 'downloadButton';
  downloadButton.type = 'button';
  downloadButton.className = 'btn btn-success mt-3';
  downloadButton.innerText = 'Download Plan as PDF';
  downloadButton.onclick = savePlan;

  const emailButton = document.createElement('button');
  emailButton.id = 'emailButton';
  emailButton.type = 'button';
  emailButton.className = 'btn btn-primary mt-3 ml-3';
  emailButton.innerText = 'Send Plan via Email';
  emailButton.onclick = sendPlanViaEmail;

  document.getElementById('trainingPlanOutput').insertAdjacentElement('afterend', downloadButton);
  downloadButton.insertAdjacentElement('afterend', emailButton);
}

window.savePlan = savePlan;
window.sendPlanViaEmail = sendPlanViaEmail;
window.addDownloadAndEmailButtons = addDownloadAndEmailButtons;
