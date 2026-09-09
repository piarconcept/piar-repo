import { builtinEnvironments } from 'vitest/environments';

// Vitest 2's jsdom environment replaces AbortSignal but keeps Node's Request.
// Node 24 rejects that mixed pair, so preserve native cancellation constructors.
export default {
  name: 'jsdom-node-fetch',
  transformMode: 'web',
  async setup(global, options) {
    const { AbortController, AbortSignal } = global;
    const environment = await builtinEnvironments.jsdom.setup(global, options);
    global.AbortController = AbortController;
    global.AbortSignal = AbortSignal;
    return environment;
  },
};
