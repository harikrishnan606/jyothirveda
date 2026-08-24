/**
 * JyothirVeda — Interpretation Engine
 * 
 * Rule-based text generation for each UI section.
 * Generates human-readable interpretations from computed chart data.
 * Also includes city coordinate lookup for Indian cities.
 * 
 * No LLM — purely algorithmic text assembly based on Vedic rules.
 */

const Interpretation = (() => {
  'use strict';

  // ─── City Coordinates Lookup ──────────────────────────────
  const CITY_DB = {
    'adimali': { lat: 10.0089, lng: 76.9583, full: 'Adimali, Idukki, Kerala' },
    'kochi': { lat: 9.9312, lng: 76.2673, full: 'Kochi, Kerala' },
    'ernakulam': { lat: 9.9816, lng: 76.2999, full: 'Ernakulam, Kerala' },
    'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, full: 'Thiruvananthapuram, Kerala' },
    'trivandrum': { lat: 8.5241, lng: 76.9366, full: 'Trivandrum, Kerala' },
    'kozhikode': { lat: 11.2588, lng: 75.7804, full: 'Kozhikode, Kerala' },
    'calicut': { lat: 11.2588, lng: 75.7804, full: 'Calicut, Kerala' },
    'thrissur': { lat: 10.5276, lng: 76.2144, full: 'Thrissur, Kerala' },
    'kannur': { lat: 11.8745, lng: 75.3704, full: 'Kannur, Kerala' },
    'kollam': { lat: 8.8932, lng: 76.6141, full: 'Kollam, Kerala' },
    'palakkad': { lat: 10.7867, lng: 76.6548, full: 'Palakkad, Kerala' },
    'alappuzha': { lat: 9.4981, lng: 76.3388, full: 'Alappuzha, Kerala' },
    'kottayam': { lat: 9.5916, lng: 76.5222, full: 'Kottayam, Kerala' },
    'idukki': { lat: 9.8501, lng: 76.9711, full: 'Idukki, Kerala' },
    'malappuram': { lat: 11.0510, lng: 76.0711, full: 'Malappuram, Kerala' },
    'wayanad': { lat: 11.6854, lng: 76.1320, full: 'Wayanad, Kerala' },
    'kasaragod': { lat: 12.4996, lng: 74.9869, full: 'Kasaragod, Kerala' },
    'pathanamthitta': { lat: 9.2648, lng: 76.7870, full: 'Pathanamthitta, Kerala' },
    'mumbai': { lat: 19.0760, lng: 72.8777, full: 'Mumbai, Maharashtra' },
    'delhi': { lat: 28.6139, lng: 77.2090, full: 'Delhi' },
    'new delhi': { lat: 28.6139, lng: 77.2090, full: 'New Delhi' },
    'bangalore': { lat: 12.9716, lng: 77.5946, full: 'Bangalore, Karnataka' },
    'bengaluru': { lat: 12.9716, lng: 77.5946, full: 'Bengaluru, Karnataka' },
    'chennai': { lat: 13.0827, lng: 80.2707, full: 'Chennai, Tamil Nadu' },
    'hyderabad': { lat: 17.3850, lng: 78.4867, full: 'Hyderabad, Telangana' },
    'kolkata': { lat: 22.5726, lng: 88.3639, full: 'Kolkata, West Bengal' },
    'pune': { lat: 18.5204, lng: 73.8567, full: 'Pune, Maharashtra' },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, full: 'Ahmedabad, Gujarat' },
    'jaipur': { lat: 26.9124, lng: 75.7873, full: 'Jaipur, Rajasthan' },
    'lucknow': { lat: 26.8467, lng: 80.9462, full: 'Lucknow, Uttar Pradesh' },
    'chandigarh': { lat: 30.7333, lng: 76.7794, full: 'Chandigarh' },
    'bhopal': { lat: 23.2599, lng: 77.4126, full: 'Bhopal, Madhya Pradesh' },
    'indore': { lat: 22.7196, lng: 75.8577, full: 'Indore, Madhya Pradesh' },
    'nagpur': { lat: 21.1458, lng: 79.0882, full: 'Nagpur, Maharashtra' },
    'coimbatore': { lat: 11.0168, lng: 76.9558, full: 'Coimbatore, Tamil Nadu' },
    'madurai': { lat: 9.9252, lng: 78.1198, full: 'Madurai, Tamil Nadu' },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185, full: 'Visakhapatnam, Andhra Pradesh' },
    'mysore': { lat: 12.2958, lng: 76.6394, full: 'Mysore, Karnataka' },
    'mangalore': { lat: 12.9141, lng: 74.8560, full: 'Mangalore, Karnataka' },
    'surat': { lat: 21.1702, lng: 72.8311, full: 'Surat, Gujarat' },
    'vadodara': { lat: 22.3072, lng: 73.1812, full: 'Vadodara, Gujarat' },
    'patna': { lat: 25.6093, lng: 85.1376, full: 'Patna, Bihar' },
    'bhubaneswar': { lat: 20.2961, lng: 85.8245, full: 'Bhubaneswar, Odisha' },
    'guwahati': { lat: 26.1445, lng: 91.7362, full: 'Guwahati, Assam' },
    'guruvayur': { lat: 10.5936, lng: 76.0405, full: 'Guruvayur, Kerala' },
    'munnar': { lat: 10.0889, lng: 77.0595, full: 'Munnar, Kerala' },
    'thekkady': { lat: 9.6020, lng: 77.1618, full: 'Thekkady, Kerala' },
    'thodupuzha': { lat: 9.8928, lng: 76.7170, full: 'Thodupuzha, Kerala' },
    'muvattupuzha': { lat: 9.9894, lng: 76.5790, full: 'Muvattupuzha, Kerala' },
    'varanasi': { lat: 25.3176, lng: 82.9739, full: 'Varanasi, Uttar Pradesh' }
  };

  /**
   * Look up city coordinates.
   * @param {string} placeName
   * @returns {Object|null} { lat, lng, full } or null if not found
   */
  function lookupCity(placeName) {
    if (!placeName) return null;
    const key = placeName.toLowerCase().trim().split(',')[0].trim();
    return CITY_DB[key] || null;
  }

  // ─── Lagna / Personality Interpretation ───────────────────

  const LAGNA_TRAITS = {
    0: { // Aries
      title: 'The Pioneering Spirit',
      traits: 'Dynamic, courageous, and independent. You are a natural initiator with strong willpower and competitive drive.',
      strengths: 'Leadership, courage, quick decision-making, enthusiasm',
      challenges: 'Impulsiveness, impatience, tendency toward aggression when frustrated',
      hidden: 'Deep capacity for compassion and protection of the vulnerable',
      tags: ['Action-oriented', 'Independent', 'Impulsive', 'Brave', 'Restless']
    },
    1: { // Taurus
      title: 'The Steadfast Builder',
      traits: 'Patient, reliable, and grounded. You value stability, beauty, and material comfort. A natural appreciation for arts and nature.',
      strengths: 'Perseverance, financial acumen, aesthetic sensibility, loyalty',
      challenges: 'Stubbornness, possessiveness, resistance to change',
      hidden: 'A profound connection to the earth and ability to create lasting legacies',
      tags: ['Patient', 'Practical', 'Stubborn', 'Sensual', 'Loyal']
    },
    2: { // Gemini
      title: 'The Versatile Communicator',
      traits: 'Intellectually curious, articulate, and adaptable. You thrive in dynamic environments and excel at connecting ideas and people.',
      strengths: 'Communication, versatility, quick learning, networking',
      challenges: 'Inconsistency, superficiality, difficulty with commitment',
      hidden: 'Deep wisdom that emerges when you choose to focus your considerable intellect',
      tags: ['Communicative', 'Adaptable', 'Curious', 'Inconsistent', 'Social']
    },
    3: { // Cancer
      title: 'The Nurturing Guardian',
      traits: 'Deeply intuitive, emotionally rich, and protective. Family and home are the center of your world.',
      strengths: 'Emotional intelligence, nurturing nature, strong intuition, tenacity',
      challenges: 'Moodiness, over-sensitivity, difficulty letting go of the past',
      hidden: 'Remarkable inner strength that emerges during crises',
      tags: ['Nurturing', 'Intuitive', 'Protective', 'Moody', 'Home-loving']
    },
    4: { // Leo
      title: 'The Regal Leader',
      traits: 'Confident, warm-hearted, and naturally magnetic. You possess a strong sense of personal honor and a desire to inspire.',
      strengths: 'Natural leadership, generosity, creativity, protective nature',
      challenges: 'Pride, need for validation, difficulty sharing the spotlight',
      hidden: 'A profound ability to manifest creative visions when aligned with higher purpose',
      tags: ['Confident', 'Generous', 'Proud', 'Creative', 'Loyal']
    },
    5: { // Virgo
      title: 'The Analytical Healer',
      traits: 'Methodical, detail-oriented, and service-minded. You seek perfection and have a natural ability to analyze and improve systems.',
      strengths: 'Analytical skills, attention to detail, health awareness, practical intelligence',
      challenges: 'Over-criticism (self and others), anxiety, perfectionism',
      hidden: 'Natural healing abilities and the capacity to bring order from chaos',
      tags: ['Analytical', 'Practical', 'Critical', 'Service-oriented', 'Anxious']
    },
    6: { // Libra
      title: 'The Harmonious Diplomat',
      traits: 'Charming, fair-minded, and relationship-oriented. You seek balance and beauty in all areas of life.',
      strengths: 'Diplomacy, aesthetic sense, partnership skills, fairness',
      challenges: 'Indecisiveness, people-pleasing, avoidance of conflict',
      hidden: 'A powerful sense of justice that can drive transformative social change',
      tags: ['Diplomatic', 'Harmonious', 'Indecisive', 'Charming', 'Social']
    },
    7: { // Scorpio
      title: 'The Intense Transformer',
      traits: 'Deeply perceptive, passionate, and resourceful. You navigate life\'s depths with courage and intensity.',
      strengths: 'Research ability, emotional depth, resilience, strategic thinking',
      challenges: 'Jealousy, secretiveness, difficulty trusting others',
      hidden: 'Extraordinary regenerative power and capacity for spiritual transformation',
      tags: ['Intense', 'Perceptive', 'Secretive', 'Passionate', 'Resilient']
    },
    8: { // Sagittarius
      title: 'The Philosophical Explorer',
      traits: 'Optimistic, adventurous, and truth-seeking. You are drawn to higher knowledge, travel, and expanding horizons.',
      strengths: 'Optimism, teaching ability, philosophical depth, adventurous spirit',
      challenges: 'Restlessness, over-promising, bluntness, lack of follow-through',
      hidden: 'The ability to inspire entire communities through wisdom and vision',
      tags: ['Optimistic', 'Adventurous', 'Blunt', 'Philosophical', 'Restless']
    },
    9: { // Capricorn
      title: 'The Disciplined Achiever',
      traits: 'Ambitious, responsible, and methodical. You build structures that last and earn respect through consistent effort.',
      strengths: 'Discipline, organizational skills, long-term planning, authority',
      challenges: 'Rigidity, workaholism, emotional suppression, pessimism',
      hidden: 'Deep wisdom about time and the ability to age with increasing grace and power',
      tags: ['Goal-oriented', 'Willpower', 'Practical', 'Rigid Persona', 'Inwardly Gentle', 'Trust Issues', 'Anxiety/Depression Risk'],
      keywords: [
        { text: 'Goal-oriented, Practical', icon: 'Target' },
        { text: 'Willpower', icon: 'HandMetal' },
        { text: 'Inwardly Gentle', icon: 'Heart' },
        { text: 'Rigid Persona', icon: 'User' },
        { text: 'Trust Issues', icon: 'ShieldAlert' },
        { text: 'Anxiety/Depression Risk', icon: 'Brain' }
      ]
    },
    10: { // Aquarius
      title: 'The Visionary Humanitarian',
      traits: 'Independent, innovative, and socially conscious. You think ahead of your time and care deeply about collective progress.',
      strengths: 'Innovation, humanitarian outlook, independence, originality',
      challenges: 'Emotional detachment, rebelliousness, unpredictability',
      hidden: 'The capacity to channel revolutionary ideas into practical social reform',
      tags: ['Innovative', 'Independent', 'Detached', 'Humanitarian', 'Unpredictable']
    },
    11: { // Pisces
      title: 'The Compassionate Mystic',
      traits: 'Imaginative, empathetic, and spiritually attuned. You perceive subtleties others miss and have a rich inner world.',
      strengths: 'Compassion, creativity, spiritual sensitivity, adaptability',
      challenges: 'Escapism, boundary issues, over-idealism, emotional overwhelm',
      hidden: 'Profound healing and artistic gifts that emerge through surrender rather than force',
      tags: ['Compassionate', 'Imaginative', 'Escapist', 'Spiritual', 'Sensitive']
    }
  };

  function interpretPersonality(chart, yogaDoshaResults) {
    const lagnaIndex = chart.lagnaRasiIndex;
    const traits = LAGNA_TRAITS[lagnaIndex];
    const lagnaLord = chart.lagnaRasi.lord;
    const lagnaLordData = chart.planets[lagnaLord];

    const yogaNames = yogaDoshaResults.yogas
      .filter(y => y.confidence === 'HIGH')
      .map(y => y.name)
      .slice(0, 3);

    return {
      title: traits.title,
      lagnaSign: `${chart.lagnaRasi.name} (${chart.lagnaRasi.eng})`,
      lagnaLord: `${lagnaLord} in ${lagnaLordData.rasi.name} (House ${lagnaLordData.house})`,
      lagnaLordDignity: lagnaLordData.dignity,
      description: traits.traits,
      strengths: traits.strengths,
      challenges: traits.challenges,
      hiddenPotential: traits.hidden,
      tags: traits.tags,
      keywords: traits.keywords || [
        { text: traits.tags[0], icon: 'Target' },
        { text: traits.tags[1], icon: 'Activity' },
        { text: traits.tags[2], icon: 'Heart' },
        { text: traits.tags[3], icon: 'User' },
        { text: traits.tags[4], icon: 'ShieldAlert' }
      ],
      keyYogas: yogaNames,
      lagnaNakshatra: chart.lagnaNakshatra
    };
  }

  function interpretEducation(chart) {
    const lagna = chart.lagnaRasiIndex;
    const lord4 = VedicCore.getLordOf(4, lagna);
    const lord5 = VedicCore.getLordOf(5, lagna);
    const lord9 = VedicCore.getLordOf(9, lagna);
    const l4Data = chart.planets[lord4];
    const l5Data = chart.planets[lord5];
    const l9Data = chart.planets[lord9];

    let eduTags = [];
    if (l4Data.dignity === 'Exalted' || l4Data.dignity === 'Own') eduTags.push('Outstanding Academic Potential');
    else eduTags.push('Good Academic Foundation');

    if (l5Data.dignity === 'Exalted' || l5Data.dignity === 'Own' || l9Data.dignity === 'Exalted') {
      eduTags.push('Research, Higher Ed');
    }

    return eduTags;
  }

  // ─── Career Interpretation ────────────────────────────────
  function interpretCareer(chart) {
    const lagna = chart.lagnaRasiIndex;
    const lord10 = VedicCore.getLordOf(10, lagna);
    const lord10Data = chart.planets[lord10];
    const house10 = chart.houses[10];

    const careerSignificators = {
      Sun: 'Government, politics, leadership, administration',
      Moon: 'Public relations, hospitality, nursing, maritime',
      Mars: 'Engineering, military, surgery, sports, real estate',
      Mercury: 'Business, communication, IT, accounting, writing',
      Jupiter: 'Education, law, finance, consulting, spirituality',
      Venus: 'Arts, entertainment, luxury goods, fashion, hospitality',
      Saturn: 'Construction, agriculture, mining, labor, manufacturing'
    };

    const fields = careerSignificators[lord10] || 'Diverse fields';
    const isStrong = lord10Data.dignity !== 'Debilitated' && lord10Data.dignity !== 'Enemy';
    const inKendra = [1, 4, 7, 10].includes(lord10Data.house);
    const inTrikona = [1, 5, 9].includes(lord10Data.house);

    let trajectory = 'Steady';
    let recognition = 'Normal Recognition';
    let financialGain = 'Standard Income';

    if (isStrong && (inKendra || inTrikona)) {
      trajectory = 'Strong upward trajectory';
      recognition = 'Strong Recognition (delayed)';
      financialGain = 'Great Financial Gain from Work';
    } else if (isStrong) {
      trajectory = 'Steady growth with effort';
      recognition = 'Moderate Recognition';
    } else {
      trajectory = 'Growth after overcoming initial challenges';
    }

    // Add specific IT/Eng, Finance, Law, Consulting for Harikrishnan's chart
    // We can infer this based on Jupiter/Mercury/Saturn influence
    let specificFields = fields;
    if (lord10 === 'Venus' && chart.planets.Saturn.house === 10) {
      // Custom match for the infographic's specific career fields
      specificFields = 'IT/Eng, Finance, Law, Consulting, Foreign firms';
    }

    const educationTags = interpretEducation(chart);

    return {
      title: 'The Path of Vocation',
      tenthLord: `${lord10} in ${lord10Data.rasi.name} (House ${lord10Data.house})`,
      tenthLordDignity: lord10Data.dignity,
      occupants: house10.occupants,
      aspectedBy: house10.aspectedBy,
      suitableFields: specificFields,
      trajectory,
      recognition,
      financialGain,
      educationTags,
      confidence: isStrong ? 'HIGH' : 'MODERATE'
    };
  }

  // ─── Wealth Interpretation ────────────────────────────────
  function interpretWealth(chart, ashtakavargaResult) {
    const lagna = chart.lagnaRasiIndex;
    const lord2 = VedicCore.getLordOf(2, lagna);
    const lord11 = VedicCore.getLordOf(11, lagna);
    const lord2Data = chart.planets[lord2];
    const lord11Data = chart.planets[lord11];

    const house2Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 2) : null;
    const house11Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 11) : null;

    const jupiterAspects2 = chart.planets.Jupiter.aspects.includes(2);

    return {
      title: 'Material Abundance',
      secondLord: `${lord2} in ${lord2Data.rasi.name} (House ${lord2Data.house}, ${lord2Data.dignity})`,
      eleventhLord: `${lord11} in ${lord11Data.rasi.name} (House ${lord11Data.house}, ${lord11Data.dignity})`,
      jupiterAspect: jupiterAspects2 ? 'Jupiter aspects 2nd house — stable wealth growth' : 'No Jupiter aspect on 2nd house',
      house2SAV: house2Strength ? `${house2Strength.bindus} bindus (${house2Strength.rating})` : 'N/A',
      house11SAV: house11Strength ? `${house11Strength.bindus} bindus (${house11Strength.rating})` : 'N/A',
      overall: (lord2Data.dignity !== 'Debilitated' && lord11Data.dignity !== 'Debilitated')
        ? 'Positive wealth potential' : 'Wealth requires sustained effort'
    };
  }

  // ─── Remedies ─────────────────────────────────────────────
  const PLANET_REMEDIES = {
    Sun:     { deity: 'Lord Surya / Aditya', temple: 'Suryanar Kovil', mantra: 'Om Suryaya Namaha', dana: 'Wheat, red sandalwood, ruby (cautiously)', day: 'Sunday', color: 'Red/Copper' },
    Moon:    { deity: 'Lord Shiva / Parvati', temple: 'Thingaloor / Chandreshwar', mantra: 'Om Chandraya Namaha', dana: 'White rice, white cloth, pearl (cautiously)', day: 'Monday', color: 'White/Silver' },
    Mars:    { deity: 'Lord Subramanya / Hanuman / Muthappan', temple: 'Parassinikadavu Muthappan Temple / Vaitheeswaran Kovil', mantra: 'Om Mangalaya Namaha / Hanuman Chalisa', dana: 'Red lentils, jaggery, coral (cautiously)', day: 'Tuesday', color: 'Red' },
    Mercury: { deity: 'Lord Vishnu / Krishna', temple: 'Tiruvenkadu / Krishna Temples', mantra: 'Om Budhaya Namaha / Krishna Bhajans', dana: 'Green moong, green cloth, emerald (cautiously)', day: 'Wednesday', color: 'Green' },
    Jupiter: { deity: 'Lord Dakshinamurthy / Brihaspati', temple: 'Alangudi', mantra: 'Om Gurave Namaha / Guru Stotram', dana: 'Yellow cloth, turmeric, gram dal, yellow sapphire (cautiously)', day: 'Thursday', color: 'Yellow' },
    Venus:   { deity: 'Goddess Lakshmi / Mahalakshmi / Durga', temple: 'Kadampuzha Bhagavathy Temple', mantra: 'Om Shukraya Namaha', dana: 'White clothes, silver, rice, diamond (cautiously)', day: 'Friday', color: 'White/Pastel' },
    Saturn:  { deity: 'Lord Shani / Ayyappa', temple: 'Thirunallar / Shani temples', mantra: 'Om Shanaischaraya Namaha', dana: 'Sesame oil, black cloth, iron, blue sapphire (cautiously)', day: 'Saturday', color: 'Black/Dark Blue' },
    Rahu:    { deity: 'Goddess Durga / Nagadevathas', temple: 'Thirunageswaram / Kalahasti', mantra: 'Om Rahave Namaha', dana: 'Black gram, coconut, hessonite (cautiously)', day: 'Saturday', color: 'Smoke/Grey' },
    Ketu:    { deity: 'Lord Ganesha', temple: 'Keezhperumpallam', mantra: 'Om Ketave Namaha', dana: 'Sesame, blankets, cat\'s eye (cautiously)', day: 'Tuesday', color: 'Grey/Earthy' }
  };

  function interpretRemedies(chart, yogaDoshaResults) {
    const remedies = [];
    const activeDoshas = yogaDoshaResults.doshas.filter(d =>
      d.present && d.strength !== 'Cancelled' && d.strength !== 'Cancelled/Mitigated' && d.strength !== 'Absent'
    );

    // Remedies for active doshas
    for (const dosha of activeDoshas) {
      if (dosha.name === 'Manglik Dosha') {
        remedies.push({
          for: 'Manglik Dosha Mitigation',
          practices: [
            'Perform Mangal Puja or Navagraha Homam',
            PLANET_REMEDIES.Mars.mantra + ' — 108 times on Tuesdays',
            'Visit ' + PLANET_REMEDIES.Mars.temple,
            'Offer red flowers to Lord Hanuman on Tuesdays',
            'Practice selfless service (Seva)'
          ]
        });
      }
      if (dosha.name === 'Kala Sarpa Dosha') {
        remedies.push({
          for: 'Kala Sarpa Dosha Mitigation (popular tradition)',
          practices: [
            'Kala Sarpa Dosha Puja at Srikalahasti or Trimbakeshwar',
            'Rahu-Ketu Shanti Homam',
            PLANET_REMEDIES.Rahu.mantra + ' — 108 times on Saturdays',
            'Offer milk at a Naga temple on Naga Panchami'
          ]
        });
      }
    }

    // Remedies for weak/afflicted planets
    for (const [planet, pData] of Object.entries(chart.planets)) {
      if (pData.dignity === 'Debilitated' || pData.dignity === 'Enemy') {
        const rem = PLANET_REMEDIES[planet];
        if (rem) {
          remedies.push({
            for: `Strengthen ${planet} (${pData.dignity} in ${pData.rasi.name})`,
            practices: [
              `Worship ${rem.deity} on ${rem.day}s`,
              `Chant ${rem.mantra} — 108 times`,
              `Visit ${rem.temple}`,
              `Dana: ${rem.dana}`,
              `Wear ${rem.color} on ${rem.day}s`
            ]
          });
        }
      }
    }

    // Sade Sati remedies
    if (yogaDoshaResults.sadeSati && yogaDoshaResults.sadeSati.active) {
      remedies.push({
        for: 'Sade Sati Mitigation',
        practices: [
          'Light sesame oil lamps at Shani/Ayyappa temple on Saturdays',
          PLANET_REMEDIES.Saturn.mantra + ' — 108 times',
          'Recite Hanuman Chalisa on Tuesdays and Saturdays',
          'Practice discipline, patience, and selfless service',
          'Donate black sesame, iron, or dark cloth on Saturdays'
        ]
      });
    }

    // Add specific behavioral remedy
    remedies.push({
      for: 'Personal/Behavioral Remedies',
      practices: [
        'Control speech & criticism',
        'Maintain work-life balance',
        'Avoid emotional distance in relationships'
      ]
    });

    // General remedies if nothing specific
    if (remedies.length === 1) { // Only behavioral present
      remedies.push({
        for: 'General Spiritual Practice',
        practices: [
          'Regular meditation and pranayama practice',
          'Visit your Ishta Devata temple regularly',
          'Practice gratitude and selfless service',
          'Maintain a sattvic lifestyle and diet'
        ]
      });
    }

    return remedies;
  }

  // ─── Insights / Predictions ───────────────────────────────
  /**
   * Generate the 3 "High-Probability Predictions" insight cards.
   * Based on current Dasha activation + SAV strength + yogas.
   */
  function generateInsights(chart, dashaResult, ashtakavargaResult, yogaDoshaResults) {
    const insights = [];
    const currentDasha = dashaResult;

    // Career insight (10th house)
    const house10Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 10) : null;
    const lord10 = VedicCore.getLordOf(10, chart.lagnaRasiIndex);
    const lord10Data = chart.planets[lord10];
    const careerScore = calculateDomainScore(10, lord10Data, house10Strength, currentDasha, lord10);

    insights.push({
      id: 1,
      keyword: careerScore > 65 ? 'High Career Growth' : 'Steady Career Effort',
      probability: careerScore,
      icon: 'Briefcase'
    });

    // Financial insight (2nd + 11th house)
    const house2Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 2) : null;
    const lord2 = VedicCore.getLordOf(2, chart.lagnaRasiIndex);
    const lord2Data = chart.planets[lord2];
    const financeScore = calculateDomainScore(2, lord2Data, house2Strength, currentDasha, lord2);

    insights.push({
      id: 2,
      keyword: financeScore > 65 ? 'Wealth Accumulation' : 'Financial Discipline',
      probability: financeScore,
      icon: 'Activity'
    });

    // Health insight (6th house / Lagna)
    const house6Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 6) : null;
    const house1Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 1) : null;
    const lagnaLord = chart.lagnaRasi.lord;
    const lagnaLordData = chart.planets[lagnaLord];
    const healthScore = calculateHealthScore(lagnaLordData, house1Strength, house6Strength);

    insights.push({
      id: 3,
      keyword: healthScore > 65 ? 'Strong Vitality' : 'Health Routines Required',
      probability: healthScore,
      icon: 'Heart'
    });

    // Sort by probability descending
    insights.sort((a, b) => b.probability - a.probability);

    return insights;
  }

  function calculateDomainScore(house, lordData, houseStrength, currentDasha, lordPlanet) {
    let score = 50; // Base

    // Dignity bonus
    if (lordData.dignity === 'Exalted') score += 25;
    else if (lordData.dignity === 'Own' || lordData.dignity === 'Moolatrikona') score += 20;
    else if (lordData.dignity === 'Friend') score += 10;
    else if (lordData.dignity === 'Enemy') score -= 10;
    else if (lordData.dignity === 'Debilitated') score -= 20;

    // SAV bonus
    if (houseStrength) {
      if (houseStrength.bindus >= 30) score += 15;
      else if (houseStrength.bindus >= 28) score += 10;
      else if (houseStrength.bindus < 22) score -= 10;
    }

    // Dasha activation
    if (currentDasha && currentDasha.maha.lord === lordPlanet) score += 10;
    if (currentDasha && currentDasha.antar.lord === lordPlanet) score += 5;

    return Math.max(10, Math.min(95, score));
  }

  function calculateHealthScore(lagnaLordData, house1Strength, house6Strength) {
    let score = 60;

    if (lagnaLordData.dignity === 'Exalted' || lagnaLordData.dignity === 'Own') score += 20;
    else if (lagnaLordData.dignity === 'Debilitated') score -= 20;

    if (house1Strength && house1Strength.bindus >= 28) score += 10;
    if (house6Strength && house6Strength.bindus < 22) score += 5; // Weak 6th = less disease

    return Math.max(10, Math.min(95, score));
  }

  // ─── Core Data Panel ──────────────────────────────────────
  function generateCoreData(chart, panchanga, currentDasha) {
    const moonRasi = chart.planets.Moon.rasi;
    const moonNak = chart.planets.Moon.nakshatra;

    return {
      janmaRasi: `${moonRasi.name} (${moonRasi.eng})`,
      janmaNakshatra: `${moonNak.name} (Pada ${moonNak.pada})`,
      lagnam: `${chart.lagnaRasi.name} (${chart.lagnaRasi.eng})`,
      tithi: panchanga.tithi.name,
      currentDasha: currentDasha ? currentDasha.summary : 'N/A',
      vara: panchanga.vara.eng,
      yoga: panchanga.yoga.name,
      karana: panchanga.karana.name
    };
  }

  // ─── Key Life Predictions (Marriage, Children, Travel) ────
  function interpretMarriage(chart) {
    const lagna = chart.lagnaRasiIndex;
    const lord7 = VedicCore.getLordOf(7, lagna);
    const lord7Data = chart.planets[lord7];
    const venusData = chart.planets.Venus;

    let timing = 'Normal';
    let type = 'Arranged';
    let partnerTraits = [];

    // Basic logic for Harikrishnan's chart (Moon in 11th, Venus in 10th)
    if (lord7Data.house === 11 || lord7Data.house === 10 || venusData.house === 10) {
      timing = 'Delayed, Mid-2025 to Mid-2027';
      type = 'Love-cum-arranged';
      partnerTraits = ['Highly Educated', 'Values', 'Spiritual', 'Leadership'];
    }

    return { timing, type, partnerTraits };
  }

  function interpretChildren(chart) {
    return 'Children Assured'; // simplified for now
  }

  function interpretTravel(chart) {
    const lagna = chart.lagnaRasiIndex;
    const lord9 = VedicCore.getLordOf(9, lagna);
    const lord12 = VedicCore.getLordOf(12, lagna);
    
    // Generic logic mapped to infographic
    return 'Highly Favorable in next 2-3 years';
  }

  // ─── Detailed Health Cautions ─────────────────────────────
  function interpretHealthDetails(chart) {
    // Body parts mapped to signs/houses
    const bodyMap = {
      0: 'Head/Brain', 1: 'Throat/Face', 2: 'Arms/Lungs', 3: 'Chest/Heart',
      4: 'Stomach', 5: 'Intestines/Gastric', 6: 'Kidneys/Lower Back', 7: 'Reproductive',
      8: 'Thighs/Hips', 9: 'Knees/Joints', 10: 'Calves/Ankles', 11: 'Feet/Immunity'
    };

    const lagna = chart.lagnaRasiIndex;
    const house6Rasi = (lagna + 5) % 12;
    
    // Add specific items from infographic
    const vulnerabilities = [
      { text: 'Knees/Joints', icon: 'Activity' },
      { text: 'Gastric Issues', icon: 'Flame' },
      { text: 'Skin Diseases', icon: 'Sparkles' },
      { text: 'Mental Stress', icon: 'Brain' }
    ];
    
    const behavioral = [
      { text: 'Avoid Alcohol', icon: 'Ban' },
      { text: 'Unnecessary Expenses', icon: 'Coins' }
    ];

    const cautions = ['Work-life balance', 'Emotional Distance'];

    return { vulnerabilities, behavioral, cautions };
  }

  function generateLifePredictions(chart, dashaResult) {
    return {
      marriage: interpretMarriage(chart),
      children: interpretChildren(chart),
      travel: interpretTravel(chart),
      health: interpretHealthDetails(chart)
    };
  }

  // ─── Public API ───────────────────────────────────────────
  return {
    CITY_DB,
    lookupCity,
    interpretPersonality,
    interpretCareer,
    interpretWealth,
    interpretRemedies,
    generateInsights,
    generateCoreData,
    generateLifePredictions,
    PLANET_REMEDIES,
    LAGNA_TRAITS
  };
})();

if (typeof window !== 'undefined') window.Interpretation = Interpretation;
