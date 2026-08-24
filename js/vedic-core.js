/**
 * JyothirVeda — Vedic Astrology Core
 * 
 * Maps astronomical positions to Vedic astrology concepts:
 * Rasis, Nakshatras, Houses, Dignity, Divisional Charts, Aspects.
 * 
 * House system: Whole-sign (Rāśi = Bhāva) — Kerala standard.
 */

const VedicCore = (() => {
  'use strict';

  // ─── Rasi (Zodiac Sign) Constants ─────────────────────────
  const RASIS = [
    { index: 0, name: 'Mesha', eng: 'Aries', lord: 'Mars', element: 'Fire', quality: 'Movable' },
    { index: 1, name: 'Vrishabha', eng: 'Taurus', lord: 'Venus', element: 'Earth', quality: 'Fixed' },
    { index: 2, name: 'Mithuna', eng: 'Gemini', lord: 'Mercury', element: 'Air', quality: 'Dual' },
    { index: 3, name: 'Karkataka', eng: 'Cancer', lord: 'Moon', element: 'Water', quality: 'Movable' },
    { index: 4, name: 'Simha', eng: 'Leo', lord: 'Sun', element: 'Fire', quality: 'Fixed' },
    { index: 5, name: 'Kanya', eng: 'Virgo', lord: 'Mercury', element: 'Earth', quality: 'Dual' },
    { index: 6, name: 'Tula', eng: 'Libra', lord: 'Venus', element: 'Air', quality: 'Movable' },
    { index: 7, name: 'Vrischika', eng: 'Scorpio', lord: 'Mars', element: 'Water', quality: 'Fixed' },
    { index: 8, name: 'Dhanus', eng: 'Sagittarius', lord: 'Jupiter', element: 'Fire', quality: 'Dual' },
    { index: 9, name: 'Makara', eng: 'Capricorn', lord: 'Saturn', element: 'Earth', quality: 'Movable' },
    { index: 10, name: 'Kumbha', eng: 'Aquarius', lord: 'Saturn', element: 'Air', quality: 'Fixed' },
    { index: 11, name: 'Meena', eng: 'Pisces', lord: 'Jupiter', element: 'Water', quality: 'Dual' }
  ];

  // ─── Nakshatra Constants ──────────────────────────────────
  // Each nakshatra spans 13°20' (13.3333°)
  const NAKSHATRAS = [
    { index: 0, name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', start: 0 },
    { index: 1, name: 'Bharani', lord: 'Venus', deity: 'Yama', start: 13.3333 },
    { index: 2, name: 'Krittika', lord: 'Sun', deity: 'Agni', start: 26.6667 },
    { index: 3, name: 'Rohini', lord: 'Moon', deity: 'Brahma', start: 40 },
    { index: 4, name: 'Mrigashira', lord: 'Mars', deity: 'Soma', start: 53.3333 },
    { index: 5, name: 'Ardra', lord: 'Rahu', deity: 'Rudra', start: 66.6667 },
    { index: 6, name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', start: 80 },
    { index: 7, name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', start: 93.3333 },
    { index: 8, name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpa', start: 106.6667 },
    { index: 9, name: 'Magha', lord: 'Ketu', deity: 'Pitrs', start: 120 },
    { index: 10, name: 'Purva Phalguni', lord: 'Venus', deity: 'Aryaman', start: 133.3333 },
    { index: 11, name: 'Uttara Phalguni', lord: 'Sun', deity: 'Bhaga', start: 146.6667 },
    { index: 12, name: 'Hasta', lord: 'Moon', deity: 'Savitar', start: 160 },
    { index: 13, name: 'Chitra', lord: 'Mars', deity: 'Tvashtar', start: 173.3333 },
    { index: 14, name: 'Swati', lord: 'Rahu', deity: 'Vayu', start: 186.6667 },
    { index: 15, name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni', start: 200 },
    { index: 16, name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', start: 213.3333 },
    { index: 17, name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', start: 226.6667 },
    { index: 18, name: 'Mula', lord: 'Ketu', deity: 'Nirriti', start: 240 },
    { index: 19, name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', start: 253.3333 },
    { index: 20, name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvedevas', start: 266.6667 },
    { index: 21, name: 'Shravana', lord: 'Moon', deity: 'Vishnu', start: 280 },
    { index: 22, name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', start: 293.3333 },
    { index: 23, name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', start: 306.6667 },
    { index: 24, name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', start: 320 },
    { index: 25, name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', start: 333.3333 },
    { index: 26, name: 'Revati', lord: 'Mercury', deity: 'Pushan', start: 346.6667 }
  ];

  const NAKSHATRA_SPAN = 13 + 1/3; // 13°20'
  const PADA_SPAN = 10 / 3;         // 3°20'

  // ─── Dignity Tables ───────────────────────────────────────
  // Exaltation degrees (sidereal)
  const EXALTATION = {
    Sun: { rasi: 0, degree: 10 },     // Aries 10°
    Moon: { rasi: 1, degree: 3 },     // Taurus 3°
    Mars: { rasi: 9, degree: 28 },    // Capricorn 28°
    Mercury: { rasi: 5, degree: 15 }, // Virgo 15°
    Jupiter: { rasi: 3, degree: 5 },  // Cancer 5°
    Venus: { rasi: 11, degree: 27 },  // Pisces 27°
    Saturn: { rasi: 6, degree: 20 },  // Libra 20°
    Rahu: { rasi: 1, degree: 20 },    // Taurus 20° (traditional)
    Ketu: { rasi: 7, degree: 20 }     // Scorpio 20° (traditional)
  };

  // Debilitation (opposite of exaltation)
  const DEBILITATION = {
    Sun: { rasi: 6 },      // Libra
    Moon: { rasi: 7 },     // Scorpio
    Mars: { rasi: 3 },     // Cancer
    Mercury: { rasi: 11 }, // Pisces
    Jupiter: { rasi: 9 },  // Capricorn
    Venus: { rasi: 5 },    // Virgo
    Saturn: { rasi: 0 },   // Aries
    Rahu: { rasi: 7 },     // Scorpio
    Ketu: { rasi: 1 }      // Taurus
  };

  // Own signs
  const OWN_SIGNS = {
    Sun: [4],               // Leo
    Moon: [3],              // Cancer
    Mars: [0, 7],           // Aries, Scorpio
    Mercury: [2, 5],        // Gemini, Virgo
    Jupiter: [8, 11],       // Sagittarius, Pisces
    Venus: [1, 6],          // Taurus, Libra
    Saturn: [9, 10],        // Capricorn, Aquarius
    Rahu: [10],             // Aquarius (traditional)
    Ketu: [7]               // Scorpio (traditional)
  };

  // Moolatrikona signs and degree ranges
  const MOOLATRIKONA = {
    Sun: { rasi: 4, from: 0, to: 20 },       // Leo 0-20°
    Moon: { rasi: 1, from: 3, to: 30 },      // Taurus 3-30°
    Mars: { rasi: 0, from: 0, to: 12 },      // Aries 0-12°
    Mercury: { rasi: 5, from: 15, to: 20 },  // Virgo 15-20°
    Jupiter: { rasi: 8, from: 0, to: 10 },   // Sagittarius 0-10°
    Venus: { rasi: 6, from: 0, to: 15 },     // Libra 0-15°
    Saturn: { rasi: 10, from: 0, to: 20 }    // Aquarius 0-20°
  };

  // Planetary friendships (natural)
  const FRIENDSHIPS = {
    Sun:     { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'], neutral: ['Mercury'] },
    Moon:    { friends: ['Sun', 'Mercury'], enemies: [], neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'] },
    Mars:    { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'], neutral: ['Venus', 'Saturn'] },
    Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'], neutral: ['Mars', 'Jupiter', 'Saturn'] },
    Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'], neutral: ['Saturn'] },
    Venus:   { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'], neutral: ['Mars', 'Jupiter'] },
    Saturn:  { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'], neutral: ['Jupiter'] }
  };

  // Planet abbreviations for chart display
  const PLANET_ABBREV = {
    Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
    Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke'
  };

  // ─── Core Functions ───────────────────────────────────────

  /**
   * Get Rasi (zodiac sign) from sidereal longitude.
   * @param {number} siderealLong - Sidereal longitude 0-360°
   * @returns {Object} { index, name, eng, lord, degree, element, quality }
   */
  function getRasi(siderealLong) {
    const long = AstroEngine.normalize(siderealLong);
    const index = Math.floor(long / 30);
    const degree = long - index * 30;
    return { ...RASIS[index], degree };
  }

  /**
   * Get Nakshatra from sidereal longitude.
   * @param {number} siderealLong
   * @returns {Object} { index, name, lord, deity, pada, degreeInNakshatra }
   */
  function getNakshatra(siderealLong) {
    const long = AstroEngine.normalize(siderealLong);
    const index = Math.floor(long / NAKSHATRA_SPAN);
    const degInNak = long - index * NAKSHATRA_SPAN;
    const pada = Math.floor(degInNak / PADA_SPAN) + 1;
    return { ...NAKSHATRAS[index], pada: Math.min(pada, 4), degreeInNakshatra: degInNak };
  }

  /**
   * Get house number (1-12) using whole-sign system.
   * @param {number} planetRasiIndex - Rasi index of the planet (0-11)
   * @param {number} lagnaRasiIndex - Rasi index of the Ascendant (0-11)
   * @returns {number} House number 1-12
   */
  function getHouse(planetRasiIndex, lagnaRasiIndex) {
    return ((planetRasiIndex - lagnaRasiIndex + 12) % 12) + 1;
  }

  /**
   * Get planetary dignity.
   * @returns {string} 'Exalted' | 'Moolatrikona' | 'Own' | 'Friend' | 'Neutral' | 'Enemy' | 'Debilitated'
   */
  function getDignity(planet, rasiIndex, degree) {
    // Check exaltation
    if (EXALTATION[planet] && EXALTATION[planet].rasi === rasiIndex) {
      return 'Exalted';
    }

    // Check debilitation
    if (DEBILITATION[planet] && DEBILITATION[planet].rasi === rasiIndex) {
      return 'Debilitated';
    }

    // Check Moolatrikona
    if (MOOLATRIKONA[planet]) {
      const mt = MOOLATRIKONA[planet];
      if (mt.rasi === rasiIndex && degree >= mt.from && degree <= mt.to) {
        return 'Moolatrikona';
      }
    }

    // Check own sign
    if (OWN_SIGNS[planet] && OWN_SIGNS[planet].includes(rasiIndex)) {
      return 'Own';
    }

    // Check friendship with sign lord
    const signLord = RASIS[rasiIndex].lord;
    if (FRIENDSHIPS[planet]) {
      if (FRIENDSHIPS[planet].friends.includes(signLord)) return 'Friend';
      if (FRIENDSHIPS[planet].enemies.includes(signLord)) return 'Enemy';
    }

    return 'Neutral';
  }

  /**
   * Get which planet rules a given house.
   * @param {number} houseNum - 1-12
   * @param {number} lagnaRasiIndex - 0-11
   * @returns {string} Planet name
   */
  function getLordOf(houseNum, lagnaRasiIndex) {
    const rasiIndex = (lagnaRasiIndex + houseNum - 1) % 12;
    return RASIS[rasiIndex].lord;
  }

  // ─── Divisional Charts ────────────────────────────────────

  /**
   * Calculate Navamsa (D9) position.
   * Each navamsa = 3°20' (3.3333°). 9 navamsas per sign.
   * Navamsa rasi cycles: Fire signs start from Aries,
   * Earth from Capricorn, Air from Libra, Water from Cancer.
   */
  function getNavamsa(siderealLong) {
    const long = AstroEngine.normalize(siderealLong);
    const rasiIndex = Math.floor(long / 30);
    const degInRasi = long - rasiIndex * 30;
    const navamsaInSign = Math.floor(degInRasi / (30 / 9)); // 0-8

    // Starting rasi for navamsa depends on element of the sign
    const element = RASIS[rasiIndex].element;
    let startRasi;
    switch (element) {
      case 'Fire':  startRasi = 0; break;  // Aries
      case 'Earth': startRasi = 9; break;  // Capricorn
      case 'Air':   startRasi = 6; break;  // Libra
      case 'Water': startRasi = 3; break;  // Cancer
      default:      startRasi = 0;
    }

    const navamsaRasi = (startRasi + navamsaInSign) % 12;
    return { rasiIndex: navamsaRasi, ...RASIS[navamsaRasi] };
  }

  /**
   * Calculate Dasamsa (D10) position.
   * Each dasamsa = 3° (10 per sign).
   * Odd signs: count from same sign. Even signs: count from 9th sign.
   */
  function getDasamsa(siderealLong) {
    const long = AstroEngine.normalize(siderealLong);
    const rasiIndex = Math.floor(long / 30);
    const degInRasi = long - rasiIndex * 30;
    const dasamsaInSign = Math.floor(degInRasi / 3); // 0-9

    const isOdd = (rasiIndex % 2 === 0); // 0-indexed: 0=Aries(odd), 1=Taurus(even)
    const startRasi = isOdd ? rasiIndex : (rasiIndex + 8) % 12;
    const dasamsaRasi = (startRasi + dasamsaInSign) % 12;

    return { rasiIndex: dasamsaRasi, ...RASIS[dasamsaRasi] };
  }

  // ─── Vedic Aspects ────────────────────────────────────────
  /**
   * Get all houses aspected by a planet from a given house.
   * Standard Vedic aspects:
   *   All planets: 7th house from them
   *   Mars: additional 4th and 8th
   *   Jupiter: additional 5th and 9th
   *   Saturn: additional 3rd and 10th
   *   Rahu/Ketu: same as Saturn (some traditions)
   */
  function getAspects(planet, houseFrom) {
    const aspects = [];
    // All planets aspect the 7th
    aspects.push(((houseFrom - 1 + 6) % 12) + 1);

    if (planet === 'Mars') {
      aspects.push(((houseFrom - 1 + 3) % 12) + 1); // 4th
      aspects.push(((houseFrom - 1 + 7) % 12) + 1); // 8th
    } else if (planet === 'Jupiter') {
      aspects.push(((houseFrom - 1 + 4) % 12) + 1); // 5th
      aspects.push(((houseFrom - 1 + 8) % 12) + 1); // 9th
    } else if (planet === 'Saturn') {
      aspects.push(((houseFrom - 1 + 2) % 12) + 1); // 3rd
      aspects.push(((houseFrom - 1 + 9) % 12) + 1); // 10th
    } else if (planet === 'Rahu' || planet === 'Ketu') {
      aspects.push(((houseFrom - 1 + 4) % 12) + 1); // 5th
      aspects.push(((houseFrom - 1 + 8) % 12) + 1); // 9th
    }

    return aspects;
  }

  // ─── Chart Builder ────────────────────────────────────────
  /**
   * Build complete D1 (Rasi) chart.
   * @param {Object} positions - From AstroEngine.computeAllPositions().sidereal
   * @returns {Object} Full chart object
   */
  function buildChart(positions) {
    const lagnaRasi = getRasi(positions.Ascendant);
    const lagnaRasiIndex = lagnaRasi.index;

    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    // Build planet data
    const planetData = {};
    for (const planet of planets) {
      const long = positions[planet];
      const rasi = getRasi(long);
      const nak = getNakshatra(long);
      const house = getHouse(rasi.index, lagnaRasiIndex);
      const dignity = getDignity(planet, rasi.index, rasi.degree);
      const navamsa = getNavamsa(long);
      const dasamsa = getDasamsa(long);
      const aspectsHouses = getAspects(planet, house);

      planetData[planet] = {
        longitude: long,
        rasi,
        nakshatra: nak,
        house,
        dignity,
        navamsa,
        dasamsa,
        aspects: aspectsHouses,
        abbrev: PLANET_ABBREV[planet]
      };
    }

    // Build house data (1-12)
    const houses = {};
    for (let h = 1; h <= 12; h++) {
      const houseRasiIndex = (lagnaRasiIndex + h - 1) % 12;
      const houseRasi = RASIS[houseRasiIndex];
      const lord = houseRasi.lord;
      const lordData = planetData[lord];

      // Find occupants
      const occupants = [];
      for (const [pName, pData] of Object.entries(planetData)) {
        if (pData.house === h) {
          occupants.push(pName);
        }
      }

      // Find aspecters
      const aspectedBy = [];
      for (const [pName, pData] of Object.entries(planetData)) {
        if (pData.aspects.includes(h)) {
          aspectedBy.push(pName);
        }
      }

      houses[h] = {
        number: h,
        rasiIndex: houseRasiIndex,
        rasi: houseRasi,
        lord,
        lordHouse: lordData ? lordData.house : null,
        occupants,
        aspectedBy
      };
    }

    return {
      lagnaRasi,
      lagnaRasiIndex,
      lagnaLongitude: positions.Ascendant,
      planets: planetData,
      houses,
      lagnaNakshatra: getNakshatra(positions.Ascendant)
    };
  }

  /**
   * Build Navamsa (D9) chart.
   */
  function buildNavamsaChart(positions) {
    // For navamsa, we calculate each planet's navamsa rasi
    // and treat that as a "virtual rasi" to build a chart structure
    const lagnaNavamsa = getNavamsa(positions.Ascendant);
    const lagnaRasiIndex = lagnaNavamsa.rasiIndex;

    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    const planetData = {};
    for (const planet of planets) {
      const navamsa = getNavamsa(positions[planet]);
      const house = getHouse(navamsa.rasiIndex, lagnaRasiIndex);
      planetData[planet] = {
        rasi: RASIS[navamsa.rasiIndex],
        rasiIndex: navamsa.rasiIndex,
        house,
        abbrev: PLANET_ABBREV[planet]
      };
    }

    // Build house data
    const houses = {};
    for (let h = 1; h <= 12; h++) {
      const houseRasiIndex = (lagnaRasiIndex + h - 1) % 12;
      const occupants = [];
      for (const [pName, pData] of Object.entries(planetData)) {
        if (pData.house === h) {
          occupants.push(pName);
        }
      }
      houses[h] = {
        number: h,
        rasiIndex: houseRasiIndex,
        rasi: RASIS[houseRasiIndex],
        lord: RASIS[houseRasiIndex].lord,
        occupants
      };
    }

    return {
      lagnaRasi: RASIS[lagnaRasiIndex],
      lagnaRasiIndex,
      planets: planetData,
      houses
    };
  }

  /**
   * Build South-Indian grid layout for the Rasi chart (or Navamsa).
   * Maps to the existing rasiGridMap format in the UI.
   * 
   * South Indian layout (fixed signs):
   *   Pisces(12)  | Aries(1)    | Taurus(2)   | Gemini(3)
   *   Aquarius(11)|             |             | Cancer(4)
   *   Capricorn(10)|            |             | Leo(5)
   *   Sagittarius(9)| Scorpio(8)| Libra(7)   | Virgo(6)
   */
  function buildRasiGrid(chart) {
    const gridPositions = [
      { rasiIndex: 11, row: 1, col: 1 }, // Pisces
      { rasiIndex: 0,  row: 1, col: 2 }, // Aries
      { rasiIndex: 1,  row: 1, col: 3 }, // Taurus
      { rasiIndex: 2,  row: 1, col: 4 }, // Gemini
      { rasiIndex: 3,  row: 2, col: 4 }, // Cancer
      { rasiIndex: 4,  row: 3, col: 4 }, // Leo
      { rasiIndex: 5,  row: 4, col: 4 }, // Virgo
      { rasiIndex: 6,  row: 4, col: 3 }, // Libra
      { rasiIndex: 7,  row: 4, col: 2 }, // Scorpio
      { rasiIndex: 8,  row: 4, col: 1 }, // Sagittarius
      { rasiIndex: 9,  row: 3, col: 1 }, // Capricorn
      { rasiIndex: 10, row: 2, col: 1 }, // Aquarius
    ];

    return gridPositions.map(pos => {
      const rasi = RASIS[pos.rasiIndex];
      const house = getHouse(pos.rasiIndex, chart.lagnaRasiIndex);
      const isLagnam = pos.rasiIndex === chart.lagnaRasiIndex;

      // Get planets in this sign
      const planetsInSign = [];
      for (const [pName, pData] of Object.entries(chart.planets)) {
        const pRasi = pData.rasi ? pData.rasi.index : pData.rasiIndex;
        if (pRasi === pos.rasiIndex) {
          const retro = pData.retrograde || (pName === 'Rahu' || pName === 'Ketu');
          planetsInSign.push({
            name: pName,
            abbrev: PLANET_ABBREV[pName],
            retro
          });
        }
      }

      const planetsStr = planetsInSign.map(p =>
        p.retro && p.name !== 'Rahu' && p.name !== 'Ketu'
          ? `${p.abbrev} (R)` : p.abbrev
      ).join(', ');

      return {
        id: pos.rasiIndex + 1,
        row: pos.row,
        col: pos.col,
        label: rasi.name,
        eng: rasi.eng,
        planets: planetsStr,
        planetObjects: planetsInSign,
        house,
        isLagnam,
        lord: rasi.lord
      };
    });
  }

  // ─── Public API ───────────────────────────────────────────
  return {
    RASIS,
    NAKSHATRAS,
    PLANET_ABBREV,
    EXALTATION,
    DEBILITATION,
    OWN_SIGNS,
    MOOLATRIKONA,
    FRIENDSHIPS,
    getRasi,
    getNakshatra,
    getHouse,
    getDignity,
    getLordOf,
    getNavamsa,
    getDasamsa,
    getAspects,
    buildChart,
    buildNavamsaChart,
    buildRasiGrid
  };
})();

if (typeof window !== 'undefined') window.VedicCore = VedicCore;
