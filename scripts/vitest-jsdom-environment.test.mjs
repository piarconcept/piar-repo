import assert from 'node:assert/strict';
import { test } from 'node:test';
import environment from './vitest-jsdom-environment.mjs';

test('jsdom preserves Request-compatible cancellation and restores globals', async () => {
  const nativeController = globalThis.AbortController;
  const nativeSignal = globalThis.AbortSignal;
  const handle = await environment.setup(globalThis, { jsdom: { url: 'http://localhost:3000' } });

  try {
    assert.equal(globalThis.AbortController, nativeController);
    assert.equal(globalThis.AbortSignal, nativeSignal);

    const controller = new AbortController();
    const request = new Request('http://localhost:3000/en', { signal: controller.signal });
    controller.abort('navigation cancelled');
    assert.equal(request.signal.aborted, true);
    assert.equal(request.signal.reason, 'navigation cancelled');

    const live = new AbortController();
    assert.equal(await (await fetch('data:text/plain,ok', { signal: live.signal })).text(), 'ok');

    const aborted = new AbortController();
    aborted.abort();
    await assert.rejects(fetch('data:text/plain,ok', { signal: aborted.signal }), {
      name: 'AbortError',
    });
    assert.equal(document.createElement('div').tagName, 'DIV');
    assert.ok(window === globalThis);
  } finally {
    await handle.teardown(globalThis);
  }

  assert.equal(globalThis.AbortController, nativeController);
  assert.equal(globalThis.AbortSignal, nativeSignal);
  assert.equal(globalThis.document, undefined);
});
