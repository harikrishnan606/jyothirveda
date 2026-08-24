const i18nData = {
  en: {}, // English falls back to the key itself if not specified
  ml: {
    // Nav/Tabs
    "Basic Details": "അടിസ്ഥാന വിവരങ്ങൾ",
    "Rasi & Navamsa": "രാശിയും നവാംശവും",
    "Planetary Positions": "ഗ്രഹ നിലകൾ",
    "Ashtakavarga": "അഷ്ടകവർഗ്ഗം",
    "Yogas & Doshas": "യോഗങ്ങളും ദോഷങ്ങളും",
    "Life Predictions": "ജീവിത പ്രവചനങ്ങൾ",
    "Dasha Timeline": "ദശാ കാലഘട്ടം",
    
    // UI Headers
    "Cosmic Blueprint": "ജ്യോതിഷ ജാതകം",
    "Live Computation": "തത്സമയ കണക്കുകൂട്ടൽ",
    "Top Cosmic Signatures": "പ്രധാന ജ്യോതിഷ സൂചനകൾ",
    "Core Jyothisha Data": "അടിസ്ഥാന ജ്യോതിഷ വിവരങ്ങൾ",

    // Form Labels
    "Full Name": "പൂർണ്ണ നാമം",
    "Date of Birth": "ജനനതീയതി",
    "Time of Birth": "ജനന സമയം",
    "Birth Place (Latitude)": "ജനന സ്ഥലം (അക്ഷാംശം)",
    "Birth Place (Longitude)": "ജനന സ്ഥലം (രേഖാംശം)",
    "Generate Vedic Chart": "ജാതകം തയ്യാറാക്കുക",
    
    // Basic Details values
    "Name": "പേര്",
    "Gender": "ലിംഗം",
    "Lagna (Ascendant)": "ലഗ്നം",
    "Rasi (Moon Sign)": "രാശി (ചന്ദ്ര രാശി)",
    "Nakshatra (Star)": "നക്ഷത്രം",
    "Thithi": "തിഥി",
    "Karana": "കരണം",
    "Nithya Yoga": "നിത്യ യോഗം",
    "Ayanamsa": "അയനാംശം",
    "Male": "പുരുഷൻ",
    "Female": "സ്ത്രീ",
    
    // Planets
    "Sun": "സൂര്യൻ",
    "Moon": "ചന്ദ്രൻ",
    "Mars": "ചൊവ്വ",
    "Mercury": "ബുധൻ",
    "Jupiter": "വ്യാഴം",
    "Venus": "ശുക്രൻ",
    "Saturn": "ശനി",
    "Rahu": "രാഹു",
    "Ketu": "കേതു",
    "Ascendant": "ലഗ്നം",
    
    // Zodiac / Rasi
    "Aries": "മേടം",
    "Taurus": "ഇടവം",
    "Gemini": "മിഥുനം",
    "Cancer": "കർക്കിടകം",
    "Leo": "ചിങ്ങം",
    "Virgo": "കന്നി",
    "Libra": "തുലാം",
    "Scorpio": "വൃശ്ചികം",
    "Sagittarius": "ധനു",
    "Capricorn": "മകരം",
    "Aquarius": "കുംഭം",
    "Pisces": "മീനം",
    
    // Nakshatras
    "Ashwini": "അശ്വതി",
    "Bharani": "ഭരണി",
    "Krittika": "കാർത്തിക",
    "Rohini": "രോഹിണി",
    "Mrigashira": "മകയിരം",
    "Ardra": "തിരുവാതിര",
    "Punarvasu": "പുണർതം",
    "Pushya": "പൂയം",
    "Ashlesha": "ആയില്യം",
    "Magha": "മകം",
    "Purva Phalguni": "പൂരം",
    "Uttara Phalguni": "ഉത്രം",
    "Hasta": "അത്തം",
    "Chitra": "ചിത്തിര",
    "Swati": "ചോതി",
    "Vishakha": "വിശാഖം",
    "Anuradha": "അനിഴം",
    "Jyeshtha": "തൃക്കേട്ട",
    "Mula": "മൂലം",
    "Purva Ashadha": "പൂരാടം",
    "Uttara Ashadha": "ഉത്രാടം",
    "Shravana": "തിരുവോണം",
    "Dhanishta": "അവിട്ടം",
    "Shatabhisha": "ചതയം",
    "Purva Bhadrapada": "പൂരുരുട്ടാതി",
    "Uttara Bhadrapada": "ഉത്രട്ടാതി",
    "Revati": "രേവതി",
    
    // Dignity
    "Exalted": "ഉച്ചം",
    "Moolatrikona": "മൂലത്രികോണം",
    "Own": "സ്വക്ഷേത്രം",
    "Friend": "മിത്രം",
    "Neutral": "സമം",
    "Enemy": "ശത്രു",
    "Debilitated": "നീചം",
    
    // Table Headers
    "Planet": "ഗ്രഹം",
    "Sign": "രാശി",
    "Degree": "ഡിഗ്രി",
    "House": "ഭാവം",
    "Nakshatra": "നക്ഷത്രം",
    "Pada": "പാദം",
    "Dignity": "അവസ്ഥ",
    
    // Houses & Titles
    "House 1": "1-ാം ഭാവം", "House 2": "2-ാം ഭാവം", "House 3": "3-ാം ഭാവം",
    "House 4": "4-ാം ഭാവം", "House 5": "5-ാം ഭാവം", "House 6": "6-ാം ഭാവം",
    "House 7": "7-ാം ഭാവം", "House 8": "8-ാം ഭാവം", "House 9": "9-ാം ഭാവം",
    "House 10": "10-ാം ഭാവം", "House 11": "11-ാം ഭാവം", "House 12": "12-ാം ഭാവം",
    "Rasi Chart": "രാശി ചക്രം",
    "Navamsa Chart": "നവാംശ ചക്രം",
    "Sarvashtakavarga": "സർവ്വാഷ്ടകവർഗ്ഗം",
    "Bindus": "ബിന്ദുക്കൾ",
    "Yogas Present": "യോഗങ്ങൾ",
    "Doshas Detected": "ദോഷങ്ങൾ",
    "No major doshas detected in the birth chart.": "ജാതകത്തിൽ പ്രധാന ദോഷങ്ങളൊന്നും കണ്ടെത്തിയിട്ടില്ല.",
    "Career & Profession Insights": "കരിയർ & പ്രൊഫഷൻ",
    "Health & Vitality Overview": "ആരോഗ്യം",
    "Marriage & Relationships": "വിവാഹം & ബന്ധങ്ങൾ",
    "Astrological Remedies & Recommendations": "ജ്യോതിഷ പരിഹാരങ്ങൾ",
    
    // Graph
    "Experience Rating Trajectory": "ജീവിതാനുഭവങ്ങളുടെ ഗ്രാഫ്",
    "Dasha": "ദശ",
    "Year": "വർഷം",
    "Starts": "തുടങ്ങുന്നത്",
    "Experience Rating": "അനുഭവ നിലവാരം",
    "Outstanding Period": "മികച്ച കാലഘട്ടം",
    "Favorable Period": "അനുകൂല കാലഘട്ടം",
    "Average Period": "സാധാരണ കാലഘട്ടം",
    "Challenging Period": "പ്രതികൂല കാലഘട്ടം",
    "Excellent": "മികച്ചത്",
    "Average": "ശരാശരി",
    "Challenging": "പ്രതികൂലം",
    "End": "അവസാനം",
    "End Date": "അവസാന തീയതി",

    // Miscellanous UI
    "Loading astrological engines...": "ജ്യോതിഷ ഡാറ്റ തയ്യാറാക്കുന്നു...",
    "Chart computation failed": "ജാതകം തയ്യാറാക്കുന്നതിൽ പരാജയപ്പെട്ടു",
    "Current Vimshottari Dasha": "നിലവിലെ വിംശോത്തരി ദശ",
    "remaining": "ബാക്കിയുണ്ട്",
    
    // Yoga specific strings
    "Gaja Kesari Yoga": "ഗജ കേശരീ യോഗം",
    "Ruchaka Yoga": "രുചക യോഗം",
    "Bhadra Yoga": "ഭദ്ര യോഗം",
    "Hamsa Yoga": "ഹംസ യോഗം",
    "Malavya Yoga": "മാളവ്യ യോഗം",
    "Shasha Yoga": "ശശ യോഗം",
    "Sunapha Yoga": "സുനഫാ യോഗം",
    "Anapha Yoga": "അനഫാ യോഗം",
    "Durdhura Yoga": "ദുർധുരാ യോഗം",
    "Vesi Yoga": "വേസി യോഗം",
    "Vasi Yoga": "വാസി യോഗം",
    "Obhayachari Yoga": "ഉഭയചാരി യോഗം",
    "Amala Yoga": "അമല യോഗം",
    "Budhaditya Yoga": "ബുധാദിത്യ യോഗം",
    "Chandra-Mangala Yoga": "ചന്ദ്ര-മംഗള യോഗം",
    "Lakshmi Yoga": "ലക്ഷ്മി യോഗം",
    "Dhana Yoga": "ധന യോഗം",
    
    // Doshas
    "Kuja Dosha (Manglik)": "കുജ ദോഷം (ചൊവ്വാ ദോഷം)",
    "Kala Sarpa Dosha": "കാല സർപ്പ ദോഷം",
    "Kemadruma Dosha": "കേമദ്രുമ ദോഷം",
    "Guru Chandala Dosha": "ഗുരു ചണ്ഡാല ദോഷം",
    "Pitra Dosha": "പിതൃ ദോഷം"
  }
};

const i18n = {
  t: (key, lang = 'en') => {
    if (!key) return '';
    if (lang === 'en' || !i18nData[lang] || !i18nData[lang][key]) {
      return i18nData['en'][key] || key;
    }
    return i18nData[lang][key];
  }
};

if (typeof window !== 'undefined') window.i18n = i18n;
