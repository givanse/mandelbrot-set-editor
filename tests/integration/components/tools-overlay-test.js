import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | tools-overlay', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('funcVals', {z: 12, c: 34});

    await render(hbs`<ToolsOverlay @funcVals={{funcVals}} />`);

    const text = this.element.textContent.replace(/\s*/g, '');
    assert.equal(text, '┼↖↗↘↙ƒ(z)=12²+34accelerationsize');
  });
});
