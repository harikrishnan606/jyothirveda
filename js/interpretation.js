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

  const ML_LAGNA_TRAITS = {
    0: { // Aries
      title: 'മുന്നിൽ നിന്ന് നയിക്കുന്നവൻ',
      traits: 'ചലനാത്മകവും ധീരവും സ്വതന്ത്രവുമായ പ്രകൃതം. മികച്ച ഇച്ഛാശക്തിയും മത്സരബുദ്ധിയുമുള്ള നേതൃഗുണം നിങ്ങൾക്ക് സ്വാഭാവികമായുണ്ട്.',
      strengths: 'നേതൃത്വം, ധൈര്യം, വേഗത്തിലുള്ള തീരുമാനം, ഉത്സാഹം',
      challenges: 'എടുത്തുചാട്ടം, അക്ഷമ, ദേഷ്യം വരാനുള്ള പ്രവണത',
      hidden: 'ദുർബലരെ സംരക്ഷിക്കാനുള്ള അഗാധമായ കഴിവും അനുകമ്പയും',
      tags: ['കർമ്മനിരതൻ', 'സ്വതന്ത്രൻ', 'എടുത്തുചാട്ടം', 'ധീരൻ', 'വിശ്രമമില്ലാത്തവൻ']
    },
    1: { // Taurus
      title: 'സ്ഥിരതയാർന്ന നിർമ്മാതാവ്',
      traits: 'ക്ഷമയും വിശ്വാസ്യതയും ഭൂമിയോട് ചേർന്ന സ്വഭാവവും. സുസ്ഥിരതയും ഭൗതിക സുഖങ്ങളും നിങ്ങൾ വിലമതിക്കുന്നു. കലയോടും പ്രകൃതിയോടും സ്വാഭാവികമായ താല്പര്യം.',
      strengths: 'സ്ഥിരോത്സാഹം, സാമ്പത്തിക ബുദ്ധി, സൗന്ദര്യാസ്വാദനം, വിശ്വസ്തത',
      challenges: 'ശാഠ്യം, സ്വന്തമാക്കാനുള്ള ആഗ്രഹം, മാറ്റങ്ങളോടുള്ള എതിർപ്പ്',
      hidden: 'ഭൂമിയുമായുള്ള അഗാധമായ ബന്ധവും നിലനിൽക്കുന്ന നേട്ടങ്ങൾ സൃഷ്ടിക്കാനുള്ള കഴിവും',
      tags: ['ക്ഷമാശീലൻ', 'പ്രായോഗികം', 'ശാഠ്യം', 'സുഖലോലുപൻ', 'വിശ്വസ്തൻ']
    },
    2: { // Gemini
      title: 'ബഹുമുഖ ആശയവിനിമയകൻ',
      traits: 'ബൗദ്ധികമായ അന്വേഷണാത്മകതയും സംസാരിക്കാനുള്ള കഴിവും. മാറുന്ന സാഹചര്യങ്ങളുമായി പൊരുത്തപ്പെടാനും ആശയങ്ങളെയും ആളുകളെയും തമ്മിൽ ബന്ധിപ്പിക്കാനും നിങ്ങൾ മിടുക്കനാണ്.',
      strengths: 'ആശയവിനിമയം, ബഹുമുഖ പ്രതിഭ, വേഗത്തിൽ പഠിക്കാനുള്ള കഴിവ്, ജനസമ്പർക്കം',
      challenges: 'സ്ഥിരതയില്ലായ്മ, ഉപരിപ്ലവമായ സ്വഭാവം, ബാധ്യതകളോടുള്ള വിമുഖത',
      hidden: 'നിങ്ങളുടെ ശ്രദ്ധ കേന്ദ്രീകരിക്കുമ്പോൾ പുറത്തുവരുന്ന അഗാധമായ ജ്ഞാനം',
      tags: ['സംസാരപ്രിയൻ', 'അനുയോജ്യൻ', 'കൗതുകമുള്ളവൻ', 'അസ്ഥിരൻ', 'സാമൂഹ്യൻ']
    },
    3: { // Cancer
      title: 'സ്നേഹമയിയായ സംരക്ഷകൻ',
      traits: 'അഗാധമായ അവബോധവും വൈകാരിക സമ്പന്നതയും സംരക്ഷണ സ്വഭാവവും. കുടുംബവും വീടുമാണ് നിങ്ങളുടെ ലോകത്തിന്റെ കേന്ദ്രം.',
      strengths: 'വൈകാരിക ബുദ്ധി, പരിപാലിക്കുന്ന പ്രകൃതം, ശക്തമായ ഉൾക്കാഴ്ച, ദൃഢനിശ്ചയം',
      challenges: 'മാറുന്ന മാനസികാവസ്ഥ, അമിത വൈകാരികത, ഭൂതകാലത്തെ മറക്കാനുള്ള ബുദ്ധിമുട്ട്',
      hidden: 'പ്രതിസന്ധി ഘട്ടങ്ങളിൽ പുറത്തുവരുന്ന അസാധാരണമായ ആന്തരിക ശക്തി',
      tags: ['പരിപാലകൻ', 'ഉൾക്കാഴ്ചയുള്ളവൻ', 'സംരക്ഷകൻ', 'വൈകാരികം', 'കുടുംബസ്നേഹി']
    },
    4: { // Leo
      title: 'രാജകീയ നേതാവ്',
      traits: 'ആത്മവിശ്വാസവും ഊഷ്മളമായ ഹൃദയവും സ്വാഭാവിക ആകർഷണീയതയും. ശക്തമായ ആത്മാഭിമാനവും മറ്റുള്ളവരെ പ്രചോദിപ്പിക്കാനുള്ള ആഗ്രഹവുമുണ്ട്.',
      strengths: 'സ്വാഭാവിക നേതൃത്വം, ഔദാര്യം, സർഗ്ഗാത്മകത, സംരക്ഷിക്കുന്ന സ്വഭാവം',
      challenges: 'അഹങ്കാരം, അംഗീകാരത്തിനായുള്ള ദാഹം, മറ്റുള്ളവർക്ക് അവസരം നൽകാനുള്ള മടി',
      hidden: 'ഉയർന്ന ലക്ഷ്യങ്ങളുമായി ഒത്തുചേരുമ്പോൾ സർഗ്ഗാത്മക ദർശനങ്ങൾ യാഥാർത്ഥ്യമാക്കാനുള്ള കഴിവ്',
      tags: ['ആത്മവിശ്വാസി', 'ഉദാരമനസ്കൻ', 'അഭിമാനി', 'സർഗ്ഗാത്മകൻ', 'വിശ്വസ്തൻ']
    },
    5: { // Virgo
      title: 'വിശകലന ബുദ്ധിയുള്ള സഹായി',
      traits: 'ചിട്ടയായതും സൂക്ഷ്മതയുള്ളതും സേവനമനസ്കവുമായ സ്വഭാവം. നിങ്ങൾ പൂർണ്ണത ആഗ്രഹിക്കുന്നു, സിസ്റ്റങ്ങളെ വിശകലനം ചെയ്യാനും മെച്ചപ്പെടുത്താനുമുള്ള സ്വാഭാവിക കഴിവുണ്ട്.',
      strengths: 'വിശകലന ശേഷി, സൂക്ഷ്മത, ആരോഗ്യബോധം, പ്രായോഗിക ബുദ്ധി',
      challenges: 'അമിത വിമർശനം (സ്വയം/മറ്റുള്ളവരെ), ഉത്കണ്ഠ, പൂർണ്ണതയ്ക്കായുള്ള വാശി',
      hidden: 'സ്വാഭാവികമായ രോഗശാന്തി കഴിവുകളും അലങ്കോലങ്ങളിൽ നിന്ന് അടുക്കും ചിട്ടയും കൊണ്ടുവരാനുള്ള ശേഷിയും',
      tags: ['വിശകലനാത്മകം', 'പ്രായോഗികം', 'വിമർശകൻ', 'സേവനസന്നദ്ധൻ', 'ഉത്കണ്ഠയുള്ളവൻ']
    },
    6: { // Libra
      title: 'സന്തുലിതമായ നയതന്ത്രജ്ഞൻ',
      traits: 'ആകർഷകവും ന്യായബോധമുള്ളതും ബന്ധങ്ങൾക്ക് മുൻഗണന നൽകുന്നതുമായ സ്വഭാവം. ജീവിതത്തിന്റെ എല്ലാ മേഖലകളിലും സന്തുലിതാവസ്ഥയും സൗന്ദര്യവും നിങ്ങൾ ആഗ്രഹിക്കുന്നു.',
      strengths: 'നയതന്ത്രം, സൗന്ദര്യബോധം, പങ്കാളിത്ത നൈപുണ്യം, നീതിബോധം',
      challenges: 'തീരുമാനമെടുക്കാനുള്ള ബുദ്ധിമുട്ട്, മറ്റുള്ളവരെ പ്രീതിപ്പെടുത്താനുള്ള ശ്രമം, തർക്കങ്ങൾ ഒഴിവാക്കൽ',
      hidden: 'മാറ്റങ്ങൾക്ക് തിരികൊളുത്താൻ കഴിയുന്ന ശക്തമായ നീതിബോധം',
      tags: ['നയതന്ത്രജ്ഞൻ', 'സന്തുലിതം', 'തീരുമാനമില്ലായ്മ', 'ആകർഷകം', 'സാമൂഹ്യൻ']
    },
    7: { // Scorpio
      title: 'തീവ്രമായ പരിവർത്തകൻ',
      traits: 'അഗാധമായ ഉൾക്കാഴ്ചയും അഭിനിവേശവും കഴിവുമുള്ള പ്രകൃതം. ജീവിതത്തിന്റെ ആഴങ്ങളെ ധൈര്യത്തോടെയും തീവ്രതയോടെയും നിങ്ങൾ നേരിടുന്നു.',
      strengths: 'ഗവേഷണ ശേഷി, വൈകാരിക ആഴം, സ്ഥിരോത്സാഹം, തന്ത്രപരമായ ചിന്ത',
      challenges: 'അസൂയ, രഹസ്യസ്വഭാവം, മറ്റുള്ളവരെ വിശ്വസിക്കാനുള്ള ബുദ്ധിമുട്ട്',
      hidden: 'ആത്മീയ പരിവർത്തനത്തിനും സ്വയം നവീകരണത്തിനുമുള്ള അസാധാരണ കഴിവ്',
      tags: ['തീവ്രം', 'ഉൾക്കാഴ്ച', 'രഹസ്യാത്മകം', 'അഭിനിവേശം', 'സ്ഥിരോത്സാഹം']
    },
    8: { // Sagittarius
      title: 'തത്ത്വചിന്തകനായ യാത്രികൻ',
      traits: 'ശുഭാപ്തിവിശ്വാസവും സാഹസികതയും സത്യം അന്വേഷിക്കുന്ന പ്രകൃതവും. ഉന്നത അറിവിലേക്കും യാത്രകളിലേക്കും പുതിയ കാഴ്ചപ്പാടുകളിലേക്കും നിങ്ങൾ ആകർഷിക്കപ്പെടുന്നു.',
      strengths: 'ശുഭാപ്തിവിശ്വാസം, പഠിപ്പിക്കാനുള്ള കഴിവ്, ദാർശനിക ആഴം, സാഹസിക മനോഭാവം',
      challenges: 'വിശ്രമമില്ലായ്മ, അമിത വാഗ്ദാനങ്ങൾ നൽകൽ, മുഖത്തുനോക്കി സംസാരിക്കൽ, പൂർത്തിയാക്കാനുള്ള മടി',
      hidden: 'ജ്ഞാനവും ദർശനവും വഴി മുഴുവൻ സമൂഹങ്ങളെയും പ്രചോദിപ്പിക്കാനുള്ള കഴിവ്',
      tags: ['ശുഭാപ്തിവിശ്വാസി', 'സാഹസികൻ', 'തുറന്നുപറയുന്നവൻ', 'തത്ത്വചിന്തകൻ', 'വിശ്രമമില്ലാത്തവൻ']
    },
    9: { // Capricorn
      title: 'അച്ചടക്കമുള്ള വിജയി',
      traits: 'ലക്ഷ്യബോധവും ഉത്തരവാദിത്തവും ചിട്ടയായ പ്രവർത്തനവും. നിലനിൽക്കുന്ന ഘടനകൾ കെട്ടിപ്പടുക്കുകയും നിരന്തര പരിശ്രമത്തിലൂടെ ബഹുമാനം നേടുകയും ചെയ്യുന്നു.',
      strengths: 'അച്ചടക്കം, സംഘാടന ശേഷി, ദീർഘകാല ആസൂത്രണം, അധികാരം',
      challenges: 'കടുംപിടുത്തം, അമിത ജോലിഭ്രമം, വികാരങ്ങൾ അടിച്ചമർത്തൽ, അശുഭാപ്തിവിശ്വാസം',
      hidden: 'സമയത്തെക്കുറിച്ചുള്ള അഗാധമായ അറിവും പ്രായം കൂടുന്തോറും കൂടുതൽ കരുത്തനാകാനുള്ള കഴിവും',
      tags: ['ലക്ഷ്യബോധം', 'ഇച്ഛാശക്തി', 'പ്രായോഗികം', 'കഠിന സ്വഭാവം', 'ഉള്ളിൽ മൃദുവായവൻ', 'വിശ്വാസക്കുറവ്', 'ഉത്കണ്ഠ/വിഷാദ സാധ്യത'],
      keywords: [
        { text: 'ലക്ഷ്യബോധം, പ്രായോഗികം', icon: 'Target' },
        { text: 'ഇച്ഛാശക്തി', icon: 'HandMetal' },
        { text: 'ഉള്ളിൽ മൃദുവായവൻ', icon: 'Heart' },
        { text: 'കഠിന സ്വഭാവം', icon: 'User' },
        { text: 'വിശ്വാസക്കുറവ്', icon: 'ShieldAlert' },
        { text: 'ഉത്കണ്ഠ സാധ്യത', icon: 'Brain' }
      ]
    },
    10: { // Aquarius
      title: 'ദർശനമുള്ള മാനുഷികവാദി',
      traits: 'സ്വതന്ത്രവും നൂതനവും സാമൂഹിക ബോധമുള്ളതുമായ പ്രകൃതം. നിങ്ങൾ കാലത്തിന് മുന്നേ ചിന്തിക്കുകയും സമൂഹത്തിന്റെ പുരോഗതിക്കായി ആഴത്തിൽ കരുതുകയും ചെയ്യുന്നു.',
      strengths: 'നൂതനാശയങ്ങൾ, മാനുഷിക കാഴ്ചപ്പാട്, സ്വാതന്ത്ര്യം, മൗലികത',
      challenges: 'വൈകാരിക അകൽച്ച, വിമത സ്വഭാവം, പ്രവചനാതീതത്വം',
      hidden: 'വിപ്ലവകരമായ ആശയങ്ങളെ പ്രായോഗിക സാമൂഹിക പരിഷ്കാരങ്ങളാക്കി മാറ്റാനുള്ള കഴിവ്',
      tags: ['നൂതനം', 'സ്വതന്ത്രൻ', 'അകൽച്ചയുള്ളവൻ', 'മാനുഷികം', 'പ്രവചനാതീതം']
    },
    11: { // Pisces
      title: 'അനുകമ്പയുള്ള മിസ്റ്റിക്',
      traits: 'ഭാവനാസമ്പന്നനും അനുകമ്പയുള്ളവനും ആത്മീയതയുള്ളവനുമാണ് നിങ്ങൾ. മറ്റുള്ളവർ കാണാത്ത സൂക്ഷ്മതകൾ നിങ്ങൾ തിരിച്ചറിയുകയും സമ്പന്നമായ ആന്തരിക ലോകം കാത്തുസൂക്ഷിക്കുകയും ചെയ്യുന്നു.',
      strengths: 'അനുകമ്പ, സർഗ്ഗാത്മകത, ആത്മീയ സംവേദനക്ഷമത, പൊരുത്തപ്പെടാനുള്ള കഴിവ്',
      challenges: 'യാഥാർത്ഥ്യത്തിൽ നിന്നുള്ള ഒളിച്ചോട്ടം, അതിരുകൾ നിശ്ചയിക്കാനുള്ള ബുദ്ധിമുട്ട്, അമിത ആദർശവാദം',
      hidden: 'ബലപ്രയോഗത്തേക്കാൾ കീഴടങ്ങലിലൂടെ പുറത്തുവരുന്ന രോഗശാന്തി നൽകാനുള്ള അഗാധ കഴിവും കലാപരമായ കഴിവുകളും',
      tags: ['അനുകമ്പയുള്ളവൻ', 'ഭാവനാസമ്പന്നൻ', 'ഒളിച്ചോടുന്നവൻ', 'ആത്മീയൻ', 'സെൻസിറ്റീവ്']
    }
  };

  function interpretPersonality(chart, yogaDoshaResults, lang = 'en') {
    const lagnaIndex = chart.lagnaRasiIndex;
    const traits = lang === 'ml' ? ML_LAGNA_TRAITS[lagnaIndex] : LAGNA_TRAITS[lagnaIndex];
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

  function interpretEducation(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    const lord4 = VedicCore.getLordOf(4, lagna);
    const lord5 = VedicCore.getLordOf(5, lagna);
    const lord9 = VedicCore.getLordOf(9, lagna);
    const l4Data = chart.planets[lord4];
    const l5Data = chart.planets[lord5];
    const l9Data = chart.planets[lord9];

    let eduTags = [];
    if (l4Data.dignity === 'Exalted' || l4Data.dignity === 'Own') eduTags.push(lang === 'ml' ? 'മികച്ച അക്കാദമിക് സാധ്യതകൾ' : 'Outstanding Academic Potential');
    else eduTags.push(lang === 'ml' ? 'നല്ല അടിസ്ഥാന വിദ്യാഭ്യാസം' : 'Good Academic Foundation');

    if (l5Data.dignity === 'Exalted' || l5Data.dignity === 'Own' || l9Data.dignity === 'Exalted') {
      eduTags.push(lang === 'ml' ? 'ഗവേഷണം, ഉന്നത വിദ്യാഭ്യാസം' : 'Research, Higher Ed');
    }

    return eduTags;
  }

  // ─── Career Interpretation ────────────────────────────────
  function interpretCareer(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    const lord10 = VedicCore.getLordOf(10, lagna);
    const lord10Data = chart.planets[lord10];
    const house10 = chart.houses[10];

    const careerSignificators = {
      Sun: lang === 'ml' ? 'സർക്കാർ, രാഷ്ട്രീയം, നേതൃത്വം, ഭരണം' : 'Government, politics, leadership, administration',
      Moon: lang === 'ml' ? 'പബ്ലിക് റിലേഷൻസ്, ഹോസ്പിറ്റാലിറ്റി, നഴ്സിംഗ്, നാവികം' : 'Public relations, hospitality, nursing, maritime',
      Mars: lang === 'ml' ? 'എഞ്ചിനീയറിംഗ്, സൈന്യം, സർജറി, സ്പോർട്സ്, റിയൽ എസ്റ്റേറ്റ്' : 'Engineering, military, surgery, sports, real estate',
      Mercury: lang === 'ml' ? 'ബിസിനസ്സ്, ആശയവിനിമയം, ഐടി, അക്കൗണ്ടിംഗ്, എഴുത്ത്' : 'Business, communication, IT, accounting, writing',
      Jupiter: lang === 'ml' ? 'വിദ്യാഭ്യാസം, നിയമം, ധനകാര്യം, കൺസൾട്ടിംഗ്, ആത്മീയത' : 'Education, law, finance, consulting, spirituality',
      Venus: lang === 'ml' ? 'കലകൾ, വിനോദം, ആഡംബര വസ്തുക്കൾ, ഫാഷൻ, ഹോസ്പിറ്റാലിറ്റി' : 'Arts, entertainment, luxury goods, fashion, hospitality',
      Saturn: lang === 'ml' ? 'നിർമ്മാണം, കൃഷി, ഖനനം, തൊഴിൽ, മാനുഫാക്ചറിംഗ്' : 'Construction, agriculture, mining, labor, manufacturing',
      Rahu: lang === 'ml' ? 'സാങ്കേതികവിദ്യ, വ്യോമയാനം, ഫോട്ടോഗ്രാഫി, വിദേശ വ്യാപാരം, ഗവേഷണം' : 'Technology, aviation, photography, foreign trade, research',
      Ketu: lang === 'ml' ? 'ആയുർവേദം, ജ്യോതിഷം, ഗവേഷണം, ആത്മീയത, കമ്പ്യൂട്ടർ പ്രോഗ്രാമിംഗ്' : 'Ayurveda, astrology, research, spirituality, computer programming'
    };

    let fieldList = [careerSignificators[lord10]];
    house10.occupants.forEach(occ => {
      if (careerSignificators[occ]) fieldList.push(careerSignificators[occ]);
    });
    const fields = Array.from(new Set(fieldList.filter(Boolean))).join(' | ') || (lang === 'ml' ? 'വിവിധ മേഖലകൾ' : 'Diverse fields');
    
    const isStrong = lord10Data.dignity !== 'Debilitated' && lord10Data.dignity !== 'Enemy';
    const inKendra = [1, 4, 7, 10].includes(lord10Data.house);
    const inTrikona = [1, 5, 9].includes(lord10Data.house);

    let trajectory = lang === 'ml' ? 'സ്ഥിരതയുള്ള' : 'Steady';
    let recognition = lang === 'ml' ? 'സാധാരണ അംഗീകാരം' : 'Normal Recognition';
    let financialGain = lang === 'ml' ? 'സാധാരണ വരുമാനം' : 'Standard Income';

    if (isStrong && (inKendra || inTrikona)) {
      trajectory = lang === 'ml' ? 'ശക്തമായ മുകളിലേക്കുള്ള പ്രയാണം' : 'Strong upward trajectory';
      recognition = lang === 'ml' ? 'ശക്തമായ അംഗീകാരം (വൈകി ലഭിച്ചേക്കാം)' : 'Strong Recognition (delayed)';
      financialGain = lang === 'ml' ? 'ജോലിയിൽ നിന്ന് മികച്ച സാമ്പത്തിക നേട്ടം' : 'Great Financial Gain from Work';
    } else if (isStrong) {
      trajectory = lang === 'ml' ? 'പരിശ്രമത്തിലൂടെയുള്ള സ്ഥിരമായ വളർച്ച' : 'Steady growth with effort';
      recognition = lang === 'ml' ? 'മിതമായ അംഗീകാരം' : 'Moderate Recognition';
    } else {
      trajectory = lang === 'ml' ? 'തുടക്കത്തിലെ പ്രതിസന്ധികൾ മറികടന്നുള്ള വളർച്ച' : 'Growth after overcoming initial challenges';
    }

    const specificFields = fields;

    const educationTags = interpretEducation(chart, lang);

    return {
      title: lang === 'ml' ? 'തൊഴിൽ മാർഗ്ഗം' : 'The Path of Vocation',
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
  function interpretWealth(chart, ashtakavargaResult, lang = 'en') {
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
      title: lang === 'ml' ? 'ഭൗതിക സമൃദ്ധി' : 'Material Abundance',
      secondLord: `${lord2} in ${lord2Data.rasi.name} (House ${lord2Data.house}, ${lord2Data.dignity})`,
      eleventhLord: `${lord11} in ${lord11Data.rasi.name} (House ${lord11Data.house}, ${lord11Data.dignity})`,
      jupiterAspect: jupiterAspects2 ? (lang === 'ml' ? 'വ്യാഴദൃഷ്ടി രണ്ടാം ഭാവത്തിൽ — സുസ്ഥിര സമ്പത്ത്' : 'Jupiter aspects 2nd house — stable wealth growth') : (lang === 'ml' ? 'രണ്ടാം ഭാവത്തിൽ വ്യാഴദൃഷ്ടിയില്ല' : 'No Jupiter aspect on 2nd house'),
      house2SAV: house2Strength ? `${house2Strength.bindus} bindus (${house2Strength.rating})` : 'N/A',
      house11SAV: house11Strength ? `${house11Strength.bindus} bindus (${house11Strength.rating})` : 'N/A',
      overall: (lord2Data.dignity !== 'Debilitated' && lord11Data.dignity !== 'Debilitated')
        ? (lang === 'ml' ? 'മികച്ച സാമ്പത്തിക സാധ്യതകൾ' : 'Positive wealth potential') 
        : (lang === 'ml' ? 'സമ്പത്ത് നേടാൻ നിരന്തരമായ പരിശ്രമം ആവശ്യമാണ്' : 'Wealth requires sustained effort')
    };
  }

  // ─── Remedies ─────────────────────────────────────────────
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

  const ML_PLANET_REMEDIES = {
    Sun:     { deity: 'സൂര്യ ഭഗവാൻ', temple: 'സൂര്യനാർ കോവിൽ', mantra: 'ഓം സൂരയായ നമഹ', dana: 'ഗോതമ്പ്, രക്തചന്ദനം, മാണിക്യം (സൂക്ഷ്മതയോടെ)', day: 'ഞായർ', color: 'ചുവപ്പ്/ചെമ്പ്' },
    Moon:    { deity: 'പരമശിവൻ / പാർവ്വതി ദേവി', temple: 'തിങ്കളൂർ / ചന്ദ്രേശ്വർ', mantra: 'ഓം ചന്ദ്രായ നമഹ', dana: 'വെളുത്ത അരി, വെള്ള വസ്ത്രം, മുത്ത് (സൂക്ഷ്മതയോടെ)', day: 'തിങ്കൾ', color: 'വെള്ള/വെള്ളി' },
    Mars:    { deity: 'സുബ്രഹ്മണ്യ സ്വാമി / ഹനുമാൻ', temple: 'മുത്തപ്പൻ കാവ് / വൈത്തീശ്വരൻ കോവിൽ', mantra: 'ഓം മംഗളായ നമഹ / ഹനുമാൻ ചാലിസ', dana: 'ചുവന്ന പരിപ്പ്, ശർക്കര, പവിഴം (സൂക്ഷ്മതയോടെ)', day: 'ചൊവ്വ', color: 'ചുവപ്പ്' },
    Mercury: { deity: 'മഹാവിഷ്ണു / ശ്രീകൃഷ്ണൻ', temple: 'തിരുവെൺകാട് / ശ്രീകൃഷ്ണ ക്ഷേത്രങ്ങൾ', mantra: 'ഓം ബുധായ നമഹ', dana: 'ചെറുപയർ, പച്ച വസ്ത്രം, മരതകം (സൂക്ഷ്മതയോടെ)', day: 'ബുധൻ', color: 'പച്ച' },
    Jupiter: { deity: 'ദക്ഷിണാമൂർത്തി / ബൃഹസ്പതി', temple: 'ആലങ്കുടി', mantra: 'ഓം ഗുരവേ നമഹ / ഗുരു സ്തോത്രം', dana: 'മഞ്ഞ വസ്ത്രം, മഞ്ഞൾ, കടല, മഞ്ഞ പുഷ്യരാഗം (സൂക്ഷ്മതയോടെ)', day: 'വ്യാഴം', color: 'മഞ്ഞ' },
    Venus:   { deity: 'മഹാലക്ഷ്മി / ദുർഗ്ഗാ ഭഗവതി', temple: 'കുടുംബി ഭഗവതി ക്ഷേത്രം', mantra: 'ഓം ശുക്രായ നമഹ', dana: 'വെള്ള വസ്ത്രം, വെള്ളി, അരി, വജ്രം (സൂക്ഷ്മതയോടെ)', day: 'വെള്ളി', color: 'വെള്ള/ഇളം നിറങ്ങൾ' },
    Saturn:  { deity: 'ശനി ഭഗവാൻ / അയ്യപ്പ സ്വാമി', temple: 'തിരുനள்ளார் / ശനീശ്വര ക്ഷേത്രങ്ങൾ', mantra: 'ഓം ശനൈശ്ചരായ നമഹ', dana: 'എള്ളെണ്ണ, കറുത്ത വസ്ത്രം, ഇരുമ്പ്, നീലക്കല്ല് (സൂക്ഷ്മതയോടെ)', day: 'ശനി', color: 'കറുപ്പ്/കടും നീല' },
    Rahu:    { deity: 'ദുർഗ്ഗാ ഭഗവതി / നാഗദേവതകൾ', temple: 'തിരുനാഗേശ്വരം / കാളഹസ്തി', mantra: 'ഓം രാഹവേ നമഹ', dana: 'ഉഴുന്ന്, തേങ്ങ, ഗോമേദകം (സൂക്ഷ്മതയോടെ)', day: 'ശനി', color: 'പുകനിറം/ചാരനിറം' },
    Ketu:    { deity: 'ഗണപതി ഭഗവാൻ', temple: 'കീഴപെരുമ്പള്ളം', mantra: 'ഓം കേതവേ നമഹ', dana: 'എള്ള്, കമ്പിളി പുതപ്പ്, വൈഡൂര്യം (സൂക്ഷ്മതയോടെ)', day: 'ചൊവ്വ', color: 'ചാരനിറം/മൺനിറം' }
  };

  function interpretRemedies(chart, yogaDoshaResults, lang = 'en') {
    const remedies = [];
    const activeDoshas = yogaDoshaResults.doshas.filter(d =>
      d.present && d.strength !== 'Cancelled' && d.strength !== 'Cancelled/Mitigated' && d.strength !== 'Absent'
    );

    const remediesDict = lang === 'ml' ? ML_PLANET_REMEDIES : PLANET_REMEDIES;

    // Remedies for active doshas
    for (const dosha of activeDoshas) {
      if (dosha.name === 'Manglik Dosha') {
        remedies.push({
          for: lang === 'ml' ? 'ചൊവ്വാ ദോഷ പരിഹാരങ്ങൾ' : 'Manglik Dosha Mitigation',
          practices: [
            lang === 'ml' ? 'മംഗള പൂജ അല്ലെങ്കിൽ നവഗ്രഹ ഹോമം നടത്തുക' : 'Perform Mangal Puja or Navagraha Homam',
            remediesDict.Mars.mantra + (lang === 'ml' ? ' — ചൊവ്വാഴ്ചകളിൽ 108 തവണ' : ' — 108 times on Tuesdays'),
            (lang === 'ml' ? 'ദർശനം: ' : 'Visit ') + remediesDict.Mars.temple,
            lang === 'ml' ? 'ചൊവ്വാഴ്ചകളിൽ ഹനുമാൻ സ്വാമിക്ക് ചുവന്ന പുഷ്പങ്ങൾ അർപ്പിക്കുക' : 'Offer red flowers to Lord Hanuman on Tuesdays',
            lang === 'ml' ? 'നിസ്വാർത്ഥ സേവനം ശീലിക്കുക' : 'Practice selfless service (Seva)'
          ]
        });
      }
      if (dosha.name === 'Kala Sarpa Dosha') {
        remedies.push({
          for: lang === 'ml' ? 'കാള സർപ്പ ദോഷ പരിഹാരങ്ങൾ' : 'Kala Sarpa Dosha Mitigation (popular tradition)',
          practices: [
            lang === 'ml' ? 'ശ്രീകാളഹസ്തിയിലോ ത്രയംബകേശ്വറിലോ കാള സർപ്പ ദോഷ പൂജ നടത്തുക' : 'Kala Sarpa Dosha Puja at Srikalahasti or Trimbakeshwar',
            lang === 'ml' ? 'രാഹു-കേതു ശാന്തി ഹോമം' : 'Rahu-Ketu Shanti Homam',
            remediesDict.Rahu.mantra + (lang === 'ml' ? ' — ശനിയാഴ്ചകളിൽ 108 തവണ' : ' — 108 times on Saturdays'),
            lang === 'ml' ? 'നാഗപഞ്ചമി ദിനത്തിൽ നാഗക്ഷേത്രത്തിൽ പാൽ അർപ്പിക്കുക' : 'Offer milk at a Naga temple on Naga Panchami'
          ]
        });
      }
    }

    // Remedies for weak/afflicted planets
    for (const [planet, pData] of Object.entries(chart.planets)) {
      if (pData.dignity === 'Debilitated' || pData.dignity === 'Enemy') {
        const rem = remediesDict[planet];
        if (rem) {
          remedies.push({
            for: lang === 'ml' ? `${window.i18n.t(planet)} ബലപ്പെടുത്തുക (${window.i18n.t(pData.dignity)} - ${window.i18n.t(pData.rasi.name)})` : `Strengthen ${planet} (${pData.dignity} in ${pData.rasi.name})`,
            practices: [
              lang === 'ml' ? `${rem.day}ാഴ്ചകളിൽ ${rem.deity}യെ ആരാധിക്കുക` : `Worship ${rem.deity} on ${rem.day}s`,
              lang === 'ml' ? `${rem.mantra} — 108 തവണ ജപിക്കുക` : `Chant ${rem.mantra} — 108 times`,
              (lang === 'ml' ? 'ദർശനം: ' : 'Visit ') + rem.temple,
              (lang === 'ml' ? 'ദാനം: ' : 'Dana: ') + rem.dana,
              lang === 'ml' ? `${rem.day}ാഴ്ചകളിൽ ${rem.color} വസ്ത്രം ധരിക്കുക` : `Wear ${rem.color} on ${rem.day}s`
            ]
          });
        }
      }
    }

    // Sade Sati remedies
    if (yogaDoshaResults.sadeSati && yogaDoshaResults.sadeSati.active) {
      remedies.push({
        for: lang === 'ml' ? 'ഏഴര ശനി ദോഷ പരിഹാരങ്ങൾ' : 'Sade Sati Mitigation',
        practices: [
          lang === 'ml' ? 'ശനിയാഴ്ചകളിൽ ശനി/അയ്യപ്പ ക്ഷേത്രത്തിൽ എള്ളെണ്ണ വിളക്ക് കത്തിക്കുക' : 'Light sesame oil lamps at Shani/Ayyappa temple on Saturdays',
          remediesDict.Saturn.mantra + (lang === 'ml' ? ' — 108 തവണ ജപിക്കുക' : ' — 108 times'),
          lang === 'ml' ? 'ചൊവ്വ, ശനി ദിവസങ്ങളിൽ ഹനുമാൻ ചാലിസ ജപിക്കുക' : 'Recite Hanuman Chalisa on Tuesdays and Saturdays',
          lang === 'ml' ? 'അച്ചടക്കം, ക്ഷമ, നിസ്വാർത്ഥ സേവനം എന്നിവ ശീലിക്കുക' : 'Practice discipline, patience, and selfless service',
          lang === 'ml' ? 'ശനിയാഴ്ചകളിൽ കറുത്ത എള്ള്, ഇരുമ്പ് അല്ലെങ്കിൽ കറുത്ത വസ്ത്രം ദാനം ചെയ്യുക' : 'Donate black sesame, iron, or dark cloth on Saturdays'
        ]
      });
    }

    // Add specific behavioral remedy based on Lagna element
    const lagnaRasi = chart.lagnaRasiIndex;
    const element = lagnaRasi % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
    
    let behavioralPractices = [];
    if (element === 0) behavioralPractices = lang === 'ml' ? ['ക്ഷമയും കോപ നിയന്ത്രണവും ശീലിക്കുക', 'അമിതമായ ഊർജ്ജം വ്യായാമത്തിനായി വിനിയോഗിക്കുക', 'എടുത്തുചാടിയുള്ള തീരുമാനങ്ങൾ ഒഴിവാക്കുക'] : ['Practice patience and anger management', 'Channel excess energy into physical exercise', 'Avoid impulsive decisions'];
    else if (element === 1) behavioralPractices = lang === 'ml' ? ['മാറ്റങ്ങളെയും വഴക്കത്തെയും ഉൾക്കൊള്ളുക', 'കടുംപിടുത്തം ഒഴിവാക്കുക', 'ഭൗതിക കാര്യങ്ങളോടുള്ള അമിത താല്പര്യം കുറയ്ക്കുക'] : ['Embrace change and flexibility', 'Avoid stubbornness', 'Practice generosity and detachment from material things'];
    else if (element === 2) behavioralPractices = lang === 'ml' ? ['പ്രകൃതിയുമായി ഇണങ്ങി ജീവിക്കുക', 'മാനസിക ചാഞ്ചാട്ടം ഒഴിവാക്കാൻ ഒരേ സമയം ഒരു കാര്യത്തിൽ ശ്രദ്ധിക്കുക', 'സ്ഥിരമായി ധ്യാനിക്കുക'] : ['Ground yourself with nature walks', 'Focus on one task at a time to avoid mental scattering', 'Practice regular meditation'];
    else if (element === 3) behavioralPractices = lang === 'ml' ? ['വൈകാരിക അതിരുകൾ നിശ്ചയിക്കുക', 'അമിതമായ വൈകാരിക ആശ്രിതത്വം ഒഴിവാക്കുക', 'കലാപരമായ പ്രവർത്തനങ്ങളിൽ ഏർപ്പെടുക'] : ['Set healthy emotional boundaries', 'Avoid over-attachment and emotional dependency', 'Engage in creative or artistic expression'];

    remedies.push({
      for: lang === 'ml' ? 'പെരുമാറ്റപരമായ മാറ്റങ്ങൾ (ലഗ്ന അടിസ്ഥാനത്തിൽ)' : 'Personal/Behavioral Remedies (Based on Ascendant Element)',
      practices: behavioralPractices
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

  function interpretHealthDetails(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    const vulnerabilities = [];

    // Add specific planetary vulnerabilities based on 6th lord
    const lord6 = VedicCore.getLordOf(6, lagna);
    if (lord6 === 'Mars') vulnerabilities.push({ text: lang === 'ml' ? 'ശരീരത്തിലെ ചൂട്/വീക്കം' : 'Inflammation/Heat', icon: 'Flame' });
    if (lord6 === 'Mercury') vulnerabilities.push({ text: lang === 'ml' ? 'നാഡീവ്യൂഹം' : 'Nervous System', icon: 'Brain' });
    if (lord6 === 'Saturn') vulnerabilities.push({ text: lang === 'ml' ? 'സന്ധികൾ/എല്ലുകൾ' : 'Joints/Bones', icon: 'Activity' });

    const cautions = [];
    const h6Occupants = chart.houses[6].occupants;
    if (h6Occupants.includes('Saturn')) cautions.push(lang === 'ml' ? 'ദീർഘകാല ആരോഗ്യ പ്രശ്നങ്ങൾക്ക് സാധ്യത' : 'Prone to chronic issues requiring discipline');
    if (h6Occupants.includes('Mars')) cautions.push(lang === 'ml' ? 'മുറിവുകൾ/അപകടങ്ങൾ ശ്രദ്ധിക്കുക' : 'Prone to injuries/surgery');
    if (h6Occupants.includes('Rahu')) cautions.push(lang === 'ml' ? 'കണ്ടുപിടിക്കാൻ ബുദ്ധിമുട്ടുള്ള അസുഖങ്ങൾ' : 'Hard-to-diagnose ailments');

    const behavioral = [];
    if (chart.planets.Moon.house === 6 || chart.planets.Moon.house === 8 || chart.planets.Moon.house === 12) {
      behavioral.push({ text: lang === 'ml' ? 'വൈകാരിക സമ്മർദ്ദം ആരോഗ്യത്തെ ബാധിക്കാം' : 'Emotional stress affects health', icon: 'Heart' });
    }
    if (chart.planets.Sun.dignity === 'Debilitated' || chart.planets.Sun.house === 8) {
      behavioral.push({ text: lang === 'ml' ? 'പ്രതിരോധശേഷി കുറയാൻ സാധ്യത' : 'Low vitality/immunity', icon: 'ShieldAlert' });
    }

    // Longevity Analysis (BPHS Ch. 44)
    const lord8 = VedicCore.getLordOf(8, lagna);
    const l8Data = chart.planets[lord8];
    const lagnaLord = VedicCore.getLordOf(1, lagna);
    const llData = chart.planets[lagnaLord];
    
    let longevityText = lang === 'ml' ? 'സാധാരണ ആരോഗ്യദൈർഘ്യം' : 'Moderate Vitality and Longevity';
    
    // Balarishta condition (Moon in 6,8,12 aspected by malefics)
    const moonH = chart.planets.Moon.house;
    if ([6, 8, 12].includes(moonH)) {
        longevityText = lang === 'ml' ? 'ബാലാരിഷ്ടത (കുട്ടിക്കാലത്തെ ആരോഗ്യപ്രശ്നങ്ങൾ ശ്രദ്ധിക്കുക)' : 'Balarishta indications: Requires care during early childhood';
    } 
    // Strong longevity condition
    else if (['Exalted', 'Own', 'Friendly'].includes(llData.dignity) && ['Exalted', 'Own', 'Friendly'].includes(l8Data.dignity)) {
        longevityText = lang === 'ml' ? 'ദീർഘായുസ്സും മികച്ച ആരോഗ്യവും' : 'Purna Ayus (Long Life) indicated by strong Lagna and 8th Lord';
    }

    if (cautions.length === 0) {
      cautions.push(lang === 'ml' ? 'പ്രധാനപ്പെട്ട ആരോഗ്യ മുന്നറിയിപ്പുകളില്ല' : 'No major planetary health afflictions');
    }

    return { 
      vulnerabilities: vulnerabilities.slice(0,4), 
      behavioral: behavioral.slice(0,2), 
      cautions,
      longevity: longevityText 
    };
  }

  function generateInsights(chart, dashaResult, ashtakavargaResult, yogaDoshaResults, lang = 'en') {
    const insights = [];
    const currentDasha = dashaResult;

    const house10Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 10) : null;
    const lord10 = VedicCore.getLordOf(10, chart.lagnaRasiIndex);
    const lord10Data = chart.planets[lord10];
    const careerScore = calculateDomainScore(10, lord10Data, house10Strength, currentDasha, lord10);

    let careerKw = lang === 'ml' ? 'സ്ഥിരമായ തൊഴിൽ നേട്ടം' : 'Steady Career Effort';
    let careerIcon = 'Briefcase';
    if (careerScore >= 75) { careerKw = lang === 'ml' ? 'മികച്ച തൊഴിൽ വളർച്ച' : 'High Career Growth'; careerIcon = 'TrendingUp'; }
    else if (careerScore < 40) { careerKw = lang === 'ml' ? 'തൊഴിലിൽ തടസ്സങ്ങൾ' : 'Career Challenges'; careerIcon = 'AlertTriangle'; }

    insights.push({
      id: 1,
      keyword: careerKw,
      probability: careerScore,
      icon: careerIcon
    });

    // Financial insight (2nd + 11th house)
    const house2Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 2) : null;
    const lord2 = VedicCore.getLordOf(2, chart.lagnaRasiIndex);
    const lord2Data = chart.planets[lord2];
    const financeScore = calculateDomainScore(2, lord2Data, house2Strength, currentDasha, lord2);

    let finKw = lang === 'ml' ? 'സാമ്പത്തിക അച്ചടക്കം' : 'Financial Discipline';
    let finIcon = 'Coins';
    if (financeScore >= 75) { finKw = lang === 'ml' ? 'സമ്പത്ത് വർദ്ധനവ്' : 'Wealth Accumulation'; finIcon = 'Activity'; }
    else if (financeScore < 40) { finKw = lang === 'ml' ? 'സാമ്പത്തിക ബുദ്ധിമുട്ടുകൾ' : 'Financial Restraints'; finIcon = 'AlertTriangle'; }

    insights.push({
      id: 2,
      keyword: finKw,
      probability: financeScore,
      icon: finIcon
    });

    // Health insight (6th house / Lagna)
    const house6Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 6) : null;
    const house1Strength = ashtakavargaResult ?
      ashtakavargaResult.houseStrengths.find(h => h.house === 1) : null;
    const lagnaLord = chart.lagnaRasi.lord;
    const lagnaLordData = chart.planets[lagnaLord];
    const healthScore = calculateHealthScore(lagnaLordData, house1Strength, house6Strength);

    let healthKw = lang === 'ml' ? 'കൃത്യമായ ആരോഗ്യ ദിനചര്യകൾ ആവശ്യമാണ്' : 'Health Routines Required';
    let healthIcon = 'Activity';
    if (healthScore >= 75) { healthKw = lang === 'ml' ? 'മികച്ച ആരോഗ്യവും ഊർജ്ജസ്വലതയും' : 'Strong Vitality'; healthIcon = 'Heart'; }
    else if (healthScore < 40) { healthKw = lang === 'ml' ? 'ആരോഗ്യ കാര്യങ്ങളിൽ പ്രത്യേകം ശ്രദ്ധിക്കണം' : 'Health Vulnerabilities'; healthIcon = 'ShieldAlert'; }

    insights.push({
      id: 3,
      keyword: healthKw,
      probability: healthScore,
      icon: healthIcon
    });

    // Sort by probability descending
    insights.sort((a, b) => b.probability - a.probability);

    return insights;
  }

  function getPlanetScore(planetName, chart, ashtakavargaResult) {
    const pData = chart.planets[planetName];
    if (!pData) return 50;

    let score = 45; // Start slightly below 50 to counteract inherent kendra/friend biases
    
    // Dignity
    if (pData.dignity === 'Exalted') score += 20;
    else if (pData.dignity === 'Own' || pData.dignity === 'Moolatrikona') score += 15;
    else if (pData.dignity === 'Friend') score += 5;
    else if (pData.dignity === 'Enemy') score -= 15;
    else if (pData.dignity === 'Debilitated') score -= 25;

    // Ashtakavarga of the house it occupies (Average bindus is ~28)
    if (ashtakavargaResult && ashtakavargaResult.houseStrengths) {
      const hStrength = ashtakavargaResult.houseStrengths.find(h => h.house === pData.house);
      if (hStrength) {
        if (hStrength.bindus >= 32) score += 15;
        else if (hStrength.bindus >= 28) score += 5;
        else if (hStrength.bindus < 24) score -= 10;
        else if (hStrength.bindus < 20) score -= 20;
      }
    }

    // Natural Benefic/Malefic adjustments
    if (planetName === 'Jupiter' || planetName === 'Venus') score += 10;
    if (planetName === 'Saturn' || planetName === 'Mars' || planetName === 'Rahu' || planetName === 'Ketu') score -= 10; // Penalize malefics slightly more for baseline

    // Kendra/Trikona placement vs Dusthana
    if ([1, 4, 7, 10, 5, 9].includes(pData.house)) score += 10;
    if ([6, 8, 12].includes(pData.house)) score -= 20; // Harsher penalty for dusthana

    return Math.max(5, Math.min(95, score));
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
  function generateCoreData(chart, panchanga, currentDasha, lang = 'en') {
    const moonRasi = chart.planets.Moon.rasi;
    const moonNak = chart.planets.Moon.nakshatra;
    
    const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key, lang) : key;

    return {
      janmaRasi: lang === 'ml' ? t(moonRasi.name) : `${t(moonRasi.name)} (${t(moonRasi.eng)})`,
      janmaNakshatra: lang === 'ml' ? `${t(moonNak.name)} (${moonNak.pada}-ാം പാദം)` : `${t(moonNak.name)} (Pada ${moonNak.pada})`,
      nakshatraGana: moonNak.gana ? t(moonNak.gana) : '—',
      nakshatraDeity: moonNak.deity ? t(moonNak.deity) : '—',
      nakshatraQuality: moonNak.quality ? t(moonNak.quality) : '—',
      lagnam: lang === 'ml' ? t(chart.lagnaRasi.name) : `${t(chart.lagnaRasi.name)} (${t(chart.lagnaRasi.eng)})`,
      tithi: panchanga.tithi.name.split(' ').map(p => t(p)).join(' '),
      currentDasha: currentDasha ? (lang === 'ml' ? `${t(currentDasha.maha.lord)} ദശ (ബാക്കി ${currentDasha.maha.remaining.replace('y', ' വർഷം').replace('m', ' മാസം')})` : `${currentDasha.maha.lord} Dasha (${currentDasha.maha.remaining} remaining)`) : 'N/A',
      vara: t(panchanga.vara.eng),
      yoga: t(panchanga.yoga.name),
      karana: t(panchanga.karana.name)
    };
  }

  // ─── Key Life Predictions (Marriage, Children, Travel) ────
  function interpretMarriage(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    const lord7 = VedicCore.getLordOf(7, lagna);
    const lord7Data = chart.planets[lord7];
    const lord5 = VedicCore.getLordOf(5, lagna);
    const lord5Data = chart.planets[lord5];
    const venusData = chart.planets.Venus;

    let timing = lang === 'ml' ? 'സാധാരണ സമയം' : 'Normal (Expected timeframe)';
    if (lord7Data.house === 6 || lord7Data.house === 8 || lord7Data.house === 12 || lord7Data.dignity === 'Debilitated' || chart.planets.Saturn.aspects.includes(7)) {
      timing = lang === 'ml' ? 'കാലതാമസമോ തടസ്സങ്ങളോ ഉണ്ടാകാം; ക്ഷമ ആവശ്യമാണ്' : 'Possible delays or obstacles; patience required';
    } else if (lord7Data.house === 1 || lord7Data.house === 7 || venusData.dignity === 'Exalted') {
      timing = lang === 'ml' ? 'നേരത്തെയുള്ള അല്ലെങ്കിൽ കൃത്യസമയത്തുള്ള വിവാഹം' : 'Early or timely marriage indicated';
    }

    let type = lang === 'ml' ? 'നിശ്ചയിച്ചുറപ്പിച്ച വിവാഹം' : 'Arranged/Traditional';
    // 5th lord (romance) connected to 7th lord (marriage)
    if (lord5Data.house === 7 || lord7Data.house === 5 || lord5Data.house === lord7Data.house || chart.planets.Rahu.house === 7 || chart.planets.Rahu.house === 5) {
      type = lang === 'ml' ? 'പ്രണയവിവാഹം / പ്രണയത്തോടെ നിശ്ചയിച്ച വിവാഹം' : 'Love or Love-cum-arranged';
    }

    // Partner traits based on 7th lord planet
    const traitsMap = {
      Sun: lang === 'ml' ? ['അധികാരമുള്ള', 'ആത്മവിശ്വാസമുള്ള', 'നേതൃത്വഗുണമുള്ള'] : ['Authoritative', 'Confident', 'Leadership'],
      Moon: lang === 'ml' ? ['പരിപാലിക്കുന്ന', 'വൈകാരികതയുള്ള', 'കരുതലുള്ള'] : ['Nurturing', 'Emotional', 'Caring'],
      Mars: lang === 'ml' ? ['കർമ്മനിരതനായ', 'ധീരനായ', 'സ്വതന്ത്രനായ'] : ['Active', 'Assertive', 'Independent'],
      Mercury: lang === 'ml' ? ['ബുദ്ധിമാനായ', 'സംസാരപ്രിയനായ', 'ചെറുപ്പമുള്ള'] : ['Intellectual', 'Communicative', 'Youthful'],
      Jupiter: lang === 'ml' ? ['ഉന്നത വിദ്യാഭ്യാസമുള്ള', 'ആത്മീയതയുള്ള', 'മൂല്യങ്ങളുള്ള'] : ['Highly Educated', 'Spiritual', 'Values'],
      Venus: lang === 'ml' ? ['ആകർഷകമായ', 'കലാപരമായ', 'സന്തുലിതമായ'] : ['Attractive', 'Artistic', 'Harmonious'],
      Saturn: lang === 'ml' ? ['പക്വതയുള്ള', 'അച്ചടക്കമുള്ള', 'യാഥാർത്ഥ്യബോധമുള്ള'] : ['Mature', 'Disciplined', 'Grounded']
    };
    let partnerTraits = traitsMap[lord7] || (lang === 'ml' ? ['പിന്തുണയ്ക്കുന്ന'] : ['Supportive']);

    return { timing, type, partnerTraits };
  }

  function interpretChildren(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    const lord5 = VedicCore.getLordOf(5, lagna);
    const lord5Data = chart.planets[lord5];
    const jupiterData = chart.planets.Jupiter;

    if (lord5Data.house === 6 || lord5Data.house === 8 || lord5Data.house === 12 || lord5Data.dignity === 'Debilitated') {
      return lang === 'ml' ? 'ശ്രദ്ധാപൂർവ്വമായ ആസൂത്രണം ആവശ്യമാണ്; കാലതാമസം ഉണ്ടായേക്കാം' : 'Requires careful planning; possible delays';
    } else if (jupiterData.dignity === 'Exalted' || jupiterData.dignity === 'Own' || lord5Data.dignity === 'Exalted' || lord5Data.dignity === 'Own') {
      return lang === 'ml' ? 'മികച്ച സന്താന ഭാഗ്യം' : 'Highly favorable prospects for children';
    }
    return lang === 'ml' ? 'സാധാരണ സന്താന ഭാഗ്യം' : 'Favorable; standard prospects';
  }

  function interpretFinance(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    const lord2 = VedicCore.getLordOf(2, lagna);
    const lord11 = VedicCore.getLordOf(11, lagna);
    const lord2Data = chart.planets[lord2];
    const lord11Data = chart.planets[lord11];
    
    let title = lang === 'ml' ? 'സ്ഥിരമായ സാമ്പത്തിക വളർച്ച' : 'Steady Financial Growth';
    let description = lang === 'ml' ? 'സാധാരണ വരുമാന മാർഗ്ഗങ്ങൾ; സമ്പാദ്യത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക.' : 'Standard income channels; focus on consistent savings.';
    
    let score = 0;
    if (lord2Data.house === 2 || lord2Data.house === 11 || lord11Data.house === 2 || lord11Data.house === 11) score += 3;
    if (lord2Data.dignity === 'Exalted' || lord11Data.dignity === 'Exalted' || lord2Data.dignity === 'Own' || lord11Data.dignity === 'Own') score += 2;
    if (lord2Data.house === 6 || lord2Data.house === 8 || lord2Data.house === 12) score -= 2;
    
    if (score >= 3) {
      title = lang === 'ml' ? 'ശക്തമായ ധനയോഗം' : 'Strong Wealth & Dhana Yoga';
      description = lang === 'ml' ? 'സമ്പത്ത് വർദ്ധിപ്പിക്കാനും നിക്ഷേപങ്ങൾക്കും മികച്ച സാധ്യതകൾ.' : 'Excellent potential for asset building, investments, and passive income sources.';
    } else if (score < 0) {
      title = lang === 'ml' ? 'സാമ്പത്തിക ഏറ്റക്കുറച്ചിലുകൾ' : 'Financial Fluctuations';
      description = lang === 'ml' ? 'ചെലവുകൾ വരുമാനത്തിന് തുല്യമാകാം; വലിയ നിക്ഷേപങ്ങൾ ഒഴിവാക്കുക.' : 'Expenses may match income; avoid highly speculative investments.';
    }
    
    return { title, description };
  }

  function interpretTravel(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    const lord9 = VedicCore.getLordOf(9, lagna);
    const lord12 = VedicCore.getLordOf(12, lagna);
    const lord9Data = chart.planets[lord9];
    const lord12Data = chart.planets[lord12];
    
    if (lord9Data.house === 9 || lord9Data.house === 12 || lord12Data.house === 9 || lord12Data.house === 12) {
      return lang === 'ml' ? 'വിദേശ യാത്രയ്ക്കോ വിദേശത്ത് സ്ഥിരതാമസമാക്കാനോ ഉള്ള ശക്തമായ സാധ്യതകൾ' : 'Strong indications for foreign travel or settlement';
    } else if (lord9Data.dignity === 'Exalted' || lord12Data.dignity === 'Exalted') {
      return lang === 'ml' ? 'ദൂരയാത്രകൾക്ക് വളരെ അനുകൂലമായ സമയം' : 'Highly favorable for long-distance travel';
    }
    return lang === 'ml' ? 'ഗ്രഹങ്ങളുടെ നിലവിലെ ദശാകാലം അടിസ്ഥാനമാക്കിയുള്ള സാധാരണ യാത്രാ സാധ്യതകൾ' : 'Moderate travel prospects based on current planetary periods';
  }

  // ─── Detailed Health Cautions ─────────────────────────────
  function interpretHealthDetails(chart, lang = 'en') {
    // Body parts mapped to signs (0=Aries...11=Pisces)
    const bodyMap = {
      0: { text: lang === 'ml' ? 'തല/തലച്ചോറ്' : 'Head/Brain', icon: 'Brain' },
      1: { text: lang === 'ml' ? 'തൊണ്ട/മുഖം' : 'Throat/Face', icon: 'Activity' },
      2: { text: lang === 'ml' ? 'കൈകൾ/ശ്വാസകോശം' : 'Arms/Lungs', icon: 'Wind' },
      3: { text: lang === 'ml' ? 'നെഞ്ച്/ഹൃദയം' : 'Chest/Heart', icon: 'Heart' },
      4: { text: lang === 'ml' ? 'വയറ്/ഹൃദയം' : 'Stomach/Heart', icon: 'Activity' },
      5: { text: lang === 'ml' ? 'കുടൽ/ഗ്യാസ്ട്രിക്' : 'Intestines/Gastric', icon: 'Flame' },
      6: { text: lang === 'ml' ? 'വൃക്കകൾ/നടുവേദന' : 'Kidneys/Lower Back', icon: 'Activity' },
      7: { text: lang === 'ml' ? 'പ്രത്യുൽപാദന അവയവങ്ങൾ' : 'Reproductive', icon: 'Activity' },
      8: { text: lang === 'ml' ? 'തുടകൾ/ഇടുപ്പ്' : 'Thighs/Hips', icon: 'Activity' },
      9: { text: lang === 'ml' ? 'കാൽമുട്ടുകൾ/സന്ധികൾ' : 'Knees/Joints', icon: 'Activity' },
      10: { text: lang === 'ml' ? 'കാലിലെ പേശികൾ/ഞരമ്പുകൾ' : 'Calves/Nerves', icon: 'Activity' },
      11: { text: lang === 'ml' ? 'പാദങ്ങൾ/പ്രതിരോധശേഷി' : 'Feet/Immunity', icon: 'ShieldAlert' }
    };

    const lagna = chart.lagnaRasiIndex;
    const house6Rasi = (lagna + 5) % 12; // 6th house sign
    const house8Rasi = (lagna + 7) % 12; // 8th house sign
    
    const vulnerabilities = [];
    vulnerabilities.push(bodyMap[house6Rasi]);
    
    // Add specific planetary vulnerabilities based on 6th lord
    const lord6 = VedicCore.getLordOf(6, lagna);
    if (lord6 === 'Mars') vulnerabilities.push({ text: lang === 'ml' ? 'ശരീരത്തിലെ ചൂട്/വീക്കം' : 'Inflammation/Heat', icon: 'Flame' });
    if (lord6 === 'Mercury') vulnerabilities.push({ text: lang === 'ml' ? 'നാഡീവ്യൂഹം' : 'Nervous System', icon: 'Brain' });
    if (lord6 === 'Venus') vulnerabilities.push({ text: lang === 'ml' ? 'പ്രമേഹം/ചർമ്മം' : 'Sugar/Skin', icon: 'Sparkles' });
    if (lord6 === 'Saturn') vulnerabilities.push({ text: lang === 'ml' ? 'വിട്ടുമാറാത്ത രോഗങ്ങൾ/അസ്ഥികൾ' : 'Chronic/Bones', icon: 'Activity' });
    if (lord6 === 'Moon') vulnerabilities.push({ text: lang === 'ml' ? 'മാനസിക സമ്മർദ്ദം' : 'Mental Stress', icon: 'Brain' });
    
    // Behavioral cautions based on Moon (mind) and Lagna (body)
    const behavioral = [];
    if (chart.planets.Moon.dignity === 'Debilitated' || chart.planets.Saturn.aspects.includes(chart.planets.Moon.house)) {
      behavioral.push({ text: lang === 'ml' ? 'അമിത ചിന്ത ഒഴിവാക്കുക' : 'Avoid Overthinking', icon: 'Brain' });
    }
    if (chart.planets.Mars.dignity === 'Debilitated' || chart.planets.Mars.house === 6) {
      behavioral.push({ text: lang === 'ml' ? 'തർക്കങ്ങൾ ഒഴിവാക്കുക' : 'Avoid Conflict', icon: 'Ban' });
    }
    if (behavioral.length === 0) {
      behavioral.push({ text: lang === 'ml' ? 'കൃത്യമായ ദിനചര്യ പാലിക്കുക' : 'Maintain Routine', icon: 'Calendar' });
      behavioral.push({ text: lang === 'ml' ? 'ആരോഗ്യകരമായ ഭക്ഷണം' : 'Mindful Eating', icon: 'Activity' });
    }

    const cautions = lang === 'ml' ? ['ജോലിയും ജീവിതവും തമ്മിലുള്ള സന്തുലിതാവസ്ഥ', 'മാനസിക സമ്മർദ്ദം നിയന്ത്രിക്കുക'] : ['Work-life balance', 'Manage stress levels proactively'];

    // Longevity Analysis (BPHS Ch. 44)
    const lord8 = VedicCore.getLordOf(8, lagna);
    const l8Data = chart.planets[lord8];
    const lagnaLord = VedicCore.getLordOf(1, lagna);
    const llData = chart.planets[lagnaLord];
    
    let longevityText = lang === 'ml' ? 'സാധാരണ ആരോഗ്യദൈർഘ്യം' : 'Moderate Vitality and Longevity';
    
    // Balarishta condition (Moon in 6,8,12 aspected by malefics)
    const moonH = chart.planets.Moon.house;
    if ([6, 8, 12].includes(moonH)) {
        longevityText = lang === 'ml' ? 'ബാലാരിഷ്ടത (കുട്ടിക്കാലത്തെ ആരോഗ്യപ്രശ്നങ്ങൾ ശ്രദ്ധിക്കുക)' : 'Balarishta indications: Requires care during early childhood';
    } 
    // Strong longevity condition
    else if (['Exalted', 'Own', 'Friendly'].includes(llData.dignity) && ['Exalted', 'Own', 'Friendly'].includes(l8Data.dignity)) {
        longevityText = lang === 'ml' ? 'ദീർഘായുസ്സും മികച്ച ആരോഗ്യവും' : 'Purna Ayus (Long Life) indicated by strong Lagna and 8th Lord';
    }

    return { 
      vulnerabilities: vulnerabilities.slice(0,4), 
      behavioral: behavioral.slice(0,2), 
      cautions,
      longevity: longevityText
    };
  }

  function interpretFamily(chart, lang = 'en') {
    const lagna = chart.lagnaRasiIndex;
    
    // Father (9th house & Sun)
    const lord9 = VedicCore.getLordOf(9, lagna);
    const h9Data = chart.houses[9];
    const l9Data = chart.planets[lord9];
    const sunData = chart.planets.Sun;
    
    // Mother (4th house & Moon)
    const lord4 = VedicCore.getLordOf(4, lagna);
    const h4Data = chart.houses[4];
    const l4Data = chart.planets[lord4];
    const moonData = chart.planets.Moon;
    
    // Siblings (3rd house & Mars)
    const lord3 = VedicCore.getLordOf(3, lagna);
    const h3Data = chart.houses[3];
    const l3Data = chart.planets[lord3];
    const marsData = chart.planets.Mars;

    const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key, lang) : key;

    const getStatus = (lordDignity, karakaDignity, houseOccupants) => {
      let score = 0;
      if (['Exalted', 'Own', 'Friendly'].includes(lordDignity)) score++;
      else if (lordDignity === 'Debilitated') score--;
      if (['Exalted', 'Own', 'Friendly'].includes(karakaDignity)) score++;
      else if (karakaDignity === 'Debilitated') score--;
      
      const malefics = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
      const hasMalefics = houseOccupants.some(p => malefics.includes(p));
      if (hasMalefics) score--;

      if (score > 0) return lang === 'ml' ? 'അനുകൂലവും പിന്തുണ നൽകുന്നതും' : 'Favorable and supportive';
      if (score < 0) return lang === 'ml' ? 'പ്രതിസന്ധികളോ അകൽച്ചയോ ഉണ്ടായേക്കാം' : 'May face challenges or distance';
      return lang === 'ml' ? 'സാധാരണ ബന്ധം' : 'Moderate relationship';
    };

    return {
      title: lang === 'ml' ? 'കുടുംബം (മാതാപിതാക്കളും സഹോദരങ്ങളും)' : 'Family (Parents & Siblings)',
      father: {
        title: lang === 'ml' ? 'പിതാവ് (9-ാം ഭാവം)' : 'Father (9th House)',
        lord: `${lord9} (${l9Data.dignity})`,
        karaka: `Sun (${sunData.dignity})`,
        status: getStatus(l9Data.dignity, sunData.dignity, h9Data.occupants)
      },
      mother: {
        title: lang === 'ml' ? 'മാതാവ് (4-ാം ഭാവം)' : 'Mother (4th House)',
        lord: `${lord4} (${l4Data.dignity})`,
        karaka: `Moon (${moonData.dignity})`,
        status: getStatus(l4Data.dignity, moonData.dignity, h4Data.occupants)
      },
      siblings: {
        title: lang === 'ml' ? 'സഹോദരങ്ങൾ (3-ാം ഭാവം)' : 'Siblings (3rd House)',
        lord: `${lord3} (${l3Data.dignity})`,
        karaka: `Mars (${marsData.dignity})`,
        status: getStatus(l3Data.dignity, marsData.dignity, h3Data.occupants)
      }
    };
  }

  function generateLifePredictions(chart, dashaResult, lang = 'en') {
    return {
      family: interpretFamily(chart, lang),
      finance: interpretFinance(chart, lang),
      marriage: interpretMarriage(chart, lang),
      children: interpretChildren(chart, lang),
      travel: interpretTravel(chart, lang),
      health: interpretHealthDetails(chart, lang)
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
    interpretHealthDetails,
    getPlanetScore,
    generateLifePredictions,
    PLANET_REMEDIES,
    LAGNA_TRAITS
  };
})();

if (typeof window !== 'undefined') window.Interpretation = Interpretation;
