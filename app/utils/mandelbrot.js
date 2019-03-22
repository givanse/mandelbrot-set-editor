
// Fc(z) = z^2 + c
//      = (zr + zi)^2 + (cr + ci)
//      = (zr^2 + 2*zr*zi + zi^2) + (cr + ci)
//      = (zr^2 + 2*zr*zi + (zi^2 * i^2) + (cr + ci)
//      = (zr^2 + 2*zr*zi + (r^2 * -1) + (cr + ci)
//      =      real: zr^2 - r^2 + cr
//        imaginary: 2*zr*zi + ci

const math = {};
math.i = {
  pow: function(c, exponent) {
    return Math.pow(c.r, exponent) + Math.pow(c.i, exponent);
  }
};

function mandelbrot(scale = 4, maxIter, size = 400) {
  scale = 2;
  const results = [];
  let width = window.innerWidth;
  let height = window.innerHeight;
  if (width > height) {
    height = width;
  }
  if (width < height) {
    width = height;
  }
  //width = width * 4;
  //height = height * 4;
  //const width = size;
  //const height = size;

  for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const c = {
          //r: (col - width / 2) * scale / width, // -2, 2
          //i: (row - height / 2) * scale / width // -2, 2
          r: (2 * col / width) - 1, // -1, 1
          i: (2 * row / height) - 1 // -1, 1
          //r: (col * scale - scale) / width, // -1, 1
          //i: (row * scale - scale) / height // -1, 1
        };
        /*
        (col - w/2) * 2/w
        2col/w - 2w/2w
        2col/w - 1
        */
        /*
        (col - w/2) * s/w
        col*s/w - w*s/2w
        col*s/w - s/w
        ((col * s) - s)/w
        */
        const z = {r: 0, i: 0};
        let iterations = 0;
        while (math.i.pow(z, 2) < scale && iterations < maxIter) {
          const {r, i} = z;
          // Fc(z) = z^2 + c
          z.r = r*r - i*i + c.r;
          z.i = 2*r*i + c.i;
          iterations++;
        }

        const r = {
          x: col,
          y: row,
          acceleration: null,
        };

        if (iterations < maxIter) {
          // Distance is bounded,
          // It is in the Mandelbrot set
          r.acceleration = iterations;
        }

        results.push(r);
      }
  }

  return results;
}

export default mandelbrot;