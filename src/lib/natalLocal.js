import { Origin, Horoscope } from "circular-natal-horoscope-js";

/** 황경 경도(0~360) */
function normalizeLongitude(lon) {
  let x = Number(lon) % 360;
  if (x < 0) x += 360;
  return Math.round(x * 10000) / 10000;
}

/** 황경 경도(0~360)에서 별자리 내 도수(0~30 미만) */
function degreeInSign(absLon) {
  const x = normalizeLongitude(absLon);
  return Math.round((x % 30) * 100) / 100;
}

/**
 * 브라우저에서 무료 계산: circular-natal-horoscope-js (Moshier 근사 에페머리스).
 *
 * @param {{ year: number, month: number, day: number, hour: number, minute: number }} parts
 * @param {{ lat: number, lng: number }} coords
 */
export function computeNatalChart(parts, coords) {
  const origin = new Origin({
    year: parts.year,
    month: parts.month,
    date: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: 0,
    latitude: coords.lat,
    longitude: coords.lng,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    language: "en",
  });

  const planets = [];

  const majorBodies = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
    "chiron",
  ];

  for (const key of majorBodies) {
    const b = horoscope.CelestialBodies[key];
    if (!b || key === "all") continue;
    planets.push(mapBody(b));
  }

  const pointKeys = ["northnode", "southnode", "lilith"];
  for (const key of pointKeys) {
    const b = horoscope.CelestialPoints[key];
    if (!b) continue;
    planets.push(mapBody(b));
  }

  const ascLon = horoscope.Ascendant.ChartPosition.Ecliptic.DecimalDegrees;
  const mcLon = horoscope.Midheaven.ChartPosition.Ecliptic.DecimalDegrees;

  const angles = {
    asc: normalizeLongitude(ascLon),
    dsc: normalizeLongitude(ascLon + 180),
    mc: normalizeLongitude(mcLon),
    ic: normalizeLongitude(mcLon + 180),
  };

  const houses = [];
  for (const house of horoscope.Houses) {
    const lon = house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees;
    houses.push({
      house: house.id,
      sign: house.Sign.label,
      degree: degreeInSign(lon),
      eclipticLongitude: normalizeLongitude(lon),
    });
  }

  return {
    planets,
    houses,
    angles,
    calculation: {
      library: "circular-natal-horoscope-js",
      license: "Unlicense",
      ephemeris: "Moshier (내장 근사)",
      houseSystem: "Placidus",
      zodiac: "Tropical",
    },
  };
}

/** @param {{ label: string, Sign: { label: string }, ChartPosition: { Ecliptic: { DecimalDegrees: number } }, House?: { id: number }, isRetrograde?: boolean }} b */
function mapBody(b) {
  const lon = b.ChartPosition.Ecliptic.DecimalDegrees;
  return {
    name: String(b.label || "").trim(),
    sign: b.Sign.label,
    degree: degreeInSign(lon),
    eclipticLongitude: normalizeLongitude(lon),
    house: b.House != null && typeof b.House.id === "number" ? b.House.id : null,
    retrograde: !!b.isRetrograde,
  };
}
