const fs = require('fs');

const astroCode = fs.readFileSync('js/astro-engine.js', 'utf8').replace('const AstroEngine =', 'global.AstroEngine =');
eval(astroCode);

const vedicCode = fs.readFileSync('js/vedic-core.js', 'utf8').replace('const VedicCore =', 'global.VedicCore =');
eval(vedicCode);

try {
  const positions = global.AstroEngine.computeAllPositions({
    year: 1991, month: 1, day: 14, hour: 9, minute: 14,
    tzOffset: 5.5, lat: 9.9312, lng: 76.2673
  });
  console.log("Positions computed.");
  
  const chart = global.VedicCore.buildChart(positions.sidereal);
  console.log("Chart built successfully.");
} catch (e) {
  console.error(e.stack);
}
