import Component from '@ember/component';
import { later } from '@ember/runloop';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import Plot from 'mandelbrot-set-editor/utils/plot';
import m from 'mandelbrot-set-editor/utils/mandelbrot';

// import move from 'ember-animated/motions/move';
// import {easeOut, easeIn } from 'ember-animated/easings/cosine';

export default Component.extend({

  selectedTool: null,

  isPlotting: false,

  canvasSize: null,

  plot: null,

  init() {
    this._super(...arguments);

    this.plot = new Plot();
  },

  didInsertElement() {
    this._super(...arguments);

    const canvas = this.element.querySelector('#canvas');
    if (canvas.getContext) {
      // drawing code here
    } else {
      alert('your browser does not support HTML canvas');
      return;
    }
    this.ctx = canvas.getContext('2d');

    this.canvasSize = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
    canvas.setAttribute('width', this.canvasSize.w);
    canvas.setAttribute('height', this.canvasSize.h);
    this.updateOffsets(this.canvasSize);

    later(this, function() {
      this.updatePlot();
    }, 300);
  },

  mandelbrotPlot: function(options) {
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const coords = this.plot.coords;
    options = Object.assign({
      maxAccel: this.plot.maxAccel,
      offset: this.plot.offset,
    }, options);
    m.plot(ctx, coords, options);
  },

  transitionSpinner: function(context) {
    const {insertedSprites, keptSprites, removedSprites} = context;
    insertedSprites.forEach(sprite => {
      //sprite.startAtPixel({y: window.innerHeight});
      //sprite.endAtPixel({y: 0});
      //move(sprite, {y: 400, easing: easeOut});
      fadeIn(sprite);
    });
    keptSprites.forEach(fadeOut);
    removedSprites.forEach(fadeOut);
  },

  selectTool: function(toolName) {
    const selectedTool = this.get('selectedTool');
    const canvas = this.element.querySelector('#canvas');

    if (toolName === selectedTool) {
      this.set('selectedTool', null);
      canvas.style.cursor = 'auto';
      return; 
    }

    this.set('selectedTool', toolName);
    switch (toolName) {
      case 'move':
        canvas.style.cursor = 'crosshair';
        return;
      case 'zoom-in':
        canvas.style.cursor = 'zoom-in';
        return;
    }
  },

  clickCanvas: function(x, y) {
    const selectedTool = this.get('selectedTool');
    switch (selectedTool) {
      case 'move':
        this.set('isPlotting', true);
        this.updateOffsets(this.canvasSize, x, y);
        this.mandelbrotPlot();
        this.set('isPlotting', false);
        return;
      case 'zoom-in':
        this.reduceScale();
        this.updatePlot();
        return;
    }
  },

  updatePlot({inMSetColor} = {}) {
    this.set('isPlotting', true);

    this.plot.compute();
    this.mandelbrotPlot({inMSetColor});

    this.set('isPlotting', false);
  },

  updateEquation(x, y) {
    // inverse of m.plot()
    // const coordX = x + this.plot.offset.x;
    // const coordY = y + this.plot.offset.y;

    x + y;
    const index = 0;
    const coord = this.coords[index];
    const z = 0;
    const c = {r: coord.x, i: coord.y};
    const iterations = coord.iterations;
    this.set('eq', {z, c, iterations});
  },

  actions: {
    selectTool: function(toolName) {
      this.selectTool(toolName);
    },

    clickCanvas: function() {
      const x = event.offsetX;
      const y = event.offsetY;
      this.clickCanvas(x, y);
    },

    mOverCanvas() {
      const x = event.clientX;
      const y = event.clientY;
      if (this.isOnPlot(x, y)) {
        this.updateEquation(x, y);
      }
    },

    touchCanvas() {
      // console.log(event);
    },

    setInMSetHue: function(color) {
      color = color.toHSLA();
      color = {
        h: color[0],
        s: color[1],
        l: color[2],
        a: color[3]
      };
      this.updatePlot({inMSetColor: color});
    },

    updatePlotProperties(plot) {
      const size = plot.size || this.size;
      const maxAccel = plot.maxAccel || this.maxAccel;
      this.set('plot.maxAccel', maxAccel);
      this.set('plot.size', size);
      this.updatePlot();
    },

  }

});
