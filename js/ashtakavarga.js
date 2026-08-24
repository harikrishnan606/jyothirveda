/**
 * JyothirVeda — Ashtakavarga System
 * 
 * Implements the BPHS Ashtakavarga tables:
 * - Bhinnashtakavarga (BAV) for each of the 7 planets
 * - Sarvashtakavarga (SAV) — sum of all BAVs (must total 337)
 * - House strength scoring
 * 
 * The 8 contributors: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna
 * Rahu/Ketu are NOT included in Ashtakavarga (per classical tradition).
 * 
 * Each planet has a lookup table from BPHS specifying from which houses
 * (relative to each contributor) it receives a benefic point (bindu).
 */

const Ashtakavarga = (() => {
  'use strict';

  // ─── BPHS Benefic House Tables ────────────────────────────
  // For each planet: an object mapping each contributor to an array of
  // house numbers (1-12) from which the planet receives a bindu.
  //
  // Source: Brihat Parashara Hora Shastra, Chapter 66-72

  const BAV_TABLES = {
    Sun: {
      Sun:     [1, 2, 4, 7, 8, 9, 10, 11],
      Moon:    [3, 6, 10, 11],
      Mars:    [1, 2, 4, 7, 8, 9, 10, 11],
      Mercury: [3, 5, 6, 9, 10, 11, 12],
      Jupiter: [5, 6, 9, 11],
      Venus:   [6, 7, 12],
      Saturn:  [1, 2, 4, 7, 8, 9, 10, 11],
      Lagna:   [3, 4, 6, 10, 11, 12]
    },
    Moon: {
      Sun:     [3, 6, 7, 8, 10, 11],
      Moon:    [1, 3, 6, 7, 10, 11],
      Mars:    [2, 3, 5, 6, 9, 10, 11],
      Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
      Jupiter: [1, 4, 7, 8, 10, 11, 12],
      Venus:   [3, 4, 5, 7, 9, 10, 11],
      Saturn:  [3, 5, 6, 11],
      Lagna:   [3, 6, 10, 11]
    },
    Mars: {
      Sun:     [3, 5, 6, 10, 11],
      Moon:    [3, 6, 11],
      Mars:    [1, 2, 4, 7, 8, 10, 11],
      Mercury: [3, 5, 6, 11],
      Jupiter: [6, 10, 11, 12],
      Venus:   [6, 8, 11, 12],
      Saturn:  [1, 4, 7, 8, 9, 10, 11],
      Lagna:   [1, 3, 6, 10, 11]
    },
    Mercury: {
      Sun:     [5, 6, 9, 11, 12],
      Moon:    [2, 4, 6, 8, 10, 11],
      Mars:    [1, 2, 4, 7, 8, 9, 10, 11],
      Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
      Jupiter: [6, 8, 11, 12],
      Venus:   [1, 2, 3, 4, 5, 8, 9, 11],
      Saturn:  [1, 2, 4, 7, 8, 9, 10, 11],
      Lagna:   [1, 2, 4, 6, 8, 10, 11]
    },
    Jupiter: {
      Sun:     [1, 2, 3, 4, 7, 8, 9, 10, 11],
      Moon:    [2, 5, 7, 9, 11],
      Mars:    [1, 2, 4, 7, 8, 10, 11],
      Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
      Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
      Venus:   [2, 5, 6, 9, 10, 11],
      Saturn:  [3, 5, 6, 12],
      Lagna:   [1, 2, 4, 5, 6, 7, 9, 10, 11]
    },
    Venus: {
      Sun:     [8, 11, 12],
      Moon:    [1, 2, 3, 4, 5, 8, 9, 11, 12],
      Mars:    [3, 4, 6, 8, 9, 11, 12],
      Mercury: [3, 5, 6, 9, 11],
      Jupiter: [5, 8, 9, 10, 11],
      Venus:   [1, 2, 3, 4, 5, 8, 9, 10, 11],
      Saturn:  [3, 4, 5, 8, 9, 10, 11],
      Lagna:   [1, 2, 3, 4, 5, 8, 9, 11]
    },
    Saturn: {
      Sun:     [1, 2, 4, 7, 8, 10, 11],
      Moon:    [3, 6, 11],
      Mars:    [3, 5, 6, 10, 11, 12],
      Mercury: [6, 8, 9, 10, 11, 12],
      Jupiter: [5, 6, 11, 12],
      Venus:   [6, 11, 12],
      Saturn:  [3, 5, 6, 11],
      Lagna:   [1, 3, 4, 6, 10, 11]
    }
  };

  const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const CONTRIBUTORS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];

  // ─── BAV Computation ──────────────────────────────────────
  /**
   * Compute Bhinnashtakavarga (BAV) for one planet.
   * 
   * For each of the 12 signs, check each of the 8 contributors:
   *   - What is the house of that sign relative to the contributor's position?
   *   - Is that house number in the BAV_TABLE for the planet from that contributor?
   *   - If yes, add 1 bindu to that sign.
   * 
   * @param {string} planet - Planet name (Sun through Saturn)
   * @param {Object} rasiPositions - Map of planet/Lagna → rasi index (0-11)
   * @returns {Array} Array of 12 numbers (bindus per sign, indexed 0-11)
   */
  function computeBAV(planet, rasiPositions) {
    const table = BAV_TABLES[planet];
    if (!table) return new Array(12).fill(0);

    const bindus = new Array(12).fill(0);

    for (let sign = 0; sign < 12; sign++) {
      for (const contributor of CONTRIBUTORS) {
        const contribRasi = rasiPositions[contributor];
        if (contribRasi === undefined || contribRasi === null) continue;

        // What house is 'sign' from the contributor's position?
        const houseFromContrib = ((sign - contribRasi + 12) % 12) + 1;

        // Does this planet get a bindu from this contributor at this house?
        if (table[contributor] && table[contributor].includes(houseFromContrib)) {
          bindus[sign] += 1;
        }
      }
    }

    return bindus;
  }

  /**
   * Compute BAV for all 7 planets.
   * @param {Object} rasiPositions - Map of planet/Lagna → rasi index
   * @returns {Object} Map of planet → [12 bindus]
   */
  function computeAllBAV(rasiPositions) {
    const result = {};
    for (const planet of PLANETS) {
      result[planet] = computeBAV(planet, rasiPositions);
    }
    return result;
  }

  // ─── SAV Computation ──────────────────────────────────────
  /**
   * Compute Sarvashtakavarga (SAV) — sum of all BAVs.
   * The total across all 12 signs MUST equal 337.
   * 
   * @param {Object} allBAV - From computeAllBAV()
   * @returns {Object} { signTotals: [12], grandTotal: number, isValid: boolean }
   */
  function computeSAV(allBAV) {
    const signTotals = new Array(12).fill(0);

    for (const planet of PLANETS) {
      const bav = allBAV[planet];
      for (let i = 0; i < 12; i++) {
        signTotals[i] += bav[i];
      }
    }

    const grandTotal = signTotals.reduce((a, b) => a + b, 0);

    return {
      signTotals,
      grandTotal,
      isValid: grandTotal === 337,
      discrepancy: grandTotal !== 337 ? `Expected 337, got ${grandTotal}` : null
    };
  }

  // ─── House Strength Scoring ───────────────────────────────
  /**
   * Evaluate house strength from SAV.
   * Average per house = 337/12 ≈ 28.
   * 
   * @param {Array} savSignTotals - SAV sign totals (indexed by rasi 0-11)
   * @param {number} lagnaRasiIndex - Ascendant rasi index
   * @returns {Array} Array of 12 house strength objects
   */
  function getHouseStrengths(savSignTotals, lagnaRasiIndex) {
    const strengths = [];

    for (let house = 1; house <= 12; house++) {
      const rasiIndex = (lagnaRasiIndex + house - 1) % 12;
      const bindus = savSignTotals[rasiIndex];
      let rating;

      if (bindus >= 33) rating = 'Very Strong';
      else if (bindus >= 28) rating = 'Strong';
      else if (bindus >= 25) rating = 'Average';
      else if (bindus >= 20) rating = 'Weak';
      else rating = 'Very Weak';

      strengths.push({
        house,
        rasiIndex,
        rasi: VedicCore.RASIS[rasiIndex].name,
        bindus,
        rating,
        isAboveAverage: bindus >= 28
      });
    }

    return strengths;
  }

  // ─── Master Computation ───────────────────────────────────
  /**
   * Compute complete Ashtakavarga analysis.
   * 
   * @param {Object} chart - From VedicCore.buildChart()
   * @returns {Object} Complete Ashtakavarga data
   */
  function compute(chart) {
    // Build rasi positions map (planet → rasi index)
    const rasiPositions = {};
    for (const [planet, pData] of Object.entries(chart.planets)) {
      if (PLANETS.includes(planet)) {
        rasiPositions[planet] = pData.rasi.index;
      }
    }
    rasiPositions.Lagna = chart.lagnaRasiIndex;

    // Compute BAVs
    const allBAV = computeAllBAV(rasiPositions);

    // Compute SAV
    const sav = computeSAV(allBAV);

    // Compute house strengths
    const houseStrengths = getHouseStrengths(sav.signTotals, chart.lagnaRasiIndex);

    // Find strongest and weakest houses
    const sorted = [...houseStrengths].sort((a, b) => b.bindus - a.bindus);
    const strongest = sorted.slice(0, 3);
    const weakest = sorted.slice(-3).reverse();

    return {
      bav: allBAV,
      sav,
      houseStrengths,
      strongest,
      weakest,
      rasiPositions
    };
  }

  // ─── Public API ───────────────────────────────────────────
  return {
    BAV_TABLES,
    PLANETS,
    computeBAV,
    computeAllBAV,
    computeSAV,
    getHouseStrengths,
    compute
  };
})();

if (typeof window !== 'undefined') window.Ashtakavarga = Ashtakavarga;
