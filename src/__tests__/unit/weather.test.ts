// Mock global fetch
global.fetch = jest.fn();

// Mock suncalc
jest.mock('suncalc', () => ({
  getMoonIllumination: jest.fn().mockReturnValue({
    fraction: 1.0,   // spln — 100% osvetlenie
    phase: 0.5,      // spln
    angle: 0,
  }),
}));

import { fetchWeatherForCatch, getMoonPhaseName } from '../../services/weather';

const mockOpenMeteoResponse = {
  hourly: {
    temperature_2m: Array(24).fill(18.5),
    pressure_msl: Array(24).fill(1013.2),
    wind_speed_10m: Array(24).fill(12.4),
    precipitation: Array(24).fill(0.0),
  },
};

describe('weather — Open-Meteo + suncalc', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockOpenMeteoResponse),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DIARY-02: Weather auto-fetch', () => {
    it('fetchWeatherForCatch should return temperature, pressure, windSpeed, precipitation', async () => {
      const result = await fetchWeatherForCatch(48.1, 17.1);
      expect(result.temperature).toBeDefined();
      expect(result.pressure).toBeDefined();
      expect(result.windSpeed).toBeDefined();
      expect(result.precipitation).toBeDefined();
    });

    it('fetchWeatherForCatch should return moonPhase string', async () => {
      const result = await fetchWeatherForCatch(48.1, 17.1);
      expect(typeof result.moonPhase).toBe('string');
      expect(result.moonPhase.length).toBeGreaterThan(0);
    });

    it('fetchWeatherForCatch should return moonIllumination 0-100', async () => {
      const result = await fetchWeatherForCatch(48.1, 17.1);
      expect(result.moonIllumination).toBeGreaterThanOrEqual(0);
      expect(result.moonIllumination).toBeLessThanOrEqual(100);
    });

    it('should use wind_speed_10m param (not windspeed_10m)', async () => {
      await fetchWeatherForCatch(48.1, 17.1);
      const callUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
      expect(callUrl).toContain('wind_speed_10m');
      expect(callUrl).not.toContain('windspeed_10m');
    });

    it('getMoonPhaseName should return Slovak names', () => {
      const name = getMoonPhaseName(0.5);
      expect(typeof name).toBe('string');
      expect(name).not.toContain('Moon');
      expect(name).not.toContain('Quarter');
    });

    it('getMoonPhaseName(0) should return Novoluní', () => {
      expect(getMoonPhaseName(0)).toBe('Novoluní');
    });

    it('getMoonPhaseName(0.5) should return Spln', () => {
      expect(getMoonPhaseName(0.5)).toBe('Spln');
    });
  });
});
