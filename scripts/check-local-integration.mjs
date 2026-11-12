import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  cacheDir: 'node_modules/.vite-contract-check',
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
  appType: 'custom',
});
try {
  const { CatalogApi } = await server.ssrLoadModule('/src/catalog/infrastructure/catalog-api.js');
  const { MovieAssembler } = await server.ssrLoadModule('/src/catalog/infrastructure/movie.assembler.js');
  const { SchedulingApi } = await server.ssrLoadModule('/src/scheduling/infrastructure/scheduling-api.js');
  const { ShowAssembler } = await server.ssrLoadModule('/src/scheduling/infrastructure/show.assembler.js');
  const { ReadinessApi } = await server.ssrLoadModule('/src/readiness/infrastructure/readiness-api.js');
  const calls = [];
  const capture = async config => {
    calls.push(config);
    return { status: 200, data: [], config };
  };
  const catalog = new CatalogApi();
  catalog.http.defaults.adapter = capture;
  await catalog.getMovies();
  assert.equal(calls.at(-1).baseURL, '/api/v1');
  assert.equal(calls.at(-1).url, '/movies');
  await catalog.updateMovie({ id: 7, title: 'Example', genre: 'SciFi' });
  assert.equal(calls.at(-1).method, 'patch');
  await catalog.deleteMovie(7);
  assert.equal(calls.at(-1).url, '/movies/7/deactivation');
  const movie = MovieAssembler.toEntityFromResource({ id: 7, title: 'Example', durationMinutes: 90, genre: 'SciFi', status: 'Active' });
  assert.equal(MovieAssembler.toResourceFromEntity(movie).genre, 'SciFi');
  const scheduling = new SchedulingApi();
  scheduling.http.defaults.adapter = capture;
  const startTime = '2026-12-01T10:00:00Z';
  const endTime = '2026-12-01T11:30:00Z';
  await scheduling.createShow({ movieId: 7, roomId: 2, startTime, endTime });
  assert.equal(JSON.parse(calls.at(-1).data).startDateTime, startTime);
  const show = ShowAssembler.toEntityFromResource({ id: 1, movieId: 7, roomId: 2, startDateTime: startTime, endDateTime: endTime, status: 'InProgress' });
  assert.equal(show.getStatusAsString(), 'IN_PROGRESS');
  const readiness = new ReadinessApi();
  readiness.http.defaults.adapter = async config => ({ status: 200, config, data: [{ id: 2, inspections: [{ id: 3 }], blocks: [{ id: 4 }] }] });
  assert.deepEqual((await readiness.getRoomInspections()).data, [{ id: 3, roomId: 2 }]);
  assert.deepEqual((await readiness.getRoomBlocks()).data, [{ id: 4, roomId: 2 }]);
  console.log('Local API contract checks passed (no live database required).');
} finally {
  await server.close();
}
