import * as SunCalc from 'suncalc';
import type { WeatherSnapshot } from '../types/catch.types';

export function getMoonPhaseName(phase: number): string {
  if (phase < 0.0625) return 'Novoluní';
  if (phase < 0.1875) return 'Dorastajúci srp';
  if (phase < 0.3125) return 'Prvá štvrtina';
  if (phase < 0.4375) return 'Pribúdajúci mesiac';
  if (phase < 0.5625) return 'Spln';
  if (phase < 0.6875) return 'Ubúdajúci mesiac';
  if (phase < 0.8125) return 'Posledná štvrtina';
  if (phase < 0.9375) return 'Dorábajúci srp';
  return 'Novoluní';
}

export async function fetchWeatherForCatch(
  lat: number,
  lon: number
): Promise<WeatherSnapshot> {
  // DÔLEŽITÉ: použiť wind_speed_10m — NIE windspeed_10m (správny Open-Meteo parameter)
  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&hourly=pressure_msl,temperature_2m,wind_speed_10m,precipitation` +
    `&forecast_days=1&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const now = new Date();
  const hourIndex = now.getHours();

  const moonData = SunCalc.getMoonIllumination(now);
  const moonPhase = getMoonPhaseName(moonData.phase);

  return {
    temperature: data.hourly.temperature_2m[hourIndex],
    pressure: data.hourly.pressure_msl[hourIndex],
    windSpeed: data.hourly.wind_speed_10m[hourIndex],
    precipitation: data.hourly.precipitation[hourIndex],
    moonPhase,
    moonIllumination: Math.round(moonData.fraction * 100),
  };
}
