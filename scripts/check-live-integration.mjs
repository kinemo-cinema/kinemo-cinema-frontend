import assert from 'node:assert/strict';

// Write tests are restricted to the separate local verification servers.
const base = process.env.KINEMO_TEST_URL || 'http://localhost:5174';
assert.ok(['http://localhost:5174', 'http://localhost:5090'].includes(base), 'Use an isolated verification server.');
const checks = [];
async function request(method, path, payload, status = 200) {
    const response = await fetch(`${base}/api/v1${path}`, {
        method,
        headers: payload && !(payload instanceof FormData) ? { 'Content-Type': 'application/json' } : undefined,
        body: payload instanceof FormData ? payload : payload ? JSON.stringify(payload) : undefined,
        signal: AbortSignal.timeout(10000),
    });
    const text = await response.text();
    assert.equal(response.status, status, `${method} ${path}: ${text.slice(0, 500)}`);
    checks.push(`${method} ${path} → ${status}`);
    return text ? JSON.parse(text) : null;
}
const title = `Integration check ${Date.now()}`;
const movie = await request('POST', '/movies', { title, durationMinutes: 90, genre: 'SciFi' }, 201);
assert.ok((await request('GET', '/movies')).some(item => item.id === movie.id));
await request('POST', '/movies', { title, durationMinutes: 90, genre: 'SciFi' }, 409);
await request('PATCH', `/movies/${movie.id}`, { title: `${title} edited`, durationMinutes: 95, genre: 'Action' });
assert.equal((await request('GET', `/movies/${movie.id}`)).durationMinutes, 95);
assert.equal((await request('GET', '/movies/genres')).length, 7);
const room = await request('POST', '/rooms', { name: title, capacity: 40 }, 201);
assert.equal((await request('POST', `/rooms/${room.id}/preparation`, { observations: 'Isolated integration verification' })).inspections.length, 1);
const start = new Date(Date.now() + 86400000).toISOString();
const end = new Date(Date.now() + 90000000).toISOString();
const block = await request('POST', `/rooms/${room.id}/blocking`, { reason: 'Isolated verification', startDateTime: start, endDateTime: end });
assert.equal(block.status, 'Maintenance');
assert.equal((await request('POST', `/rooms/${room.id}/release`)).blocks[0].active, false);
const show = await request('POST', '/shows', { movieId: movie.id, roomId: room.id, startDateTime: start, endDateTime: end }, 201);
assert.ok((await request('GET', '/shows')).some(item => item.id === show.id));
await request('POST', '/shows', { movieId: movie.id, roomId: room.id, startDateTime: start, endDateTime: end }, 400);
await request('PATCH', `/shows/${show.id}`, { startDateTime: start, endDateTime: end });
const upload = new FormData();
upload.append('file', new Blob(['isolated integration fixture']), `integration-check-${movie.id}.txt`);
upload.append('effectType', 'Motion'); upload.append('durationSeconds', '60');
await request('POST', `/movies/${movie.id}/sensory-file`, upload, 201);
const profile = await request('POST', `/movies/${movie.id}/effects-profile`, { intensityLevel: 'High' });
assert.equal(profile.sensoryContent.tracks.length, 1);
assert.equal(profile.sensoryContent.intensityLevel, 'High');
assert.equal((await request('GET', `/movies/${movie.id}/sensory-content`)).history.length, 1);
const execution = await request('POST', '/executions', { showId: show.id, sensoryContentId: profile.sensoryContent.id }, 201);
assert.ok((await request('GET', '/executions')).some(item => item.id === execution.id));
assert.equal((await request('POST', `/executions/${execution.id}/pause`)).status, 'Paused');
assert.equal((await request('POST', `/executions/${execution.id}/resume`)).status, 'InProgress');
assert.equal((await request('POST', `/executions/${execution.id}/finish`)).status, 'Finished');
const emergency = await request('POST', '/executions', { showId: show.id, sensoryContentId: profile.sensoryContent.id }, 201);
assert.equal((await request('POST', `/executions/${emergency.id}/emergency-stop`, { reason: 'Isolated verification' })).emergencyEvents.length, 1);
const integration = await request('POST', '/ticketing/integrations', { cinemaId: 1, providerName: title }, 201);
assert.ok((await request('GET', '/ticketing/integrations')).some(item => item.id === integration.id));
const sync = await request('POST', `/ticketing/integrations/${integration.id}/sync`, { showId: show.id });
assert.equal(sync.occupancies.length, 0, 'Unconfigured provider must not invent occupancy.');
assert.ok(sync.syncLogs.some(log => log.errorDetails?.includes('No real external')));
const plans = await request('GET', '/subscription-plans');
assert.ok(plans.length >= 2, 'Seed two plans in the isolated database only.');
const subscription = await request('POST', '/subscriptions', { cinemaId: 1, planId: plans[0].id }, 201);
assert.ok((await request('GET', '/subscriptions')).some(item => item.id === subscription.id));
await request('POST', `/subscriptions/${subscription.id}/payments`, { amount: 1, paymentToken: 'isolated-check' }, 503);
assert.equal((await request('GET', `/subscriptions/${subscription.id}`)).transactions.length, 0);
assert.equal((await request('POST', `/subscriptions/${subscription.id}/upgrades`, { newPlanId: plans[1].id })).planId, plans[1].id);
const period = { periodStart: new Date(Date.now() - 3600000).toISOString(), periodEnd: new Date(Date.now() + 172800000).toISOString() };
const dashboard = await request('POST', '/analytics/dashboards', period, 201);
const storedShows = await request('GET', '/shows');
const expectedShowCount = storedShows.filter(item => item.status !== 'Cancelled' && item.startDateTime < period.periodEnd && item.endDateTime > period.periodStart).length;
assert.equal(dashboard.metrics.find(metric => metric.metricType === 'ShowCount')?.metricValue, expectedShowCount, 'Analytics must use stored shows.');
await request('GET', `/analytics/dashboards/${dashboard.id}`);
await request('GET', '/analytics/dashboards/latest');
const report = await request('POST', '/analytics/reports', { ...period, reportType: 'Operational', format: 'CSV' }, 201);
await request('GET', `/analytics/reports/${report.id}`);
await request('POST', `/shows/${show.id}/cancellation`);
await request('POST', `/movies/${movie.id}/deactivation`);
console.log(JSON.stringify({ passed: checks.length, checks, movieId: movie.id, roomId: room.id, showId: show.id }, null, 2));
