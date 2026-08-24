/**
 * JyothirVeda — Astronomical Engine (WASM Swiss Ephemeris)
 * 
 * High precision calculations using the official Swiss Ephemeris
 * compiled to WebAssembly (@swisseph/browser).
 * 
 * Replaces the old mathematical JS implementation with the 
 * exact C-library precision natively in the browser.
 */

const AstroEngine = (() => {
  'use strict';

  const engine = {
    swe: null,
    isReady: false,
    Planet: null,
    CalculationFlag: null,
    HouseSystem: null,

    /**
     * Dynamically imports the WASM package from CDN and initializes it.
     */
    async init() {
      if (this.isReady) return;
      
      const { SwissEphemeris, Planet, CalculationFlag, HouseSystem } = await import('https://esm.run/@swisseph/browser');
      this.Planet = Planet;
      this.CalculationFlag = CalculationFlag;
      this.HouseSystem = HouseSystem;
      
      this.swe = new SwissEphemeris();
      await this.swe.init();
      this.isReady = true;
    },

    normalize(degrees) {
      let deg = degrees % 360;
      if (deg < 0) deg += 360;
      return deg;
    },

    sinD(degrees) {
      return Math.sin(degrees * (Math.PI / 180));
    },

    cosD(degrees) {
      return Math.cos(degrees * (Math.PI / 180));
    },

    dateToJulianDay(year, month, day, hour, minute, tzOffset) {
      // Convert local time back to UTC for Swiss Ephemeris Date object
      const utcHour = hour - tzOffset;
      const date = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), minute));
      return this.swe.dateToJulianDay(date);
    },

    getDeltaT(jd) {
      const y = 2000 + (jd - 2451545.0) / 365.25;
      const t = y - 2000;
      return 62.92 + 0.32217 * t + 0.005589 * t * t;
    },

    computeAllPositions({ year, month, day, hour, minute, tzOffset, lat, lng }) {
      if (!this.isReady) {
        throw new Error("AstroEngine not initialized. Call await AstroEngine.init() first.");
      }

      const jd = this.dateToJulianDay(year, month, day, hour, minute, tzOffset);
      const SEFLG_SIDEREAL = this.CalculationFlag.Sidereal;
      const SEFLG_SPEED = this.CalculationFlag.Speed;

      // Set Lahiri Ayanamsa (SE_SIDM_LAHIRI is 1 in swisseph)
      this.swe.setSiderealMode(1);
      const ayanamsa = this.swe.getAyanamsa(jd);
      
      const planets = [
        { id: 'Sun', eph: this.Planet.Sun },
        { id: 'Moon', eph: this.Planet.Moon },
        { id: 'Mars', eph: this.Planet.Mars },
        { id: 'Mercury', eph: this.Planet.Mercury },
        { id: 'Jupiter', eph: this.Planet.Jupiter },
        { id: 'Venus', eph: this.Planet.Venus },
        { id: 'Saturn', eph: this.Planet.Saturn },
        { id: 'Rahu', eph: this.Planet.TrueNode } // Mean Node is Planet.MeanNode
      ];
      
      const flags = SEFLG_SIDEREAL | SEFLG_SPEED;

      const sidereal = {};
      const retrograde = {};
      const speeds = {};

      for (const p of planets) {
        const pos = this.swe.calculatePosition(jd, p.eph, flags);
        sidereal[p.id] = pos.longitude;
        speeds[p.id] = pos.longitudeSpeed;
        retrograde[p.id] = pos.longitudeSpeed < 0;
      }

      // Ketu is exactly 180 degrees from True Node (Rahu)
      sidereal['Ketu'] = this.normalize(sidereal['Rahu'] + 180);
      retrograde['Ketu'] = retrograde['Rahu'];

      // Ascendant (Lagna)
      const houses = this.swe.calculateHouses(jd, lat, lng, this.HouseSystem.WholeSign);
      sidereal['Ascendant'] = houses.ascendant;
      
      // Calculate Combustion (Simple orb calculation for Sun distance)
      const sunLong = sidereal['Sun'];
      const combust = {
        Moon: Math.abs(this.normalize(sidereal['Moon'] - sunLong)) <= 12 || Math.abs(this.normalize(sidereal['Moon'] - sunLong)) >= 348,
        Mars: Math.abs(this.normalize(sidereal['Mars'] - sunLong)) <= 17 || Math.abs(this.normalize(sidereal['Mars'] - sunLong)) >= 343,
        Mercury: Math.abs(this.normalize(sidereal['Mercury'] - sunLong)) <= (retrograde['Mercury'] ? 12 : 14) || Math.abs(this.normalize(sidereal['Mercury'] - sunLong)) >= (retrograde['Mercury'] ? 348 : 346),
        Jupiter: Math.abs(this.normalize(sidereal['Jupiter'] - sunLong)) <= 11 || Math.abs(this.normalize(sidereal['Jupiter'] - sunLong)) >= 349,
        Venus: Math.abs(this.normalize(sidereal['Venus'] - sunLong)) <= (retrograde['Venus'] ? 8 : 10) || Math.abs(this.normalize(sidereal['Venus'] - sunLong)) >= (retrograde['Venus'] ? 352 : 350),
        Saturn: Math.abs(this.normalize(sidereal['Saturn'] - sunLong)) <= 15 || Math.abs(this.normalize(sidereal['Saturn'] - sunLong)) >= 345,
      };

      return {
        jd,
        ayanamsa,
        sidereal,
        retrograde,
        combust,
        deltaT: this.getDeltaT(jd),
        input: { year, month, day, hour, minute, tzOffset, lat, lng },
        method: "Swiss Ephemeris (WASM)",
        ayanamsaType: "Lahiri (Chitrapaksha)"
      };
    }
  };

  return engine;
})();

// Make available globally
if (typeof window !== 'undefined') window.AstroEngine = AstroEngine;
