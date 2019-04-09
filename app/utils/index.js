
export const math = {
  i: {
    /**
     * @param {Complex} c a complex number 
     * @return {Number} r the absolute value of complex number c
     */
    abs: function(c) { // c's distance from 0
      return Math.sqrt(c.r * c.r + c.i * c.i);
    }
  },
};

export function r255() {
  return Math.random() * (256 - 0) + 0;
}

export function distPercent(width, height, x, y) {
  const xOri = width / 2;
  const yOri = height / 2;
  const maxDist = Math.sqrt(Math.pow(xOri, 2) + Math.pow(yOri, 2)) / 2; 

  const distY = yOri < y ? y - yOri : yOri - y;
  const distX = xOri < x ? x - xOri : xOri - x;
  const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

  const distPercent = (dist * 100) / maxDist;

  return distPercent;
}