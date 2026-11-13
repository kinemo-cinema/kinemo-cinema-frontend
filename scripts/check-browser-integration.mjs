import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const readOnly = process.argv.includes('--read-only');
const base = readOnly ? 'http://localhost:5173' : 'http://localhost:5174';
const target = await (await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
let exceptions = [];
let responses = [];
socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id); }
    else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    else if (message.method === 'Network.responseReceived' && message.params.response.url.includes('/api/')) responses.push(message.params.response);
};
const send = (method, params = {}) => new Promise(resolve => { pending.set(++sequence, resolve); socket.send(JSON.stringify({ id: sequence, method, params })); });
async function evaluate(expression) {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    assert.ok(!response.result?.exceptionDetails, JSON.stringify(response.result?.exceptionDetails));
    return response.result?.result?.value;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function navigate(path) {
    exceptions = []; responses = [];
    await send('Page.navigate', { url: base + path });
    await pause(1300);
    assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
    return evaluate('document.body.innerText');
}
async function click(expression) {
    const point = await evaluate(`(()=>{const element=(${expression});if(!element)throw Error('Element missing');element.scrollIntoView({block:'center'});const rect=element.getBoundingClientRect();return {x:rect.x+rect.width/2,y:rect.y+rect.height/2};})()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
}
async function fill(selector, text) {
    await click(`document.querySelector(${JSON.stringify(selector)})`);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2, windowsVirtualKeyCode: 65 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', modifiers: 2 });
    await send('Input.insertText', { text });
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
}
try {
    await send('Runtime.enable'); await send('Network.enable'); await send('Page.enable');
    const checks = [];
    for (const path of ['/dashboard', '/catalog/movies', '/catalog/genres', '/catalog/sensory-files', '/catalog/sensory-tracks', '/catalog/configuration-history', '/room-readiness/rooms', '/scheduling/shows', '/ticketing/integrations', '/execution/shows', '/subscriptions', '/subscriptions/manage', '/analytics', '/maintenance', '/seat-allocation/allocations']) {
        const body = await navigate(path);
        assert.ok(body.length > 40 && !body.includes('Page not found'), path);
        assert.equal(responses.filter(response => response.status >= 400 && !(response.status === 404 && response.url.endsWith('/analytics/dashboards/latest'))).length, 0, `${path}: ${JSON.stringify(responses.map(response => ({ url: response.url, status: response.status })))}`);
        if (path === '/maintenance' || path.startsWith('/seat-allocation')) {
            assert.ok(!body.includes('todavía no está implementado'), path);
            assert.ok(responses.some(response => response.status === 200), 'Integrated modules must consult the real API.');
        }
        checks.push(path);
    }
    if (!readOnly) {
        const equipment = await (await fetch(`${base}/api/v1/equipment`)).json();
        if (equipment.length) {
            await navigate('/maintenance');
            await evaluate(`(()=>{const select=[...document.querySelectorAll('label > select')].find(element=>element.parentElement.firstChild.textContent.trim()==='Equipo');select.value=${JSON.stringify(String(equipment[0].id))};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
            await pause(250);
            assert.ok((await evaluate('document.body.innerText')).includes(equipment[0].name), 'Maintenance must display persisted equipment.');
        }
        const shows = await (await fetch(`${base}/api/v1/shows`)).json();
        for (const show of shows) {
            const result = await fetch(`${base}/api/v1/seat-allocations/${show.id}`);
            if (!result.ok) continue;
            await navigate('/seat-allocation/allocations');
            await evaluate(`(()=>{const select=document.querySelector('select');select.value=${JSON.stringify(String(show.id))};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
            await click("[...document.querySelectorAll('button')].find(element=>element.innerText==='Consultar mapa')");
            await pause(400);
            assert.ok(await evaluate("document.querySelectorAll('.seat-grid button').length > 0"), 'Seat map must show stored seats.');
            break;
        }
    }
    if (readOnly) {
        console.log(JSON.stringify({ realAppPagesPassed: checks.length, checks, noWrites: true }, null, 2));
    } else {
    const title = `Browser verification ${Date.now()}`;
    await navigate('/catalog/movies/new');
    await fill('#title', title);
    await fill('#duration', '100');
    await click("document.querySelector('[role=combobox]')");
    await pause(200);
    await click("[...document.querySelectorAll('[role=option]')].find(element=>element.innerText==='SciFi')");
    await click("document.querySelector('button[type=submit]')");
    await pause(1200);
    assert.equal(await evaluate('location.pathname'), '/catalog/movies', 'Successful save should return to the list.');
    if (!(await evaluate('document.body.innerText')).includes(title)) {
        await click("document.querySelector('button[aria-label=\"Last Page\"]')");
        await pause(200);
    }
    assert.ok((await evaluate('document.body.innerText')).includes(title), 'Created movie must appear in the UI.');
    const movie = (await (await fetch(`${base}/api/v1/movies`)).json()).find(item => item.title === title);
    assert.equal(movie.durationMinutes, 100);
    await navigate(`/catalog/movies/${movie.id}/edit`);
    assert.equal(await evaluate("document.querySelector('#title').value"), title, 'Direct edit URL must load backend data.');
    await fill('#title', `${title} edited`);
    await click("document.querySelector('button[type=submit]')");
    await pause(1000);
    assert.equal(await evaluate('location.pathname'), '/catalog/movies');
    assert.equal((await (await fetch(`${base}/api/v1/movies/${movie.id}`)).json()).title, `${title} edited`);
    if (process.env.KINEMO_BROWSER_SCREENSHOT) {
        const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        await writeFile(process.env.KINEMO_BROWSER_SCREENSHOT, Buffer.from(screenshot.result.data, 'base64'));
    }
    console.log(JSON.stringify({ pagesPassed: checks.length, checks, browserCreateAndEditPassed: true, movieId: movie.id }, null, 2));
    }
} finally {
    await send('Page.close');
    socket.close();
}
