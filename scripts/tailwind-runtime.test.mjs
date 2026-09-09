import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const stylesheet = path.join(root, 'packages/ui/config/tailwind.css');

for (const application of ['web', 'backoffice']) {
  test(`${application}: the pinned Tailwind compiler, scanner, and optimizer support Node 24`, async () => {
    const appRequire = createRequire(path.join(root, 'apps/client', application, 'package.json'));
    const pluginRequire = createRequire(appRequire.resolve('@tailwindcss/postcss'));
    const { compile } = pluginRequire('@tailwindcss/node');
    const { Scanner } = pluginRequire('@tailwindcss/oxide');
    const { transform } = pluginRequire('lightningcss');

    assert.equal(appRequire('tailwindcss/package.json').version, '4.1.18');

    const compiler = await compile(await readFile(stylesheet, 'utf8'), {
      base: path.dirname(stylesheet),
      onDependency() {},
      customCssResolver: (id) =>
        id === 'tailwindcss' ? appRequire.resolve('tailwindcss/index.css') : undefined,
    });
    const scanner = new Scanner({ sources: [] });
    const candidates = scanner.scanFiles([
      {
        extension: 'html',
        content:
          '<div class="bg-primary text-secondary grid md:grid-cols-3 hover:bg-secondary rounded-xl"></div>',
      },
    ]);
    const css = compiler.build(candidates);

    for (const selector of [
      '.bg-primary',
      '.text-secondary',
      '.md\\:grid-cols-3',
      '.hover\\:bg-secondary',
      '.rounded-xl',
    ]) {
      assert.ok(css.includes(selector), `${selector} must survive compilation`);
    }

    assert.match(css, /--color-primary:\s*#b22222/i);
    assert.match(css, /@media/);
    assert.doesNotMatch(css, /@(?:theme|apply|import)\b/);

    const optimized = transform({
      filename: 'runtime-test.css',
      code: Buffer.from(css),
      minify: true,
    }).code.toString();
    assert.ok(optimized.includes('.md\\:grid-cols-3'));
    assert.ok(optimized.includes('--color-primary'));
    assert.ok(optimized.length < css.length);
  });
}
