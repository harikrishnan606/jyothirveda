/**
 * JyothirVeda — Vimshottari Dasha System
 * 
 * Calculates:
 * - Balance of Dasha at birth (from Moon's Nakshatra position)
 * - Complete Maha Dasha timeline (birth → 120 years)
 * - Antar Dasha (sub-periods) within each Maha Dasha
 * - Pratyantar Dasha (sub-sub-periods)
 * - Current running Dasha at any date
 * 
 * Year length: 365.25 days (as required by prompt.md §3)
 * Total cycle: 120 years
 */

const DashaSystem = (() => {
  'use strict';

  const YEAR_DAYS = 365.25; // As specified in prompt.md §3

  // Vimshottari Dasha sequence and years
  // Order is fixed: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
  const DASHA_LORDS = [
    { planet: 'Ketu',    years: 7 },
    { planet: 'Venus',   years: 20 },
    { planet: 'Sun',     years: 6 },
    { planet: 'Moon',    years: 10 },
    { planet: 'Mars',    years: 7 },
    { planet: 'Rahu',    years: 18 },
    { planet: 'Jupiter', years: 16 },
    { planet: 'Saturn',  years: 19 },
    { planet: 'Mercury', years: 17 }
  ];

  const TOTAL_YEARS = 120; // Sum of all dasha years

  // Nakshatra lord sequence (maps each nakshatra to its Vimshottari lord)
  // Each lord governs 3 nakshatras:
  //   Ketu:    Ashwini(0), Magha(9), Mula(18)
  //   Venus:   Bharani(1), P.Phalguni(10), P.Ashadha(19)
  //   Sun:     Krittika(2), U.Phalguni(11), U.Ashadha(20)
  //   Moon:    Rohini(3), Hasta(12), Shravana(21)
  //   Mars:    Mrigashira(4), Chitra(13), Dhanishta(22)
  //   Rahu:    Ardra(5), Swati(14), Shatabhisha(23)
  //   Jupiter: Punarvasu(6), Vishakha(15), P.Bhadrapada(24)
  //   Saturn:  Pushya(7), Anuradha(16), U.Bhadrapada(25)
  //   Mercury: Ashlesha(8), Jyeshtha(17), Revati(26)
  const NAKSHATRA_LORD_SEQUENCE = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  const NAKSHATRA_SPAN = 13 + 1 / 3; // 13°20'

  // ─── Helper Functions ─────────────────────────────────────

  /**
   * Get the index of a planet in the DASHA_LORDS array.
   */
  function getDashaIndex(planetName) {
    return DASHA_LORDS.findIndex(d => d.planet === planetName);
  }

  /**
   * Get dasha years for a planet.
   */
  function getDashaYears(planetName) {
    const d = DASHA_LORDS.find(d => d.planet === planetName);
    return d ? d.years : 0;
  }

  /**
   * Convert Julian Day to a readable date string.
   */
  function jdToDate(jd) {
    // Meeus algorithm for JD → calendar date
    const z = Math.floor(jd + 0.5);
    const f = jd + 0.5 - z;
    let a;
    if (z < 2299161) {
      a = z;
    } else {
      const alpha = Math.floor((z - 1867216.25) / 36524.25);
      a = z + 1 + alpha - Math.floor(alpha / 4);
    }
    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);

    const day = b - d - Math.floor(30.6001 * e);
    const month = e < 14 ? e - 1 : e - 13;
    const year = month > 2 ? c - 4716 : c - 4715;

    return {
      year,
      month,
      day: Math.floor(day),
      dateStr: `${String(Math.floor(day)).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
    };
  }

  /**
   * Format a duration in days as "Xy Ym" string.
   */
  function formatDuration(days) {
    const years = Math.floor(days / YEAR_DAYS);
    const months = Math.floor((days - years * YEAR_DAYS) / 30.4375);
    if (years > 0 && months > 0) return `${years}y ${months}m`;
    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}m`;
    return `${Math.floor(days)}d`;
  }

  // ─── Balance of Dasha at Birth ────────────────────────────
  /**
   * Calculate the balance of Maha Dasha at birth.
   * 
   * Algorithm:
   * 1. Find Moon's Nakshatra
   * 2. The lord of that Nakshatra is the starting Maha Dasha lord
   * 3. The balance = (remaining portion of Nakshatra) × (lord's total Dasha years)
   * 
   * @param {number} moonLong - Sidereal Moon longitude (0-360°)
   * @returns {Object} { lord, totalYears, balanceYears, balanceDays, elapsed }
   */
  function getDashaBalance(moonLong) {
    const long = AstroEngine.normalize(moonLong);
    const nakshatraIndex = Math.floor(long / NAKSHATRA_SPAN);
    const degInNak = long - nakshatraIndex * NAKSHATRA_SPAN;

    // Lord of the Nakshatra
    const lordIndex = nakshatraIndex % 9;
    const lord = NAKSHATRA_LORD_SEQUENCE[lordIndex];
    const totalYears = getDashaYears(lord);

    // Proportion of Nakshatra remaining
    const proportionRemaining = (NAKSHATRA_SPAN - degInNak) / NAKSHATRA_SPAN;
    const balanceYears = totalYears * proportionRemaining;
    const balanceDays = balanceYears * YEAR_DAYS;

    return {
      lord,
      totalYears,
      balanceYears,
      balanceDays,
      elapsedYears: totalYears - balanceYears,
      proportionRemaining,
      nakshatraIndex,
      nakshatraName: VedicCore.NAKSHATRAS[nakshatraIndex].name
    };
  }

  // ─── Maha Dasha Timeline ─────────────────────────────────
  /**
   * Generate the full Maha Dasha timeline from birth.
   * 
   * @param {number} birthJD - Julian Day of birth
   * @param {number} moonLong - Sidereal Moon longitude
   * @returns {Array} Array of Maha Dasha periods with start/end JD and dates
   */
  function getMahaDashaTimeline(birthJD, moonLong) {
    const balance = getDashaBalance(moonLong);
    const startLordIndex = getDashaIndex(balance.lord);

    const timeline = [];
    let currentJD = birthJD;

    // First Maha Dasha (partial — only the balance remains)
    const firstEndJD = currentJD + balance.balanceDays;
    timeline.push({
      lord: balance.lord,
      startJD: currentJD,
      endJD: firstEndJD,
      startDate: jdToDate(currentJD),
      endDate: jdToDate(firstEndJD),
      durationDays: balance.balanceDays,
      durationStr: formatDuration(balance.balanceDays),
      totalYears: balance.totalYears,
      isPartial: true
    });
    currentJD = firstEndJD;

    // Subsequent full Maha Dashas (cycle through the sequence)
    for (let i = 1; i <= 9; i++) {
      const lordIndex = (startLordIndex + i) % 9;
      const lord = DASHA_LORDS[lordIndex];
      const durationDays = lord.years * YEAR_DAYS;
      const endJD = currentJD + durationDays;

      timeline.push({
        lord: lord.planet,
        startJD: currentJD,
        endJD: endJD,
        startDate: jdToDate(currentJD),
        endDate: jdToDate(endJD),
        durationDays,
        durationStr: formatDuration(durationDays),
        totalYears: lord.years,
        isPartial: false
      });
      currentJD = endJD;
    }

    return timeline;
  }

  // ─── Antar Dasha (Sub-Periods) ────────────────────────────
  /**
   * Calculate Antar Dasha periods within a Maha Dasha.
   * 
   * The proportion of each Antar Dasha within a Maha Dasha is:
   *   antarDuration = (antarLordYears / 120) × mahaDurationDays
   * 
   * The sequence starts from the Maha Dasha lord itself.
   * 
   * @param {Object} mahaDasha - A single Maha Dasha entry from the timeline
   * @returns {Array} Array of Antar Dasha periods
   */
  function getAntarDasha(mahaDasha) {
    const mahaIndex = getDashaIndex(mahaDasha.lord);
    const antars = [];
    let currentJD = mahaDasha.startJD;

    for (let i = 0; i < 9; i++) {
      const antarIndex = (mahaIndex + i) % 9;
      const antarLord = DASHA_LORDS[antarIndex];
      const durationDays = (antarLord.years / TOTAL_YEARS) * mahaDasha.durationDays;
      const endJD = currentJD + durationDays;

      antars.push({
        lord: antarLord.planet,
        mahaLord: mahaDasha.lord,
        startJD: currentJD,
        endJD: endJD,
        startDate: jdToDate(currentJD),
        endDate: jdToDate(endJD),
        durationDays,
        durationStr: formatDuration(durationDays),
        label: `${mahaDasha.lord}/${antarLord.planet}`
      });
      currentJD = endJD;
    }

    return antars;
  }

  // ─── Pratyantar Dasha (Sub-Sub-Periods) ───────────────────
  /**
   * Calculate Pratyantar Dasha periods within an Antar Dasha.
   * Same proportional logic as Antar within Maha.
   */
  function getPratyantarDasha(antarDasha) {
    const antarIndex = getDashaIndex(antarDasha.lord);
    const pratyantars = [];
    let currentJD = antarDasha.startJD;

    for (let i = 0; i < 9; i++) {
      const pratIndex = (antarIndex + i) % 9;
      const pratLord = DASHA_LORDS[pratIndex];
      const durationDays = (pratLord.years / TOTAL_YEARS) * antarDasha.durationDays;
      const endJD = currentJD + durationDays;

      pratyantars.push({
        lord: pratLord.planet,
        antarLord: antarDasha.lord,
        mahaLord: antarDasha.mahaLord,
        startJD: currentJD,
        endJD: endJD,
        startDate: jdToDate(currentJD),
        endDate: jdToDate(endJD),
        durationDays,
        durationStr: formatDuration(durationDays),
        label: `${antarDasha.mahaLord}/${antarDasha.lord}/${pratLord.planet}`
      });
      currentJD = endJD;
    }

    return pratyantars;
  }

  // ─── Current Dasha ────────────────────────────────────────
  /**
   * Find the current running Dasha at a given date.
   * 
   * @param {number} birthJD - Julian Day of birth
   * @param {number} moonLong - Sidereal Moon longitude
   * @param {number} currentJD - Julian Day to check
   * @returns {Object} { maha, antar, pratyantar } with details
   */
  function getCurrentDasha(birthJD, moonLong, currentJD) {
    const timeline = getMahaDashaTimeline(birthJD, moonLong);

    // Find current Maha Dasha
    let currentMaha = null;
    for (const maha of timeline) {
      if (currentJD >= maha.startJD && currentJD < maha.endJD) {
        currentMaha = maha;
        break;
      }
    }

    if (!currentMaha) {
      // Beyond 120-year cycle
      currentMaha = timeline[timeline.length - 1];
    }

    // Find current Antar Dasha
    const antars = getAntarDasha(currentMaha);
    let currentAntar = null;
    for (const antar of antars) {
      if (currentJD >= antar.startJD && currentJD < antar.endJD) {
        currentAntar = antar;
        break;
      }
    }

    if (!currentAntar) {
      currentAntar = antars[antars.length - 1];
    }

    // Find current Pratyantar Dasha
    const pratyantars = getPratyantarDasha(currentAntar);
    let currentPratyantar = null;
    for (const prat of pratyantars) {
      if (currentJD >= prat.startJD && currentJD < prat.endJD) {
        currentPratyantar = prat;
        break;
      }
    }

    if (!currentPratyantar) {
      currentPratyantar = pratyantars[pratyantars.length - 1];
    }

    // Calculate remaining time in Maha Dasha
    const remainingDays = currentMaha.endJD - currentJD;
    const remainingStr = formatDuration(remainingDays);

    return {
      maha: {
        lord: currentMaha.lord,
        startDate: currentMaha.startDate.dateStr,
        endDate: currentMaha.endDate.dateStr,
        remaining: remainingStr
      },
      antar: {
        lord: currentAntar.lord,
        label: currentAntar.label,
        startDate: currentAntar.startDate.dateStr,
        endDate: currentAntar.endDate.dateStr
      },
      pratyantar: {
        lord: currentPratyantar.lord,
        label: currentPratyantar.label,
        startDate: currentPratyantar.startDate.dateStr,
        endDate: currentPratyantar.endDate.dateStr
      },
      summary: `${currentMaha.lord} Dasha (${remainingStr} remaining)`
    };
  }

  // ─── Public API ───────────────────────────────────────────
  return {
    DASHA_LORDS,
    TOTAL_YEARS,
    getDashaBalance,
    getMahaDashaTimeline,
    getAntarDasha,
    getPratyantarDasha,
    getCurrentDasha,
    jdToDate,
    formatDuration
  };
})();

if (typeof window !== 'undefined') window.DashaSystem = DashaSystem;
