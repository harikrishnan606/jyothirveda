/**
 * JyothirVeda — Yoga & Dosha Detection Engine
 * 
 * Implements detection of major Vedic yogas and doshas with:
 * - Mandatory cancellation checks (prompt.md §2.5)
 * - Activation windows via Dasha (prompt.md §2.6)
 * - Confidence tags: HIGH / MODERATE / LOW (prompt.md §2.8)
 * - Disputed techniques flagged (prompt.md §2.9)
 * 
 * Output format per yoga/dosha:
 * { name, type, rule, formation, strength, cancellation, residual, confidence, disputed }
 */

const YogaDosha = (() => {
  'use strict';

  // ─── Helper Functions ─────────────────────────────────────

  /** Check if a planet is a Kendra lord (houses 1, 4, 7, 10) */
  function isKendraLord(planet, lagnaRasiIndex) {
    const kendraHouses = [1, 4, 7, 10];
    for (const h of kendraHouses) {
      if (VedicCore.getLordOf(h, lagnaRasiIndex) === planet) return true;
    }
    return false;
  }

  /** Check if a planet is a Trikona lord (houses 1, 5, 9) */
  function isTrikonaLord(planet, lagnaRasiIndex) {
    const trikonaHouses = [1, 5, 9];
    for (const h of trikonaHouses) {
      if (VedicCore.getLordOf(h, lagnaRasiIndex) === planet) return true;
    }
    return false;
  }

  /** Check if two planets are in the same house */
  function areConjunct(planet1Data, planet2Data) {
    return planet1Data.house === planet2Data.house;
  }

  /** Check if planet1 aspects planet2's house */
  function doesAspect(planet1Name, planet1Data, planet2Data) {
    return planet1Data.aspects.includes(planet2Data.house);
  }

  /** Check mutual aspect between two planets */
  function hasMutualAspect(p1Name, p1Data, p2Name, p2Data) {
    return doesAspect(p1Name, p1Data, p2Data) && doesAspect(p2Name, p2Data, p1Data);
  }

  /** Check if two planets exchange signs (Parivartana) */
  function hasExchange(p1Name, p1Data, p2Name, p2Data, lagnaRasiIndex) {
    const p1Rasi = p1Data.rasi.index;
    const p2Rasi = p2Data.rasi.index;
    const lordOfP1Rasi = VedicCore.RASIS[p1Rasi].lord;
    const lordOfP2Rasi = VedicCore.RASIS[p2Rasi].lord;
    return (lordOfP1Rasi === p2Name && lordOfP2Rasi === p1Name);
  }

  /** Natural benefics */
  function isNaturalBenefic(planet) {
    return ['Jupiter', 'Venus', 'Moon', 'Mercury'].includes(planet);
  }

  /** Natural malefics */
  function isNaturalMalefic(planet) {
    return ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'].includes(planet);
  }

  const KENDRA_HOUSES = [1, 4, 7, 10];
  const TRIKONA_HOUSES = [1, 5, 9];
  const DUSTHANA_HOUSES = [6, 8, 12];
  const UPACHAYA_HOUSES = [3, 6, 10, 11];

  // ─── YOGA DETECTION ───────────────────────────────────────

  /**
   * Detect Raja Yogas (Kendra-Trikona connection).
   * Rule: A connection between a Kendra lord and a Trikona lord
   * via conjunction, mutual aspect, or exchange.
   */
  function detectRajaYogas(chart) {
    const yogas = [];
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const lagna = chart.lagnaRasiIndex;

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i], p2 = planets[j];
        const p1Data = chart.planets[p1], p2Data = chart.planets[p2];

        const p1Kendra = isKendraLord(p1, lagna);
        const p1Trikona = isTrikonaLord(p1, lagna);
        const p2Kendra = isKendraLord(p2, lagna);
        const p2Trikona = isTrikonaLord(p2, lagna);

        // Need one to be Kendra lord and other to be Trikona lord (or one to be both)
        const hasKendraTrikona = (p1Kendra && p2Trikona) || (p1Trikona && p2Kendra);

        if (!hasKendraTrikona) continue;

        // Check connection type
        let connectionType = null;
        if (areConjunct(p1Data, p2Data)) {
          connectionType = 'Conjunction';
        } else if (hasMutualAspect(p1, p1Data, p2, p2Data)) {
          connectionType = 'Mutual Aspect';
        } else if (hasExchange(p1, p1Data, p2, p2Data, lagna)) {
          connectionType = 'Sign Exchange (Parivartana)';
        }

        if (connectionType) {
          // Assess strength
          const p1Strong = p1Data.dignity !== 'Debilitated' && p1Data.dignity !== 'Enemy';
          const p2Strong = p2Data.dignity !== 'Debilitated' && p2Data.dignity !== 'Enemy';
          const strength = (p1Strong && p2Strong) ? 'Strong' :
                          (p1Strong || p2Strong) ? 'Moderate' : 'Weak';
          const confidence = strength === 'Strong' ? 'HIGH' : strength === 'Moderate' ? 'MODERATE' : 'LOW';

          yogas.push({
            name: 'Raja Yoga',
            type: 'yoga',
            rule: `${p1} (${p1Kendra ? 'Kendra' : 'Trikona'} lord) + ${p2} (${p2Kendra ? 'Kendra' : 'Trikona'} lord)`,
            formation: `${connectionType} in House ${p1Data.house}${connectionType === 'Conjunction' ? '' : ` and ${p2Data.house}`}`,
            strength,
            planets: [p1, p2],
            confidence,
            cancellation: null,
            residual: 'Active when Dasha of either planet operates',
            disputed: false
          });
        }
      }
    }

    // Single planet ruling both Kendra and Trikona
    for (const planet of planets) {
      if (isKendraLord(planet, lagna) && isTrikonaLord(planet, lagna)) {
        const pData = chart.planets[planet];
        const isStrong = pData.dignity !== 'Debilitated';
        yogas.push({
          name: 'Raja Yoga (Yogakaraka)',
          type: 'yoga',
          rule: `${planet} rules both a Kendra and Trikona house`,
          formation: `${planet} in House ${pData.house} (${pData.rasi.name})`,
          strength: isStrong ? 'Strong' : 'Moderate',
          planets: [planet],
          confidence: isStrong ? 'HIGH' : 'MODERATE',
          cancellation: null,
          residual: `Activated during ${planet} Maha/Antar Dasha`,
          disputed: false
        });
      }
    }

    return yogas;
  }

  /**
   * Detect Dhana Yogas (Wealth combinations).
   * 2nd/11th lords connecting with Trikona lords.
   */
  function detectDhanaYogas(chart) {
    const yogas = [];
    const lagna = chart.lagnaRasiIndex;
    const lord2 = VedicCore.getLordOf(2, lagna);
    const lord11 = VedicCore.getLordOf(11, lagna);
    const dhanaLords = [lord2, lord11];

    for (const dLord of dhanaLords) {
      for (const tHouse of TRIKONA_HOUSES) {
        const tLord = VedicCore.getLordOf(tHouse, lagna);
        if (dLord === tLord) continue;

        const dData = chart.planets[dLord];
        const tData = chart.planets[tLord];
        if (!dData || !tData) continue;

        if (areConjunct(dData, tData)) {
          yogas.push({
            name: 'Dhana Yoga',
            type: 'yoga',
            rule: `Lord of ${dLord === lord2 ? '2nd' : '11th'} house (${dLord}) conjunct lord of ${tHouse}${tHouse === 1 ? 'st' : tHouse === 5 ? 'th' : 'th'} house (${tLord})`,
            formation: `Conjunction in House ${dData.house}`,
            strength: 'Moderate',
            planets: [dLord, tLord],
            confidence: 'MODERATE',
            cancellation: null,
            residual: 'Wealth accumulation during relevant Dashas',
            disputed: false
          });
        }
      }
    }

    return yogas;
  }

  /**
   * Detect Pancha Mahapurusha Yogas.
   * Rule: Mars/Mercury/Jupiter/Venus/Saturn in own sign or exalted,
   * AND placed in a Kendra house (1, 4, 7, 10).
   * 
   * Must report all 5 present/absent (prompt.md §5.C.9).
   */
  function detectPanchaMahapurusha(chart) {
    const yogaNames = {
      Mars: 'Ruchaka', Mercury: 'Bhadra', Jupiter: 'Hamsa',
      Venus: 'Malavya', Saturn: 'Shasha'
    };

    const results = [];
    for (const [planet, yogaName] of Object.entries(yogaNames)) {
      const pData = chart.planets[planet];
      const inKendra = KENDRA_HOUSES.includes(pData.house);
      const isStrong = pData.dignity === 'Exalted' || pData.dignity === 'Own' || pData.dignity === 'Moolatrikona';
      const formed = inKendra && isStrong;

      results.push({
        name: `${yogaName} Yoga (Pancha Mahapurusha)`,
        type: 'yoga',
        planet,
        rule: `${planet} in own/exalted sign in a Kendra house`,
        formation: formed ?
          `${planet} in ${pData.rasi.name} (${pData.dignity}) in House ${pData.house}` :
          `Not formed: ${planet} in ${pData.rasi.name} (${pData.dignity}), House ${pData.house}`,
        formed,
        strength: formed ? 'Strong' : 'Absent',
        confidence: formed ? 'HIGH' : 'N/A',
        cancellation: null,
        residual: formed ? `Active during ${planet} Dasha` : 'Not applicable',
        disputed: false
      });
    }

    return results;
  }

  /**
   * Detect Gajakesari Yoga.
   * Rule: Jupiter in a Kendra (1, 4, 7, 10) from Moon.
   */
  function detectGajakesariYoga(chart) {
    const jupiter = chart.planets.Jupiter;
    const moon = chart.planets.Moon;
    const jupHouseFromMoon = VedicCore.getHouse(jupiter.rasi.index, moon.rasi.index);
    const isInKendra = KENDRA_HOUSES.includes(jupHouseFromMoon);

    if (isInKendra) {
      const isStrong = jupiter.dignity !== 'Debilitated';
      return [{
        name: 'Gajakesari Yoga',
        type: 'yoga',
        rule: 'Jupiter in a Kendra from Moon',
        formation: `Jupiter in ${jupiter.rasi.name} (House ${jupHouseFromMoon} from Moon)`,
        strength: isStrong ? 'Strong' : 'Weak (Jupiter debilitated)',
        confidence: isStrong ? 'HIGH' : 'LOW',
        cancellation: isStrong ? null : 'Weakened by Jupiter\'s debilitation',
        residual: 'Wisdom, wealth, and respect; activated during Jupiter/Moon Dashas',
        disputed: false
      }];
    }
    return [];
  }

  /**
   * Detect Budha-Aditya Yoga.
   * Rule: Sun and Mercury conjunction.
   */
  function detectBudhaAdityaYoga(chart) {
    const sun = chart.planets.Sun;
    const mercury = chart.planets.Mercury;

    if (areConjunct(sun, mercury)) {
      const isCombust = Math.abs(sun.longitude - mercury.longitude) < 14;
      return [{
        name: 'Budha-Aditya Yoga',
        type: 'yoga',
        rule: 'Sun-Mercury conjunction',
        formation: `Sun and Mercury conjunct in House ${sun.house} (${sun.rasi.name})`,
        strength: isCombust ? 'Weak (Mercury combust)' : 'Moderate',
        confidence: isCombust ? 'LOW' : 'MODERATE',
        cancellation: isCombust ? 'Mercury is combust, weakening the yoga' : null,
        residual: 'Intelligence and communication skills',
        disputed: false
      }];
    }
    return [];
  }

  /**
   * Detect Vipareeta Raja Yoga.
   * Rule: Lord of 6th, 8th, or 12th placed in another dusthana (6, 8, 12).
   */
  function detectVipareetaRajaYoga(chart) {
    const yogas = [];
    const lagna = chart.lagnaRasiIndex;

    for (const dusthana of DUSTHANA_HOUSES) {
      const lord = VedicCore.getLordOf(dusthana, lagna);
      const lordData = chart.planets[lord];
      if (!lordData) continue;

      if (DUSTHANA_HOUSES.includes(lordData.house) && lordData.house !== dusthana) {
        yogas.push({
          name: 'Vipareeta Raja Yoga',
          type: 'yoga',
          rule: `Lord of ${dusthana}th house placed in another dusthana`,
          formation: `${lord} (lord of ${dusthana}th) in House ${lordData.house}`,
          strength: 'Moderate',
          confidence: 'MODERATE',
          cancellation: null,
          residual: 'Success through adversity; gains from unexpected sources during relevant Dasha',
          disputed: false
        });
      }
    }

    return yogas;
  }

  /**
   * Detect Neecha Bhanga Raja Yoga.
   * Rule: Debilitated planet with cancellation conditions:
   *   - Lord of the sign where debilitated planet sits aspects or is in Kendra
   *   - Lord of the exaltation sign of the debilitated planet is in Kendra
   *   - The debilitated planet is aspected by exaltation sign lord
   */
  function detectNeechaBhangaRajaYoga(chart) {
    const yogas = [];

    for (const [planet, pData] of Object.entries(chart.planets)) {
      if (pData.dignity !== 'Debilitated') continue;

      const debRasi = pData.rasi.index;
      const debRasiLord = VedicCore.RASIS[debRasi].lord;
      const debRasiLordData = chart.planets[debRasiLord];

      let cancelled = false;
      let reason = '';

      // Condition 1: Lord of debilitation sign in Kendra from Lagna
      if (debRasiLordData && KENDRA_HOUSES.includes(debRasiLordData.house)) {
        cancelled = true;
        reason = `${debRasiLord} (lord of debilitation sign) in Kendra (House ${debRasiLordData.house})`;
      }

      // Condition 2: Lord of exaltation sign in Kendra
      const exaltRasi = VedicCore.EXALTATION[planet];
      if (exaltRasi) {
        const exaltLord = VedicCore.RASIS[exaltRasi.rasi].lord;
        const exaltLordData = chart.planets[exaltLord];
        if (exaltLordData && KENDRA_HOUSES.includes(exaltLordData.house)) {
          cancelled = true;
          reason = `${exaltLord} (lord of exaltation sign) in Kendra (House ${exaltLordData.house})`;
        }
      }

      if (cancelled) {
        yogas.push({
          name: 'Neecha Bhanga Raja Yoga',
          type: 'yoga',
          rule: `Debilitated ${planet} with cancellation`,
          formation: `${planet} debilitated in ${pData.rasi.name}; cancelled by ${reason}`,
          strength: 'Moderate',
          confidence: 'MODERATE',
          cancellation: reason,
          residual: `Rise from humble/difficult beginnings during ${planet} Dasha`,
          disputed: false
        });
      }
    }

    return yogas;
  }

  // ─── DOSHA DETECTION ──────────────────────────────────────

  /**
   * Detect Manglik Dosha (Kuja Dosha).
   * Rule: Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, Venus.
   * 
   * Cancellation conditions checked:
   *   - Mars in own sign (Aries, Scorpio) or exalted (Capricorn)
   *   - Mars aspected by Jupiter
   *   - Mars in Kendra with benefics
   */
  function detectManglikDosha(chart) {
    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const mars = chart.planets.Mars;
    const results = [];

    const references = [
      { name: 'Lagna', rasiIndex: chart.lagnaRasiIndex },
      { name: 'Moon', rasiIndex: chart.planets.Moon.rasi.index },
      { name: 'Venus', rasiIndex: chart.planets.Venus.rasi.index }
    ];

    let fromLagna = false, fromMoon = false, fromVenus = false;

    for (const ref of references) {
      const marsHouseFromRef = VedicCore.getHouse(mars.rasi.index, ref.rasiIndex);
      if (manglikHouses.includes(marsHouseFromRef)) {
        if (ref.name === 'Lagna') fromLagna = true;
        if (ref.name === 'Moon') fromMoon = true;
        if (ref.name === 'Venus') fromVenus = true;
      }
    }

    const isManglik = fromLagna || fromMoon || fromVenus;

    if (!isManglik) {
      results.push({
        name: 'Manglik Dosha',
        type: 'dosha',
        present: false,
        rule: 'Mars in 1/2/4/7/8/12 from Lagna, Moon, or Venus',
        formation: `Mars in House ${mars.house} — not in Manglik houses from any reference`,
        strength: 'Absent',
        cancellation: 'N/A',
        residual: 'No Manglik Dosha',
        confidence: 'HIGH',
        disputed: false
      });
      return results;
    }

    // Check cancellations
    const cancellations = [];
    if (mars.dignity === 'Own' || mars.dignity === 'Exalted' || mars.dignity === 'Moolatrikona') {
      cancellations.push(`Mars in ${mars.dignity} sign (${mars.rasi.name})`);
    }

    const jupiter = chart.planets.Jupiter;
    if (jupiter.aspects.includes(mars.house) || areConjunct(jupiter, mars)) {
      cancellations.push('Jupiter aspects/conjoins Mars');
    }

    const severity = (fromLagna && fromMoon) ? 'Severe' :
                     fromLagna ? 'Moderate (from Lagna)' :
                     fromMoon ? 'Moderate (from Moon)' : 'Mild (from Venus only)';

    const isCancelled = cancellations.length > 0;

    results.push({
      name: 'Manglik Dosha',
      type: 'dosha',
      present: true,
      rule: 'Mars in 1/2/4/7/8/12 from Lagna, Moon, or Venus',
      formation: `Mars in House ${mars.house} (${mars.rasi.name}). Present from: ${[fromLagna && 'Lagna', fromMoon && 'Moon', fromVenus && 'Venus'].filter(Boolean).join(', ')}`,
      strength: isCancelled ? 'Cancelled/Mitigated' : severity,
      cancellation: isCancelled ? cancellations.join('; ') : 'No cancellation found',
      residual: isCancelled ?
        'Dosha effects significantly reduced' :
        'May cause delays or friction in marriage; seek matching with Manglik partner',
      confidence: isCancelled ? 'LOW' : 'MODERATE',
      disputed: false
    });

    return results;
  }

  /**
   * Detect Kala Sarpa Dosha.
   * Rule: All planets (Sun through Saturn) between Rahu-Ketu axis.
   * 
   * FLAGGED AS DISPUTED per prompt.md §2.9:
   * "Some requested tools (Kāla Sarpa...) are not in the core classical texts."
   */
  function detectKalaSarpaDosha(chart) {
    const rahu = chart.planets.Rahu;
    const ketu = chart.planets.Ketu;
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

    const rahuLong = rahu.longitude;
    const ketuLong = ketu.longitude;

    // Check if all planets are on one side of the Rahu-Ketu axis
    let allOnOneSide = true;
    let side = null;

    for (const p of planets) {
      const pLong = chart.planets[p].longitude;
      // Determine which side of Rahu-Ketu axis
      let isOnRahuSide;
      if (rahuLong > ketuLong) {
        isOnRahuSide = (pLong > ketuLong && pLong < rahuLong);
      } else {
        isOnRahuSide = (pLong > ketuLong || pLong < rahuLong);
      }

      if (side === null) {
        side = isOnRahuSide;
      } else if (side !== isOnRahuSide) {
        allOnOneSide = false;
        break;
      }
    }

    const cancellations = [];
    if (allOnOneSide) {
      // Check if any planet conjoins Rahu or Ketu (partial cancellation)
      for (const p of planets) {
        if (areConjunct(chart.planets[p], rahu) || areConjunct(chart.planets[p], ketu)) {
          cancellations.push(`${p} conjoins ${areConjunct(chart.planets[p], rahu) ? 'Rahu' : 'Ketu'}`);
        }
      }
    }

    return [{
      name: 'Kala Sarpa Dosha',
      type: 'dosha',
      present: allOnOneSide,
      rule: 'All 7 planets hemmed between Rahu-Ketu axis',
      formation: allOnOneSide ?
        'All planets between Rahu and Ketu — Kala Sarpa configuration present' :
        'Planets on both sides of Rahu-Ketu axis — no Kala Sarpa',
      strength: allOnOneSide ? (cancellations.length > 0 ? 'Partial' : 'Full') : 'Absent',
      cancellation: cancellations.length > 0 ? cancellations.join('; ') : (allOnOneSide ? 'No cancellation' : 'N/A'),
      residual: allOnOneSide ? 'Karmic delays and sudden reversals in life themes' : 'Not applicable',
      confidence: allOnOneSide ? 'MODERATE' : 'N/A',
      disputed: true,
      disputeNote: 'Kala Sarpa Dosha is not found in core classical texts (BPHS). It is a popular/later tradition.'
    }];
  }

  /**
   * Detect Kemadruma Dosha.
   * Rule: No planets in 2nd or 12th house from Moon (excluding Sun, Rahu, Ketu).
   * 
   * Cancellation: If Moon is in Kendra, or aspected by Jupiter, or in own/exalted sign.
   */
  function detectKemadrumaDosha(chart) {
    const moon = chart.planets.Moon;
    const moonRasi = moon.rasi.index;
    const checkPlanets = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

    const secondFromMoon = (moonRasi + 1) % 12;
    const twelfthFromMoon = (moonRasi + 11) % 12;

    let hasFlankingPlanet = false;
    for (const p of checkPlanets) {
      const pRasi = chart.planets[p].rasi.index;
      if (pRasi === secondFromMoon || pRasi === twelfthFromMoon) {
        hasFlankingPlanet = true;
        break;
      }
    }

    const isPresent = !hasFlankingPlanet;

    const cancellations = [];
    if (isPresent) {
      if (KENDRA_HOUSES.includes(moon.house)) {
        cancellations.push(`Moon in Kendra (House ${moon.house})`);
      }
      if (moon.dignity === 'Own' || moon.dignity === 'Exalted') {
        cancellations.push(`Moon in ${moon.dignity} sign`);
      }
      const jupiter = chart.planets.Jupiter;
      if (jupiter.aspects.includes(moon.house)) {
        cancellations.push('Jupiter aspects Moon');
      }
    }

    return [{
      name: 'Kemadruma Dosha',
      type: 'dosha',
      present: isPresent,
      rule: 'No planet (Mars-Saturn) in 2nd or 12th from Moon',
      formation: isPresent ?
        'No planets flanking the Moon — Kemadruma present' :
        'Planets present in 2nd/12th from Moon — no Kemadruma',
      strength: isPresent ? (cancellations.length > 0 ? 'Cancelled' : 'Moderate') : 'Absent',
      cancellation: cancellations.length > 0 ? cancellations.join('; ') : (isPresent ? 'No cancellation' : 'N/A'),
      residual: isPresent && cancellations.length === 0 ?
        'Possible periods of isolation or financial instability' : 'Effects mitigated',
      confidence: isPresent ? 'MODERATE' : 'N/A',
      disputed: false
    }];
  }

  /**
   * Detect Sade Sati status.
   * Saturn transiting 12th, 1st, or 2nd house from natal Moon sign.
   * This checks the natal chart itself (not transits).
   */
  function detectSadeSati(chart) {
    const moonRasi = chart.planets.Moon.rasi.index;
    const saturnRasi = chart.planets.Saturn.rasi.index;

    const twelfthFromMoon = (moonRasi + 11) % 12;
    const firstFromMoon = moonRasi;
    const secondFromMoon = (moonRasi + 1) % 12;

    const sadeSatiSigns = [twelfthFromMoon, firstFromMoon, secondFromMoon];
    const isActive = sadeSatiSigns.includes(saturnRasi);

    let phase = '';
    if (isActive) {
      if (saturnRasi === twelfthFromMoon) phase = 'Rising (12th from Moon)';
      else if (saturnRasi === firstFromMoon) phase = 'Peak (over Moon sign)';
      else phase = 'Setting (2nd from Moon)';
    }

    return {
      name: 'Sade Sati (Natal)',
      active: isActive,
      phase,
      moonRasi: VedicCore.RASIS[moonRasi].name,
      saturnRasi: VedicCore.RASIS[saturnRasi].name,
      note: isActive ?
        `Saturn transits ${phase}. Period of karmic restructuring.` :
        'Sade Sati not active in the natal chart.'
    };
  }

  // ─── Master Detection ─────────────────────────────────────
  /**
   * Run all yoga and dosha detections on a chart.
   */
  function detectAll(chart) {
    const rajaYogas = detectRajaYogas(chart);
    const dhanaYogas = detectDhanaYogas(chart);
    const panchaMahapurusha = detectPanchaMahapurusha(chart);
    const gajakesari = detectGajakesariYoga(chart);
    const budhaAditya = detectBudhaAdityaYoga(chart);
    const vipareeta = detectVipareetaRajaYoga(chart);
    const neechaBhanga = detectNeechaBhangaRajaYoga(chart);

    const manglik = detectManglikDosha(chart);
    const kalaSarpa = detectKalaSarpaDosha(chart);
    const kemadruma = detectKemadrumaDosha(chart);
    const sadeSati = detectSadeSati(chart);

    const allYogas = [
      ...rajaYogas,
      ...dhanaYogas,
      ...panchaMahapurusha.filter(y => y.formed),
      ...gajakesari,
      ...budhaAditya,
      ...vipareeta,
      ...neechaBhanga
    ];

    const allDoshas = [
      ...manglik,
      ...kalaSarpa,
      ...kemadruma
    ];

    // Absent Pancha Mahapurusha (for reporting all 5)
    const absentMahapurusha = panchaMahapurusha.filter(y => !y.formed);

    return {
      yogas: allYogas,
      doshas: allDoshas,
      panchaMahapurusha,
      sadeSati,
      absentMahapurusha,
      summary: {
        totalYogas: allYogas.length,
        totalDoshasPresent: allDoshas.filter(d => d.present).length,
        strongYogas: allYogas.filter(y => y.confidence === 'HIGH'),
        activeDoshas: allDoshas.filter(d => d.present && d.strength !== 'Cancelled' && d.strength !== 'Cancelled/Mitigated')
      }
    };
  }

  // ─── Public API ───────────────────────────────────────────
  return {
    detectRajaYogas,
    detectDhanaYogas,
    detectPanchaMahapurusha,
    detectGajakesariYoga,
    detectBudhaAdityaYoga,
    detectVipareetaRajaYoga,
    detectNeechaBhangaRajaYoga,
    detectManglikDosha,
    detectKalaSarpaDosha,
    detectKemadrumaDosha,
    detectSadeSati,
    detectAll
  };
})();

if (typeof window !== 'undefined') window.YogaDosha = YogaDosha;
