const form = document.querySelector('#signal-form');
const forecast = document.querySelector('#forecast');
const personaSummary = document.querySelector('#persona-summary');
const metrics = document.querySelector('#metrics');
const trajectory = document.querySelector('#trajectory');
const recommendations = document.querySelector('#recommendations');
const agentCouncil = document.querySelector('#agent-council');

for (const input of form.querySelectorAll('input[type="range"]')) {
  const output = document.querySelector(`#${input.name}-value`);
  input.addEventListener('input', () => {
    output.textContent = input.value;
    renderPrediction(MiniMeForecaster.predictWeek(formData()));
  });
}

for (const field of form.querySelectorAll('textarea')) {
  field.addEventListener('input', () => renderPrediction(MiniMeForecaster.predictWeek(formData())));
}

function formData() {
  return Object.fromEntries(new FormData(form).entries());
}

function renderPrediction(prediction) {
  const { persona } = prediction;
  personaSummary.textContent = prediction.summary;
  metrics.innerHTML = [
    ['Resilience', persona.resilience],
    ['Load', persona.load],
    ['Clarity', persona.clarity],
    ['Adapt', persona.adaptability],
    ['Average', prediction.average],
  ].map(([label, value]) => `<article><strong>${value}</strong><span>${label}</span></article>`).join('');
  trajectory.innerHTML = prediction.days.map((day) => `<span style="--height:${day.score * 9}%" title="${day.day}: ${day.score}/10"><b>${day.day.slice(0, 3)}</b></span>`).join('');
  agentCouncil.innerHTML = `<h3>Agent council</h3><div>${prediction.agents.map((agent) => `<article class="agent-card"><strong>${agent.icon} ${agent.name}</strong><span>${agent.priority}</span><p>${agent.assignment}</p><small>${agent.specialty}</small></article>`).join('')}</div>`;
  recommendations.innerHTML = `<h3>Smart nudges</h3><ul>${prediction.recommendations.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  forecast.innerHTML = `
    <div class="forecast-header">
      <p class="eyebrow">Next seven days</p>
      <h2>${prediction.outlook}</h2>
      <p>${prediction.summary}</p>
    </div>
    <div class="day-grid">
      ${prediction.days.map((day) => `
        <article class="day-card">
          <div class="day-topline"><h3>${day.day}</h3><span>${day.confidence}%</span></div>
          <meter min="1" max="10" value="${day.score}"></meter>
          <p class="theme">${day.theme} · ${day.score}/10</p>
          <p><strong>Do:</strong> ${day.action}</p>
          <p><strong>Watch:</strong> ${day.risk}</p>
          <p><strong>Agent:</strong> ${day.agent}</p>
          <p class="note">${day.note}</p>
        </article>
      `).join('')}
    </div>`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPrediction(MiniMeForecaster.predictWeek(formData()));
  forecast.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

renderPrediction(MiniMeForecaster.predictWeek(formData()));
