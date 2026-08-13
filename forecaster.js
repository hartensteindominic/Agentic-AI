(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MiniMeForecaster = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const PRESSURE_WORDS = ['due', 'exam', 'interview', 'deadline', 'presentation', 'project', 'test', 'launch', 'review'];
  const RECOVERY_WORDS = ['rest', 'sleep', 'break', 'family', 'friend', 'gym', 'walk', 'therapy', 'meditate', 'stretch'];
  const HABIT_WORDS = ['exercise', 'journal', 'read', 'hydrate', 'study', 'code', 'cook', 'budget'];

  function clamp(value, min, max) {
    const number = Number(value);
    if (Number.isNaN(number)) return min;
    return Math.min(max, Math.max(min, number));
  }

  function parseKeywords(text) {
    return String(text || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  }

  function countMatches(words, dictionary) {
    return words.filter((word) => dictionary.includes(word)).length;
  }

  function buildPersona(input) {
    const signals = {
      mood: clamp(input.mood, 1, 10),
      energy: clamp(input.energy, 1, 10),
      focus: clamp(input.focus, 1, 10),
      sleep: clamp(input.sleep, 3, 10),
      stress: clamp(input.stress, 1, 10),
      social: clamp(input.social, 1, 10),
    };
    const commitments = parseKeywords(input.commitments);
    const goals = parseKeywords(input.goals);
    const habits = parseKeywords(input.habits);
    const allWords = commitments.concat(goals, habits);
    const pressure = countMatches(commitments, PRESSURE_WORDS);
    const recovery = countMatches(allWords, RECOVERY_WORDS);
    const habitSupport = countMatches(allWords, HABIT_WORDS);
    const sleepDebt = Math.max(0, 7 - signals.sleep);
    const resilience = (signals.mood + signals.energy + signals.focus + signals.sleep + signals.social) / 5
      - signals.stress * 0.42
      + recovery * 0.24
      + habitSupport * 0.16;
    const load = signals.stress + pressure * 1.2 + sleepDebt * 0.72 + Math.max(0, commitments.length - 12) * 0.05;
    const clarity = clamp((signals.focus + signals.energy + habitSupport) / 3, 1, 10);
    return {
      signals,
      commitments,
      goals,
      habits,
      pressure,
      recovery,
      habitSupport,
      clarity: Number(clarity.toFixed(2)),
      resilience: Number(clamp(resilience, 1, 10).toFixed(2)),
      load: Number(clamp(load, 1, 10).toFixed(2)),
      archetype: resilience >= 6.8 ? 'Momentum Builder' : load >= 7 ? 'Careful Recharger' : clarity >= 6.3 ? 'Focused Improver' : 'Steady Improver',
    };
  }

  function scoreDay(persona, index) {
    const weekendBoost = index >= 5 ? 0.85 : 0;
    const mondayRamp = index === 0 ? -0.18 : 0;
    const midweekDip = index === 2 || index === 3 ? -0.34 : 0;
    const pressureSpike = persona.pressure > 0 && index >= 2 && index <= 4 ? persona.pressure * -0.26 : 0;
    const habitLift = persona.habitSupport > 0 && [1, 4, 6].includes(index) ? 0.22 : 0;
    const base = persona.resilience - persona.load * 0.17 + weekendBoost + mondayRamp + midweekDip + pressureSpike + habitLift;
    return clamp(Number(base.toFixed(2)), 1, 10);
  }

  function makeDay(persona, index) {
    const score = scoreDay(persona, index);
    const day = DAYS[index];
    const high = score >= 7;
    const low = score < 4.5;
    const theme = high ? 'high-output day' : low ? 'recovery and simplification day' : 'balanced progress day';
    const action = high
      ? 'Use your strongest block for the goal that matters most.'
      : low
        ? 'Shrink the plan to essentials and protect sleep.'
        : 'Make steady progress with one focused task and one reset break.';
    const risk = persona.load > 7
      ? 'Overcommitting because your load is already elevated.'
      : persona.signals.sleep < 6
        ? 'Low sleep may reduce patience and focus.'
        : 'Drifting without a clear first task.';
    return {
      day,
      score,
      confidence: clamp(Math.round(54 + Math.abs(score - 5) * 7 + persona.commitments.length * 1.4 + persona.habitSupport), 45, 88),
      theme,
      action,
      risk,
      note: `Mini-you says: treat ${day} like a ${theme}; your best move is to ${action.toLowerCase()}`,
    };
  }

  function makeRecommendations(persona) {
    const recommendations = [];
    if (persona.load >= 7) recommendations.push('Create a not-to-do list before adding another commitment.');
    if (persona.signals.sleep < 6.5) recommendations.push('Move bedtime 30 minutes earlier for two nights and reduce late caffeine.');
    if (persona.pressure > 1) recommendations.push('Pre-decide the first 25-minute work sprint for your highest-pressure item.');
    if (persona.recovery < 1) recommendations.push('Schedule one deliberate recovery block so the week has a reset valve.');
    if (!recommendations.length) recommendations.push('Protect your current rhythm and use the extra margin for one meaningful stretch goal.');
    return recommendations;
  }

  function predictWeek(input) {
    const persona = buildPersona(input);
    const days = DAYS.map((_, index) => makeDay(persona, index));
    const average = days.reduce((sum, day) => sum + day.score, 0) / days.length;
    return {
      persona,
      summary: `You look like a ${persona.archetype}: resilience ${persona.resilience}/10, load ${persona.load}/10, with ${persona.pressure} pressure signal(s), ${persona.recovery} recovery signal(s), and ${persona.habitSupport} habit anchor(s).`,
      outlook: average >= 6.5 ? 'Positive momentum' : average < 4.8 ? 'Conserve energy' : 'Manageable with structure',
      average: Number(average.toFixed(2)),
      recommendations: makeRecommendations(persona),
      days,
    };
  }

  return { buildPersona, predictWeek, parseKeywords };
});
