import {
  distPercent,
  math,
} from '.';
const TWO = 2;

export default {

  // Fc(z) = z^2 + c
  //      = (zr + zi)^2 + (cr + ci)
  //      = (zr^2 + 2*zr*zi + zi^2) + (cr + ci)
  //      = (zr^2 + 2*zr*zi + (z.i^2 * i^2) + (cr + ci)
  //      = (zr^2 + 2*zr*zi + (z.i^2 * -1) + (cr + ci)
  //      = zr^2 - (z.i^2 * 1) + cr
  //        2 * zr * zi + ci
  applyFz(z, c) {
    //const {r, i} = z;
    const r = z.r * z.r - z.i * z.i + c.r;
    const i = 2 * z.r * z.i + c.i;
    return {r, i};
  },

  compute(size = 800, maxAccel = 100) {
    const results = [];

    const cIncSize = (TWO * 2) / size;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const c = {
          r: -TWO + (cIncSize * x),
          i: -TWO + (cIncSize * y)
        };

        let z = { r: 0, i: 0 };
        let iterations = 0;
        while (math.i.abs(z) < TWO && iterations < maxAccel) {
          z = this.applyFz(z, c);
          iterations++;
        }

        const r = {
          x, y,
          acceleration: 0 // assumes its in the set
        };

        if (iterations < maxAccel) { // i.e. abs(z) > TWO, not in the set
          r.acceleration = iterations;
        }

        results.push(r);
      }
    }

    return results;
  },

  plot(ctx, coords, options = {}) {
    if (!coords) {
      return;
    }

    const {
      maxAccel,
      offset,
      inMSetColor,
    } = options;

    for (let coord of coords) {
      if (coord.acceleration === 0) {
        ctx.fillStyle = this.getInSetFillStyle(coord, inMSetColor);
      } else {
        ctx.fillStyle = this.getNotInSetFillStyle(coord, maxAccel);
      }
      ctx.fillRect(coord.x - offset.x, coord.y - offset.y, 1, 1);
    }
  },

  getInSetFillStyle(coord, inMSetColor) {
    const {x, y} = coord;
    //ctx.fillStyle = 'hsl(0, 0%, 50%)';
    //ctx.fillStyle = `rgb(0, ${g+=10}, ${b+=10})`;
    //ctx.fillStyle = `rgb(0, ${r255()}, ${r255()})`;
    let percent = distPercent(this.width, this.height, x, y);
    //const hue = (percent * 255) / 100;
    const maxAccel = 75;
    percent > maxAccel ? maxAccel : percent;
    //ctx.fillStyle = `hsl(0, 0%, ${percent}%)`;
    //ctx.fillStyle = `hsl(${hue}, ${percent}%, ${percent}%)`;
    // radial saturation and lightning
    //ctx.fillStyle = `hsl(${this.fillHue}, ${percent}%, ${percent}%)`;
    const {h, s, l} = inMSetColor || {h: 202, s: 100, l: 50};
    return `hsl(${h}, ${s}%, ${l}%)`;
  },

  getNotInSetFillStyle(coord, maxAccel) {
    const acceleration = coord.acceleration;
    const percent = (acceleration * 100) / maxAccel;
    const colPer = (256 * percent) / 100;
    const hue = colPer;
    //const lightness = ((acceleration / (acceleration+64)) * 100);
    const lightness = percent; 
    return `hsl(${hue}, 100%, ${lightness}%)`;
  },

}