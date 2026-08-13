const assert = require('node:assert/strict');
const { predictWeek, buildPersona, parseKeywords } = require('../forecaster');

const prediction = predictWeek({
  mood: 7,
  energy: 6,
  focus: 8,
  sleep: 7,
  stress: 4,
  social: 6,
  commitments: 'project due Thursday and gym',
  goals: 'finish coding practice and sleep earlier',
  habits: 'exercise journal hydrate',
});

assert.equal(prediction.days.length, 7);
assert.match(prediction.summary, /pressure signal/);
assert.ok(prediction.average >= 1 && prediction.average <= 10);
assert.ok(prediction.recommendations.length >= 1);
assert.ok(prediction.days.every((day) => day.score >= 1 && day.score <= 10));
assert.ok(prediction.days.every((day) => day.confidence >= 45 && day.confidence <= 88));
assert.deepEqual(parseKeywords('Sleep earlier, code 2x!'), ['sleep', 'earlier', 'code', '2x']);

const strained = buildPersona({ mood: 3, energy: 3, focus: 4, sleep: 4, stress: 9, social: 2, commitments: 'exam due interview deadline' });
assert.equal(strained.archetype, 'Careful Recharger');

console.log('Mini Me Forecaster tests passed');
