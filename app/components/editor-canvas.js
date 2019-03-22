import Component from '@ember/component';
import mandelbrot from 'mandelbrot-set-editor/utils/mandelbrot';
import { later } from '@ember/runloop';
import * as utils from 'mandelbrot-set-editor/utils';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';
import {easeOut, easeIn } from 'ember-animated/easings/cosine';

export default Component.extend({

  scale: 4,

  maxAccel: 100,

  fillStyleOutOfSet: 'rgb(0, 0, 0)',

  selectedTool: null,

  coords: null,

  isPlotting: false,

  pickrComponents: {
    preview: true,
    opacity: false,
    hue: true,
  
    interaction: {
      hex: false,
      rgba: false,
      hsva: true,
      input: false,
      clear: false,
      save: true
    }
  },

  reduceScale() {
    let s = this.scale;
    if (s <= 1) {
      s -= 0.1;
    } else {
      s -= 1;
    }
    this.scale = s;
  },

  setDimensions: function(canvas) {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  },

  initDimensions() {
    this.offset = {x: 0, y: 0};
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width > height) {
      height = width;
      this.offset.y = (height - window.innerHeight) / 2;
    }
    if (width < height) {
      width = height;
      this.offset.x = (width - window.innerWidth) / 2;
    }
    this.width = width;
    this.height = height;
  },

  didInsertElement() {
    this._super(...arguments);

    const canvas = this.element.querySelector('#canvas');

    this.setDimensions(canvas);

    if (canvas.getContext) {
      // drawing code here
    } else {
      alert('your browser does not support HTML canvas');
      return;
    }

    this.ctx = canvas.getContext('2d');

    this.initDimensions();


    this.set('isPlotting', true);
    later(this, function() {
      this.coords = mandelbrot(this.scale, this.maxAccel);
      this.mandelbrotPlot(this.coords);
      this.set('isPlotting', false);
    }, 200);
  },

  updateOffsets: function(clickX, clickY) {
    if (clickX) {
      const widthCenter = window.innerWidth / 2;
      const distance = Math.abs(widthCenter - clickX);
      if (clickX < widthCenter) {
        this.offset.x -= distance;
      } else {
        this.offset.x += distance;
      }
    }
    if (clickY) {
      const heightCenter = window.innerHeight / 2; 
      const distance = Math.abs(heightCenter - clickY);
      if (clickY < heightCenter) {
        this.offset.y -= distance;
      } else {
        this.offset.y += distance;
      }
    }
  },

  mandelbrotPlot: function(coords) {
    if (!coords) {
      return;
    }

    const maxAccel = this.maxAccel;
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.width, this.height);

    for (let coord of coords) {
      if (coord.acceleration === null) {
        ctx.fillStyle = this.fillStyleOutOfSet;
        //ctx.fillStyle = 'hsl(0, 0%, 50%)';
        //ctx.fillStyle = `rgb(0, ${g+=10}, ${b+=10})`;
        //ctx.fillStyle = `rgb(0, ${r255()}, ${r255()})`;
        let percent = utils.distPercent(this.width, this.height, coord.x, coord.y);
        //const hue = (percent * 255) / 100;
        const maxAccel = 75;
        percent > maxAccel ? maxAccel : percent;
        //ctx.fillStyle = `hsl(0, 0%, ${percent}%)`;
        //ctx.fillStyle = `hsl(${hue}, ${percent}%, ${percent}%)`;
        //ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        // radial saturation and lightning
        ctx.fillStyle = `hsl(${this.fillHue}, ${percent}%, ${percent}%)`;
      } else {
        const acceleration = coord.acceleration;
        const percent = (acceleration * 100) / maxAccel;
        const colPer = 256 * percent;
        const hue = colPer;
        const lightness = ((acceleration / (acceleration+64)) * 100);
        ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
      }

      ctx.fillRect(coord.x - this.offset.x, coord.y - this.offset.y, 1, 1);
    }
  },

  drawGrid() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgb(255, 255, 255)';
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);

    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);

    ctx.stroke();
  },

  transitionSpinner: function*(context) {
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

  actions: {
    selectTool: function(toolName) {
      const selectedTool = this.get('selectedTool');

      if (toolName === selectedTool) {
        this.set('selectedTool', null);
        this.element.style.cursor = 'auto';
        return; 
      }

      this.set('selectedTool', toolName);
      switch (toolName) {
        case 'move':
          this.element.style.cursor = 'crosshair';
          return;
        case 'zoom-in':
          this.element.style.cursor = 'zoom-in';
          return;
      }
    },

    clickCanvas: function() {
      const x = event.offsetX;
      const y = event.offsetY;

      const selectedTool = this.get('selectedTool');
      switch (selectedTool) {
        case 'move':
          this.set('isPlotting', true);
          console.log('move', x, y);
          this.updateOffsets(x, y);
          break;
        case 'zoom-in':
          this.reduceScale();
          console.log('zoom-in', this.scale);
          this.coords = mandelbrot(this.scale, this.maxAccel);
          break;
        default:
          return;
      }

      this.mandelbrotPlot(this.coords);
      this.set('isPlotting', false);
    },

    handleOnSaveFill(color) {
      if (!color) {
        return;
      }

      this.set('isPlotting', true);
      const hsla = color.toHSLA();
      console.log(hsla);
      this.fillHue = hsla[0]; 
      this.mandelbrotPlot(this.coords);
      this.set('isPlotting', false);
    },

    updateIterations(ev) {
      this.set('isPlotting', true);
      this.set('maxAccel', Number.parseInt(ev.target.value));
      console.log('max iterations', this.maxAccel);
      this.coords = mandelbrot(this.scale, this.maxAccel);
      this.mandelbrotPlot(this.coords);
      this.set('isPlotting', false);
    },

    updateScale(ev) {
      this.set('isPlotting', true);
      this.set('scale', Number.parseInt(ev.target.value));
      console.log('scale', this.scale);
      this.coords = mandelbrot(this.scale, this.maxAccel);
      this.mandelbrotPlot(this.coords);
      this.set('isPlotting', false);
    },

  }

});
