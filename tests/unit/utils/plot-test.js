import Plot from 'mandelbrot-set-editor/utils/plot';
import { module, test } from 'qunit';

module('Unit | Utility | Plot', function(hooks) {

  let p;

  hooks.beforeEach(function() {
    p = new Plot();
  });

  // Replace this with your real tests.
  test('it works', function(assert) {
    assert.ok(p);
  });
});
