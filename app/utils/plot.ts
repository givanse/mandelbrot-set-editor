import m from 'mandelbrot-set-editor/utils/mandelbrot';

type Coord = {
  x: number,
  y: number,
  acceleration: number,
};

type Offset = {
  x: number,
  y: number,
};

export default class Plot {

  coords: Coord[] = [];

  size: number = 0;

  maxAccel: number = 100;

  offset: Offset = {x: 0, y: 0};

  compute() {
    this.coords = m.compute(this.size, this.maxAccel);
    return this.coords;
  }

  updateOffsets(canvasSize, x: number, y: number) {
    x = x || this.size / 2;
    y = y || this.size / 2;

    function getOffset(a, b) {
      const distance = Math.abs(a - b);
      if (b < a) {
        return -1 * distance;
      } else {
        return distance;
      }
    }

    this.offset.x += getOffset(canvasSize.w / 2, x);
    this.offset.y += getOffset(canvasSize.h / 2, y);
  }

  isOnPlot(x: number, y: number) {
    const xStart: number = 0 - this.offset.x;
    const yStart: number = 0 - this.offset.y;
    return xStart <= x && x <= xStart + this.size && 
           yStart <= y && y <= yStart + this.size; 
  }

}
