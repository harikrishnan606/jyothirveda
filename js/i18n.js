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
    "Ketu Antardasha": "കേതു അപഹാരം",
    "Venus Antardasha": "ശുക്രൻ അപഹാരം",
    "Sun Antardasha": "സൂര്യൻ അപഹാരം",
    "Moon Antardasha": "ചന്ദ്രൻ അപഹാരം",
    
    // Core Data labels & Chart
    "Janma Rasi (Moon)": "ജന്മരാശി (ചന്ദ്രൻ)",
    "Janma Nakshatra": "ജന്മനക്ഷത്രം",
    "Lagnam (Ascendant)": "ലഗ്നം (Ascendant)",
    "Tithi": "തിഥി",
    "Vara": "ആഴ്ച (ദിവസം)",
    "Yoga": "നിത്യ യോഗം",
    "Karana": "കരണം",
    "Current Dasha": "നിലവിലെ ദശ",
    "Lagnam": "ലഗ്നം",
    "Retrograde": "വക്രഗതി",
    "Divisional Charts": "വിഭാഗീയ ചക്രങ്ങൾ",
    "Rasi Chart": "രാശി ചക്രം",
    "Navamsa Chart": "നവാംശ ചക്രം",
    "Rasi": "രാശി",
    "Navamsa": "നവാംശം",
    "South Indian Style": "ദക്ഷിണേന്ത്യൻ രീതി",
    "Asc": "ലഗ്നം",
    
    // Rasi Grid cell labels
    "MESHA": "മേടം",
    "VRISHABHA": "ഇടവം",
    "MITHUNA": "മിഥുനം",
    "KARKATAKA": "കർക്കിടകം",
    "SIMHA": "ചിങ്ങം",
    "KANYA": "കന്നി",
    "TULA": "തുലാം",
    "VRISCHIKA": "വൃശ്ചികം",
    "DHANUS": "ധനു",
    "MAKARA": "മകരം",
    "KUMBHA": "കുംഭം",
    "MEENA": "മീനം",
    
    // Planet Abbreviations
    "Su": "സൂ",
    "Mo": "ച",
    "Ma": "ചൊ",
    "Me": "ബു",
    "Ju": "വ്യാ",
    "Ve": "ശു",
    "Sa": "ശ",
    "Ra": "രാ",
    "Ke": "കേ",
    
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
    "Comprehensive Analysis": "വിശദമായ വിശകലനം",
    "Dasha": "ദശ",
    "Year": "വർഷം",
    "Starts": "തുടങ്ങുന്നത്",
    "Experience Rating": "അനുഭവ നിലവാരം",
    "Outstanding Period": "മികച്ച കാലഘട്ടം",
    
    // Side panel & loader
    "Save Profile": "പ്രൊഫൈൽ സേവ് ചെയ്യുക",
    "Saved Profiles": "സേവ് ചെയ്ത പ്രൊഫൈലുകൾ",
    "Results update automatically as you type.": "വിവരങ്ങൾ നൽകുമ്പോൾ ഫലങ്ങൾ തനിയെ അപ്ഡേറ്റ് ആകും.",
    "Computing Positions...": "ഗ്രഹങ്ങൾ കണക്കുകൂട്ടുന്നു...",
    "Engine": "എഞ്ചിൻ",
    "Houses": "ഭാവങ്ങൾ",
    "Whole-sign (Rāśi = Bhāva)": "രാശി = ഭാവം",
    "No significant yogas detected.": "പ്രധാന യോഗങ്ങളൊന്നും കണ്ടെത്തിയിട്ടില്ല.",
    "DISPUTED": "തർക്കവിഷയം",
    "Mitigation": "പരിഹാരം",
    "valid": "ശരി",
    "expected 337": "പ്രതീക്ഷിക്കുന്നത് 337",
    "Favorable Period": "അനുകൂല കാലഘട്ടം",
    "Average Period": "സാധാരണ കാലഘട്ടം",
    "Challenging Period": "പ്രതികൂല കാലഘട്ടം",
    "Type a city name...": "നഗരത്തിന്റെ പേര് നൽകുക...",
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
,
    "Mesha": "മേടം",
    "Vrishabha": "ഇടവം",
    "Mithuna": "മിഥുനം",
    "Karkataka": "കർക്കിടകം",
    "Simha": "ചിങ്ങം",
    "Kanya": "കന്നി",
    "Tula": "തുലാം",
    "Vrischika": "വൃശ്ചികം",
    "Dhanus": "ധനു",
    "Makara": "മകരം",
    "Kumbha": "കുംഭം",
    "Meena": "മീനം",
    "Sunday": "ഞായർ",
    "Monday": "തിങ്കൾ",
    "Tuesday": "ചൊവ്വ",
    "Wednesday": "ബുധൻ",
    "Thursday": "വ്യാഴം",
    "Friday": "വെള്ളി",
    "Saturday": "ശനി",
    "Ravivara": "ഞായർ",
    "Somavara": "തിങ്കൾ",
    "Mangalavara": "ചൊവ്വ",
    "Budhavara": "ബുധൻ",
    "Guruvara": "വ്യാഴം",
    "Shukravara": "വെള്ളി",
    "Shanivara": "ശനി",
    "Shukla": "ശുക്ല",
    "Krishna": "കൃഷ്ണ",
    "Pratipada": "പ്രഥമ",
    "Dwitiya": "ദ്വിതീയ",
    "Tritiya": "തൃതീയ",
    "Chaturthi": "ചതുർത്ഥി",
    "Panchami": "പഞ്ചമി",
    "Shashthi": "ഷഷ്ഠി",
    "Saptami": "സപ്തമി",
    "Ashtami": "അഷ്ടമി",
    "Navami": "നവമി",
    "Dashami": "ദശമി",
    "Ekadashi": "ഏകാദശി",
    "Dwadashi": "ദ്വാദശി",
    "Trayodashi": "ത്രയോദശി",
    "Chaturdashi": "ചതുർദശി",
    "Purnima / Amavasya": "പൗർണ്ണമി / അമാവാസി",
    "Vishkumbha": "വിഷ്കുംഭ",
    "Priti": "പ്രീതി",
    "Ayushman": "ആയുഷ്മാൻ",
    "Saubhagya": "സൗഭാഗ്യ",
    "Shobhana": "ശോഭന",
    "Atiganda": "അതിഗണ്ഡ",
    "Sukarma": "സുകർമ്മ",
    "Dhriti": "ധൃതി",
    "Shula": "ശൂല",
    "Ganda": "ഗണ്ഡ",
    "Vriddhi": "വൃദ്ധി",
    "Dhruva": "ധ്രുവ",
    "Vyaghata": "വ്യാഘാത",
    "Harshana": "ഹർഷണ",
    "Vajra": "വജ്ര",
    "Siddhi": "സിദ്ധി",
    "Vyatipata": "വ്യതിപാത",
    "Variyan": "വരിയാൻ",
    "Parigha": "പരിഘ",
    "Shiva": "ശിവ",
    "Siddha": "സിദ്ധ",
    "Sadhya": "സാധ്യ",
    "Shubha": "ശുഭ",
    "Brahma": "ബ്രഹ്മ",
    "Indra": "ഇന്ദ്ര",
    "Vaidhriti": "വൈധൃതി",
    "Kimstughna": "കിംസ്തുഘ്ന",
    "Shakuni": "ശകുനി",
    "Chatushpada": "ചതുഷ്പാദ",
    "Nagava": "നാഗവ",
    "Bava": "ബവ",
    "Balava": "ബാലവ",
    "Kaulava": "കൗലവ",
    "Taitila": "തൈതില",
    "Gara": "ഗര",
    "Vanija": "വണിജ",
    "Vishti": "വിഷ്ടി",
    "Raja Yoga": "രാജ യോഗം",
    "Raja Yoga (Yogakaraka)": "രാജ യോഗം (യോഗകാരക)",
    "High status, authority, career success": "ഉയർന്ന പദവി, അധികാരം, തൊഴിൽ വിജയം",
    "Effortless success, prominent position": "പ്രയത്നമില്ലാത്ത വിജയം, പ്രമുഖ സ്ഥാനം",
    "Great financial gain, wealth accumulation": "മികച്ച സാമ്പത്തിക നേട്ടം, സമ്പത്ത് വർദ്ധനവ്",
    "Active when Dasha of either planet operates": "ഈ ഗ്രഹങ്ങളുടെ ദശാകാലത്ത് സജീവമാകും",
    "Wealth accumulation during relevant Dashas": "അനുയോജ്യമായ ദശാകാലത്ത് സമ്പത്ത് വർദ്ധിക്കും",
    "HIGH": "ഉയർന്ന",
    "MODERATE": "ഇടത്തരം",
    "LOW": "കുറഞ്ഞ",
    "Strong": "ശക്തം",
    "Moderate": "ഇടത്തരം",
    "Weak": "ദുർബലം",
    "Cancelled": "റദ്ദാക്കപ്പെട്ടു",
    "Absent": "ഇല്ല",
    "No cancellation": "റദ്ദാക്കൽ ഇല്ല",
    "Cancelled/Mitigated": "റദ്ദാക്കപ്പെട്ടു/കുറഞ്ഞു",
    "Manglik Dosha": "കുജ ദോഷം",
    "Mars in 1/2/4/7/8/12 from Lagna, Moon, or Venus": "ലഗ്നം, ചന്ദ്രൻ അല്ലെങ്കിൽ ശുക്രനിൽ നിന്നും 1/2/4/7/8/12 ഭാവങ്ങളിൽ ചൊവ്വ",
    "Severe": "തീവ്രം",
    "Moderate (from Lagna)": "ഇടത്തരം (ലഗ്നത്തിൽ നിന്ന്)",
    "Moderate (from Moon)": "ഇടത്തരം (ചന്ദ്രനിൽ നിന്ന്)",
    "Mild (from Venus only)": "ചെറുത് (ശുക്രനിൽ നിന്ന് മാത്രം)",
    "No cancellation found": "റദ്ദാക്കൽ ഇല്ല",
    "Jupiter aspects/conjoins Mars": "വ്യാഴത്തിന്റെ ദൃഷ്ടി/കൂടിച്ചേരൽ ചൊവ്വയിലുണ്ട്",
    "Dosha effects significantly reduced": "ദോഷ ഫലങ്ങൾ ഗണ്യമായി കുറഞ്ഞു",
    "May cause delays or friction in marriage; seek matching with Manglik partner": "വിവാഹത്തിൽ താമസമോ തർക്കങ്ങളോ ഉണ്ടാകാം; പൊരുത്തമുള്ള പങ്കാളിയെ കണ്ടെത്തുക",
    "All planets between Rahu and Ketu": "രാഹു-കേതുക്കൾക്കിടയിൽ എല്ലാ ഗ്രഹങ്ങളും",
    "All planets hemmed between Rahu and Ketu": "രാഹു-കേതുക്കൾക്കിടയിൽ എല്ലാ ഗ്രഹങ്ങളും കുടുങ്ങിക്കിടക്കുന്നു",
    "May cause delays in success, unexpected reversals": "വിജയത്തിൽ കാലതാമസം, അപ്രതീക്ഷിത തിരിച്ചടികൾ എന്നിവയ്ക്ക് സാധ്യത",
    "No planets on either side of Moon": "ചന്ദ്രന്റെ ഇരുവശങ്ങളിലും ഗ്രഹങ്ങളില്ല",
    "No planets in 2nd or 12th from Moon": "ചന്ദ്രനിൽ നിന്ന് 2-ലോ 12-ലോ ഗ്രഹങ്ങളില്ല",
    "Mental anxiety, feeling unsupported": "മാനസിക ഉത്കണ്ഠ, പിന്തുണയില്ലാത്ത തോന്നൽ",
    "Dosha cancelled, mental strength restored": "ദോഷം റദ്ദാക്കപ്പെട്ടു, മാനസിക ബലം തിരികെ ലഭിച്ചു",
    "Jupiter aspects Moon": "വ്യാഴത്തിന്റെ ദൃഷ്ടി ചന്ദ്രനിലുണ്ട്",
    "Planets in Kendra from Moon/Lagna": "ചന്ദ്രനിൽ നിന്നോ ലഗ്നത്തിൽ നിന്നോ കേന്ദ്രത്തിൽ ഗ്രഹങ്ങളുണ്ട്",
    "Total": "ആകെ",
    "Yogas": "യോഗങ്ങൾ",
    "Doshas": "ദോഷങ്ങൾ",
    "Pancha Mahapurusha": "പഞ്ചമഹാപുരുഷ യോഗങ്ങൾ",
    "Sade Sati": "ഏഴര ശനി",
    "Lagna": "ലഗ്നം",
    "Lagna Lord": "ലഗ്നാധിപൻ",
    "Lagna Nakshatra": "ലഗ്ന നക്ഷത്രം",
    "Strengths": "ശക്തികൾ",
    "Challenges": "വെല്ലുവിളികൾ",
    "Hidden Potential": "മറഞ്ഞിരിക്കുന്ന കഴിവുകൾ",
    "Career Fields": "തൊഴിൽ മേഖലകൾ",
    "Recognition": "അംഗീകാരം",
    "Financial Return": "സാമ്പത്തിക നേട്ടം",
    "10th Lord": "10-ാം ഭാവാധിപൻ",
    "Occupants": "ഗ്രഹങ്ങൾ",
    "Foreign Travel & Residence": "വിദേശ യാത്രയും താമസവും",
    "Marriage": "വിവാഹം",
    "Partner": "പങ്കാളി",
    "Children": "കുട്ടികൾ",
    "Cautions": "മുന്നറിയിപ്പുകൾ",
    "Karmic Balancers": "കർമ്മ പരിഹാരങ്ങൾ",
    "Note: Remedies are traditional suggestions. No guarantees are made. Jyotiṣa is an interpretive lens, not a substitute for professional advice.": "കുറിപ്പ്: പരിഹാരങ്ങൾ പരമ്പരാഗത നിർദ്ദേശങ്ങൾ മാത്രമാണ്. ജ്യോതിഷം ഒരു വ്യാഖ്യാന ശാസ്ത്രമാണ്, പ്രൊഫഷണൽ ഉപദേശത്തിന് പകരമാവില്ല.",
    "Life Periods (120-Year Cycle)": "ജീവിത കാലഘട്ടങ്ങൾ (120 വർഷത്തെ ചക്രം)",
    "Currently Running": "നിലവിൽ നടക്കുന്നത്",
    "Maha": "മഹാ",
    "House Strength (SAV)": "ഭാവ ബലം (സർവ്വാഷ്ടകവർഗ്ഗം)",
    "Total SAV": "ആകെ ബലം",
    "Average per house": "ശരാശരി (ഒരു ഭാവത്തിന്)",
    "Strongest": "ഏറ്റവും ശക്തം",
    "Weakest": "ഏറ്റവും ദുർബലം",
    "Relative astrological strength — interpretive, not statistical. Scoring: BPHS Ashtakavarga tables applied to computed positions.": "ജ്യോതിഷപരമായ ബലം — ഇവ സ്ഥിതിവിവരക്കണക്കുകളല്ല, വ്യാഖ്യാനങ്ങൾ മാത്രമാണ്. BPHS അഷ്ടകവർഗ്ഗ പട്ടികയെ അടിസ്ഥാനമാക്കിയാണ് ഇത് കണക്കാക്കിയിരിക്കുന്നത്.",
    "Birth Place (City/Town)": "ജനിച്ച സ്ഥലം (നഗരം/പട്ടണം)",
    "Budha-Aditya Yoga": "ബുധ-ആദിത്യ യോഗം",
    "Sun-Mercury conjunction": "സൂര്യ-ബുധ കൂടിച്ചേരൽ",
    "Intelligence, strong communication, success in business": "ബുദ്ധിശക്തി, മികച്ച ആശയവിനിമയം, ബിസിനസ്സിൽ വിജയം",
    "Neecha Bhanga Raja Yoga": "നീച ഭംഗ രാജ യോഗം",
    "Rise from humble beginnings": "താഴ്ന്ന നിലയിൽ നിന്നുള്ള ഉയർച്ച",
    "Planets on both sides of Rahu-Ketu axis — no Kala Sarpa": "രാഹു-കേതു അച്ചുതണ്ടിന്റെ ഇരുവശത്തും ഗ്രഹങ്ങളുണ്ട് — കാലസർപ്പ ദോഷമില്ല",
    "Not applicable": "ബാധകമല്ല",
    "N/A": "ബാധകമല്ല",
    "Planets present in 2nd/12th from Moon — no Kemadruma": "ചന്ദ്രനിൽ നിന്ന് 2/12 ഭാവങ്ങളിൽ ഗ്രഹങ്ങളുണ്ട് — കേമദ്രുമ ദോഷമില്ല",
    "Effects mitigated": "ദോഷ ഫലങ്ങൾ ലഘൂകരിച്ചു",
    "All 7 planets hemmed between Rahu-Ketu axis": "എല്ലാ 7 ഗ്രഹങ്ങളും രാഹു-കേതു അച്ചുതണ്ടിൽ കുടുങ്ങിക്കിടക്കുന്നു",
    "No planet (Mars-Saturn) in 2nd or 12th from Moon": "ചന്ദ്രനിൽ നിന്ന് 2 അല്ലെങ്കിൽ 12 ഭാവങ്ങളിൽ ഗ്രഹങ്ങളില്ല",

    // Dasha Timeline labels
    "Outstanding Period": "മികച്ച കാലഘട്ടം",
    "Favorable Period": "അനുകൂല കാലഘട്ടം",
    "Challenging Period": "പ്രതികൂല കാലഘട്ടം",
    "Average Period": "സാധാരണ കാലഘട്ടം",

    // Graph reference line labels
    "Excellent": "മികവ്",
    "Average": "സാധാരണ",
    "Challenging": "പ്രതികൂലം",
    "End": "അവസാനം",

    // Ashtakavarga
    "valid": "ശരിയാണ്",
    "expected 337": "പ്രതീക്ഷിത: 337",

    // Form/profile
    "Save Profile": "പ്രൊഫൈൽ സൂക്ഷിക്കുക",
    "Saved Profiles": "സൂക്ഷിച്ച പ്രൊഫൈലുകൾ",

    // Dosha section labels
    "DISPUTED": "തർക്കവിഷയം",
    "Partial": "ഭാഗിക",
    "Full": "പൂർണ്ണം",
    "Absent": "ഇല്ല",
    "Not applicable": "ബാധകമല്ല",
    "N/A": "ബാധകമല്ല",
    "Kala Sarpa Dosha": "കാല സർപ്പ ദോഷം",
    "Kemadruma Dosha": "കേമദ്രുമ ദോഷം",
    "No planet (Mars-Saturn) in 2nd or 12th from Moon": "ചന്ദ്രനിൽ നിന്ന് 2/12 ഭാവങ്ങളിൽ ഗ്രഹങ്ങളില്ല",
    "All planets between Rahu and Ketu — Kala Sarpa configuration present": "രാഹു-കേതുക്കൾക്കിടയിൽ എല്ലാ ഗ്രഹങ്ങളും — കാലസർപ്പ ദോഷമുണ്ട്",
    "Karmic delays and sudden reversals in life themes": "കർമ്മ താമസങ്ങളും ജീവിതത്തിലെ അപ്രതീക്ഷിത തിരിച്ചടികളും",
    "Possible periods of isolation or financial instability": "ഒറ്റപ്പെടലിന്റെ അല്ലെങ്കിൽ സാമ്പത്തിക അസ്ഥിരതയുടെ ഘട്ടങ്ങൾ",
    "No planes flanking the Moon — Kemadruma present": "ചന്ദ്രനു ചുറ്റും ഗ്രഹങ്ങളില്ല — കേമദ്രുമ ദോഷം",
    "Kala Sarpa Dosha is not found in core classical texts (BPHS). It is a popular/later tradition.": "കാലസർപ്പ ദോഷം ക്ലാസിക്കൽ ഗ്രന്ഥങ്ങളിൽ (BPHS) ഉൾപ്പെടുന്നില്ല. ഇത് ഒരു ജനകീയ/ആധുനിക പാരമ്പര്യം മാത്രമാണ്.",

    // Wisdom/Jupiter Yoga
    "Wisdom, wealth, and respect; activated during Jupiter/Moon Dashas": "ജ്ഞാനം, ധനം, ബഹുമാനം; വ്യാഴ-ചന്ദ്ര ദശകളിൽ സജീവമാകും",
    "Weakened by Jupiter's debilitation": "വ്യാഴത്തിന്റെ നീചത്വം മൂലം ദുർബലമായി",

    // Mercury combust
    "Weak (Mercury combust)": "ദുർബലം (ബുധൻ കൂടിച്ചേർന്ന്)",
    "Mercury is combust, weakening the yoga": "ബുധൻ ദഹിക്കപ്പെട്ടതിനാൽ യോഗം ദുർബലമായി",
    "Intelligence and communication skills": "ബുദ്ധിശക്തിയും ആശയവിനിമയ കഴിവും"
  }
};

const i18n = {
  t: (key, lang = 'en') => {
    if (!key) return '';
    
    if (lang !== 'en' && i18nData[lang] && i18nData[lang][key]) {
      return i18nData[lang][key];
    }
    
    if (lang === 'ml') {
        let str = key;
        
        if (str.includes('rules both a Kendra and Trikona house')) {
            const parts = str.split(' rules both a Kendra and Trikona house');
            return `${i18n.t(parts[0], lang)} കേന്ദ്ര-ത്രികോണ ഭാവങ്ങളുടെ അധിപനാണ്`;
        }
        
        if (str.includes(' (Kendra lord) + ')) {
            const parts = str.split(' (Kendra lord) + ');
            const p1 = i18n.t(parts[0], lang);
            const p2Parts = parts[1].split(' (');
            const p2 = i18n.t(p2Parts[0], lang);
            const type = p2Parts[1].includes('Kendra') ? 'കേന്ദ്ര' : 'ത്രികോണ';
            return `${p1} (കേന്ദ്ര അധിപൻ) + ${p2} (${type} അധിപൻ)`;
        }
        
        if (str.includes(' (Trikona lord) + ')) {
            const parts = str.split(' (Trikona lord) + ');
            const p1 = i18n.t(parts[0], lang);
            const p2Parts = parts[1].split(' (');
            const p2 = i18n.t(p2Parts[0], lang);
            const type = p2Parts[1].includes('Kendra') ? 'കേന്ദ്ര' : 'ത്രികോണ';
            return `${p1} (ത്രികോണ അധിപൻ) + ${p2} (${type} അധിപൻ)`;
        }

        const inHouseMatch = str.match(/^([\w\s]+) in House (\d+) \(([\w\s]+)\)$/);
        if (inHouseMatch) {
            return `${i18n.t(inHouseMatch[3], lang)} രാശിയിൽ (ഭാവം ${inHouseMatch[2]}) ${i18n.t(inHouseMatch[1], lang)} സ്ഥിതിചെയ്യുന്നു`;
        }

        const conjMatch = str.match(/^Conjunction in House (\d+)$/);
        if (conjMatch) {
            return `${conjMatch[1]}-ാം ഭാവത്തിൽ കൂടിച്ചേരൽ (Conjunction)`;
        }
        
        const aspectMatch = str.match(/^Mutual Aspect in House (\d+) and (\d+)$/);
        if (aspectMatch) {
             return `${aspectMatch[1]}, ${aspectMatch[2]} ഭാവങ്ങളിൽ പരസ്പര ദൃഷ്ടി (Mutual Aspect)`;
        }
        
        const exchangeMatch = str.match(/^Sign Exchange \(Parivartana\) in House (\d+) and (\d+)$/);
        if (exchangeMatch) {
            return `${exchangeMatch[1]}, ${exchangeMatch[2]} ഭാവങ്ങളിൽ പരിവർത്തന യോഗം (Sign Exchange)`;
        }
        
        const dhanaMatch = str.match(/^Lord of ([\w]+) house \(([\w]+)\) conjunct lord of ([\w]+) house \(([\w]+)\)$/);
        if (dhanaMatch) {
            return `${dhanaMatch[1]} ഭാവാധിപൻ (${i18n.t(dhanaMatch[2], lang)}) ${dhanaMatch[3]} ഭാവാധിപനുമായി (${i18n.t(dhanaMatch[4], lang)}) കൂടിച്ചേരുന്നു`;
        }
        
        const manglikMatch = str.match(/^Mars in House (\d+) \(([\w\s]+)\)\. Present from: (.*)$/);
        if (manglikMatch) {
            const sources = manglikMatch[3].split(', ').map(s => i18n.t(s, lang)).join(', ');
            return `${i18n.t(manglikMatch[2], lang)} രാശിയിൽ (ഭാവം ${manglikMatch[1]}) ചൊവ്വ. ദോഷം ഇവിടെ നിന്ന്: ${sources}`;
        }

        const cancelMatch = str.match(/^Mars in ([\w]+) sign \(([\w\s]+)\)$/);
        if (cancelMatch) {
            return `ചൊവ്വ ${i18n.t(cancelMatch[1], lang)} രാശിയിൽ (${i18n.t(cancelMatch[2], lang)})`;
        }
        
        const budhaMatch = str.match(/^Sun and Mercury conjunct in House (\d+) \(([\w\s]+)\)$/);
        if (budhaMatch) {
            return `${i18n.t(budhaMatch[2], lang)} രാശിയിൽ (ഭാവം ${budhaMatch[1]}) സൂര്യനും ബുധനും ഒന്നിച്ചു നിൽക്കുന്നു`;
        }

        const neechaMatch = str.match(/^([\w]+) debilitated in ([\w\s]+); cancelled by (.*)$/);
        if (neechaMatch) {
            const planet = i18n.t(neechaMatch[1], lang);
            const rasi = i18n.t(neechaMatch[2], lang);
            
            let reason = neechaMatch[3];
            const rMatch1 = reason.match(/^([\w]+) \(lord of debilitation sign\) in Kendra \(House (\d+)\)$/);
            if (rMatch1) {
                reason = `${i18n.t(rMatch1[1], lang)} (നീച രാശ്യാധിപൻ) കേന്ദ്രത്തിൽ (ഭാവം ${rMatch1[2]})`;
            } else {
                const rMatch2 = reason.match(/^([\w]+) \(lord of exaltation sign\) in Kendra \(House (\d+)\)$/);
                if (rMatch2) {
                    reason = `${i18n.t(rMatch2[1], lang)} (ഉച്ച രാശ്യാധിപൻ) കേന്ദ്രത്തിൽ (ഭാവം ${rMatch2[2]})`;
                }
            }
            return `${planet} ${rasi} രാശിയിൽ നീചസ്ഥൻ; റദ്ദാക്കുന്നത്: ${reason}`;
        }

        const debilitatedMatch = str.match(/^Debilitated ([\w]+) with cancellation$/);
        if (debilitatedMatch) {
            return `നീചഭംഗമുള്ള ${i18n.t(debilitatedMatch[1], lang)}`;
        }

        const humbleMatch = str.match(/^Rise from humble\/difficult beginnings during ([\w]+) Dasha$/);
        if (humbleMatch) {
            return `${i18n.t(humbleMatch[1], lang)} ദശാകാലത്ത് താഴ്ന്ന നിലയിൽ നിന്നുള്ള ഉയർച്ച`;
        }
        
        if (str.startsWith("Activated during ")) {
            const rest = str.replace("Activated during ", "");
            return `സജീവമാകുന്ന കാലം: ${rest.replace(" Maha/Antar Dasha", " മഹാ/അന്തർ ദശ")}`;
        }
    }
    
    return i18nData['en'] && i18nData['en'][key] ? i18nData['en'][key] : key;
  }
};

if (typeof window !== 'undefined') window.i18n = i18n;
