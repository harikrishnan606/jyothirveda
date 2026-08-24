/**
 * JyothirVeda — Panchanga (Five Limbs of Vedic Calendar)
 * 
 * Calculates: Vara (weekday), Tithi (lunar day), Nakshatra,
 * Yoga (nitya yoga), Karana.
 * 
 * All calculations based on Sun and Moon sidereal longitudes.
 */

const Panchanga = (() => {
  'use strict';

  // ─── Vara (Weekday) ───────────────────────────────────────
  const VARAS = [
    { index: 0, name: 'Ravivara', eng: 'Sunday', lord: 'Sun' },
    { index: 1, name: 'Somavara', eng: 'Monday', lord: 'Moon' },
    { index: 2, name: 'Mangalavara', eng: 'Tuesday', lord: 'Mars' },
    { index: 3, name: 'Budhavara', eng: 'Wednesday', lord: 'Mercury' },
    { index: 4, name: 'Guruvara', eng: 'Thursday', lord: 'Jupiter' },
    { index: 5, name: 'Shukravara', eng: 'Friday', lord: 'Venus' },
    { index: 6, name: 'Shanivara', eng: 'Saturday', lord: 'Saturn' }
  ];

  /**
   * Get Vara (weekday) from Julian Day.
   * JD 0 was a Monday. Formula: (JD + 1.5) mod 7
   * 0=Sun, 1=Mon, ..., 6=Sat
   */
  function getVara(jd) {
    const dayIndex = Math.floor(jd + 1.5) % 7;
    return VARAS[dayIndex];
  }

  // ─── Tithi (Lunar Day) ────────────────────────────────────
  const TITHI_NAMES = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima / Amavasya'
  ];

  /**
   * Get Tithi from Moon and Sun longitudes.
   * Tithi = (Moon - Sun) / 12°
   * Shukla Paksha: tithis 1-15 (waxing), Krishna Paksha: 16-30 (waning)
   */
  function getTithi(moonLong, sunLong) {
    let diff = moonLong - sunLong;
    if (diff < 0) diff += 360;

    const tithiIndex = Math.floor(diff / 12); // 0-29
    const tithiNum = tithiIndex + 1; // 1-30

    const paksha = tithiNum <= 15 ? 'Shukla' : 'Krishna';
    const pakshaNum = tithiNum <= 15 ? tithiNum : tithiNum - 15;
    const name = TITHI_NAMES[pakshaNum - 1];

    return {
      number: tithiNum,
      pakshaNumber: pakshaNum,
      name: `${paksha} ${name}`,
      paksha,
      tithiName: name
    };
  }

  // ─── Yoga (Nitya Yoga) ────────────────────────────────────
  const YOGA_NAMES = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];

  /**
   * Get Nitya Yoga from Moon and Sun longitudes.
   * Yoga = (Moon + Sun) / 13°20'
   */
  function getYoga(moonLong, sunLong) {
    let sum = moonLong + sunLong;
    if (sum >= 360) sum -= 360;

    const yogaIndex = Math.floor(sum / (13 + 1 / 3)); // 0-26
    return {
      index: yogaIndex + 1,
      name: YOGA_NAMES[yogaIndex]
    };
  }

  // ─── Karana (Half-Tithi) ──────────────────────────────────
  const KARANA_FIXED = ['Kimstughna', 'Shakuni', 'Chatushpada', 'Nagava'];
  const KARANA_REPEATING = [
    'Bava', 'Balava', 'Kaulava', 'Taitila',
    'Gara', 'Vanija', 'Vishti'
  ];

  /**
   * Get Karana from Moon and Sun longitudes.
   * Each Tithi has 2 Karanas. Karana = (Moon - Sun) / 6°
   * There are 60 Karanas in a month:
   *   Karana 1: Kimstughna (fixed, first half of Shukla Pratipada)
   *   Karanas 2-57: 7 repeating karanas cycle (Bava through Vishti) x 8
   *   Karanas 58-60: Shakuni, Chatushpada, Nagava (fixed)
   */
  function getKarana(moonLong, sunLong) {
    let diff = moonLong - sunLong;
    if (diff < 0) diff += 360;

    const karanaIndex = Math.floor(diff / 6); // 0-59

    let name;
    if (karanaIndex === 0) {
      name = KARANA_FIXED[0]; // Kimstughna
    } else if (karanaIndex >= 57) {
      name = KARANA_FIXED[karanaIndex - 56]; // Shakuni, Chatushpada, Nagava
    } else {
      name = KARANA_REPEATING[(karanaIndex - 1) % 7];
    }

    return {
      index: karanaIndex + 1,
      name
    };
  }

  // ─── Master Panchanga ─────────────────────────────────────
  /**
   * Build complete Panchanga.
   * @param {number} sunLong - Sidereal Sun longitude
   * @param {number} moonLong - Sidereal Moon longitude
   * @param {number} jd - Julian Day
   * @returns {Object} Complete Panchanga data
   */
  function buildPanchanga(sunLong, moonLong, jd) {
    const vara = getVara(jd);
    const tithi = getTithi(moonLong, sunLong);
    const nakshatra = VedicCore.getNakshatra(moonLong);
    const yoga = getYoga(moonLong, sunLong);
    const karana = getKarana(moonLong, sunLong);
    const moonRasi = VedicCore.getRasi(moonLong);

    return {
      vara,
      tithi,
      nakshatra,
      yoga,
      karana,
      moonRasi,
      summary: {
        varaName: vara.eng,
        tithiName: tithi.name,
        nakshatraName: `${nakshatra.name} (Pada ${nakshatra.pada})`,
        yogaName: yoga.name,
        karanaName: karana.name,
        moonRasiName: `${moonRasi.name} (${moonRasi.eng})`
      }
    };
  }

  // ─── Public API ───────────────────────────────────────────
  return {
    VARAS,
    TITHI_NAMES,
    YOGA_NAMES,
    getVara,
    getTithi,
    getYoga,
    getKarana,
    buildPanchanga
  };
})();

if (typeof window !== 'undefined') window.Panchanga = Panchanga;
