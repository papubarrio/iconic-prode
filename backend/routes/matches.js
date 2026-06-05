const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");

// Todos los horarios en ET (UTC-4). "00:00" bajo un día = medianoche pasando al día siguiente.
// homeCode/awayCode = ISO-2 para banderas. EN=Inglaterra, SC=Escocia (casos especiales).
// homeTla/awayTla   = código FIFA de 3 letras para sincronización con football-data.org.

const MATCHES = [
  // ── GROUP A: Mexico · South Africa · South Korea · Czech Republic ──────────────
  { id:  1, home: "Mexico",         homeCode: "MX", homeTla: "MEX", away: "South Africa",   awayCode: "ZA", awayTla: "RSA", date: "2026-06-11T15:00:00-04:00", group: "Group A" },
  { id:  2, home: "South Korea",    homeCode: "KR", homeTla: "KOR", away: "Czech Republic",  awayCode: "CZ", awayTla: "CZE", date: "2026-06-11T22:00:00-04:00", group: "Group A" },
  { id:  3, home: "Czech Republic", homeCode: "CZ", homeTla: "CZE", away: "South Africa",    awayCode: "ZA", awayTla: "RSA", date: "2026-06-18T12:00:00-04:00", group: "Group A" },
  { id:  4, home: "Mexico",         homeCode: "MX", homeTla: "MEX", away: "South Korea",     awayCode: "KR", awayTla: "KOR", date: "2026-06-18T21:00:00-04:00", group: "Group A" },
  { id:  5, home: "Czech Republic", homeCode: "CZ", homeTla: "CZE", away: "Mexico",          awayCode: "MX", awayTla: "MEX", date: "2026-06-24T21:00:00-04:00", group: "Group A" },
  { id:  6, home: "South Africa",   homeCode: "ZA", homeTla: "RSA", away: "South Korea",     awayCode: "KR", awayTla: "KOR", date: "2026-06-24T21:00:00-04:00", group: "Group A" },

  // ── GROUP B: Canada · Bosnia & Herz. · Qatar · Switzerland ─────────────────────
  { id:  7, home: "Canada",         homeCode: "CA", homeTla: "CAN", away: "Bosnia & Herz.",  awayCode: "BA", awayTla: "BIH", date: "2026-06-12T15:00:00-04:00", group: "Group B" },
  { id:  8, home: "Qatar",          homeCode: "QA", homeTla: "QAT", away: "Switzerland",     awayCode: "CH", awayTla: "SUI", date: "2026-06-13T15:00:00-04:00", group: "Group B" },
  { id:  9, home: "Switzerland",    homeCode: "CH", homeTla: "SUI", away: "Bosnia & Herz.",  awayCode: "BA", awayTla: "BIH", date: "2026-06-18T15:00:00-04:00", group: "Group B" },
  { id: 10, home: "Canada",         homeCode: "CA", homeTla: "CAN", away: "Qatar",           awayCode: "QA", awayTla: "QAT", date: "2026-06-18T18:00:00-04:00", group: "Group B" },
  { id: 11, home: "Switzerland",    homeCode: "CH", homeTla: "SUI", away: "Canada",          awayCode: "CA", awayTla: "CAN", date: "2026-06-24T15:00:00-04:00", group: "Group B" },
  { id: 12, home: "Bosnia & Herz.", homeCode: "BA", homeTla: "BIH", away: "Qatar",           awayCode: "QA", awayTla: "QAT", date: "2026-06-24T15:00:00-04:00", group: "Group B" },

  // ── GROUP C: Brazil · Morocco · Haiti · Scotland ─────────────────────────
  { id: 13, home: "Brazil",         homeCode: "BR", homeTla: "BRA", away: "Morocco",         awayCode: "MA", awayTla: "MAR", date: "2026-06-13T18:00:00-04:00", group: "Group C" },
  { id: 14, home: "Haiti",          homeCode: "HT", homeTla: "HAI", away: "Scotland",        awayCode: "SC", awayTla: "SCO", date: "2026-06-13T21:00:00-04:00", group: "Group C" },
  { id: 15, home: "Scotland",       homeCode: "SC", homeTla: "SCO", away: "Morocco",         awayCode: "MA", awayTla: "MAR", date: "2026-06-19T18:00:00-04:00", group: "Group C" },
  { id: 16, home: "Brazil",         homeCode: "BR", homeTla: "BRA", away: "Haiti",           awayCode: "HT", awayTla: "HAI", date: "2026-06-19T21:00:00-04:00", group: "Group C" },
  { id: 17, home: "Scotland",       homeCode: "SC", homeTla: "SCO", away: "Brazil",          awayCode: "BR", awayTla: "BRA", date: "2026-06-24T18:00:00-04:00", group: "Group C" },
  { id: 18, home: "Morocco",        homeCode: "MA", homeTla: "MAR", away: "Haiti",           awayCode: "HT", awayTla: "HAI", date: "2026-06-24T18:00:00-04:00", group: "Group C" },

  // ── GROUP D: USA · Paraguay · Australia · Turkey ────────────────────────
  { id: 19, home: "USA",            homeCode: "US", homeTla: "USA", away: "Paraguay",        awayCode: "PY", awayTla: "PAR", date: "2026-06-12T21:00:00-04:00", group: "Group D" },
  { id: 20, home: "Australia",      homeCode: "AU", homeTla: "AUS", away: "Turkey",          awayCode: "TR", awayTla: "TUR", date: "2026-06-14T00:00:00-04:00", group: "Group D" },
  { id: 21, home: "USA",            homeCode: "US", homeTla: "USA", away: "Australia",       awayCode: "AU", awayTla: "AUS", date: "2026-06-19T15:00:00-04:00", group: "Group D" },
  { id: 22, home: "Turkey",         homeCode: "TR", homeTla: "TUR", away: "Paraguay",        awayCode: "PY", awayTla: "PAR", date: "2026-06-20T00:00:00-04:00", group: "Group D" },
  { id: 23, home: "Turkey",         homeCode: "TR", homeTla: "TUR", away: "USA",             awayCode: "US", awayTla: "USA", date: "2026-06-25T22:00:00-04:00", group: "Group D" },
  { id: 24, home: "Paraguay",       homeCode: "PY", homeTla: "PAR", away: "Australia",       awayCode: "AU", awayTla: "AUS", date: "2026-06-25T22:00:00-04:00", group: "Group D" },

  // ── GROUP E: Germany · Curaçao · Côte d'Ivoire · Ecuador ──────────────────
  { id: 25, home: "Germany",        homeCode: "DE", homeTla: "GER", away: "Curaçao",         awayCode: "CW", awayTla: "CUR", date: "2026-06-14T13:00:00-04:00", group: "Group E" },
  { id: 26, home: "Côte d'Ivoire",  homeCode: "CI", homeTla: "CIV", away: "Ecuador",         awayCode: "EC", awayTla: "ECU", date: "2026-06-14T19:00:00-04:00", group: "Group E" },
  { id: 27, home: "Germany",        homeCode: "DE", homeTla: "GER", away: "Côte d'Ivoire",   awayCode: "CI", awayTla: "CIV", date: "2026-06-20T16:00:00-04:00", group: "Group E" },
  { id: 28, home: "Ecuador",        homeCode: "EC", homeTla: "ECU", away: "Curaçao",         awayCode: "CW", awayTla: "CUR", date: "2026-06-20T22:00:00-04:00", group: "Group E" },
  { id: 29, home: "Curaçao",        homeCode: "CW", homeTla: "CUR", away: "Côte d'Ivoire",   awayCode: "CI", awayTla: "CIV", date: "2026-06-25T16:00:00-04:00", group: "Group E" },
  { id: 30, home: "Ecuador",        homeCode: "EC", homeTla: "ECU", away: "Germany",         awayCode: "DE", awayTla: "GER", date: "2026-06-25T16:00:00-04:00", group: "Group E" },

  // ── GROUP F: Netherlands · Japan · Sweden · Tunisia ───────────────────────
  { id: 31, home: "Netherlands",    homeCode: "NL", homeTla: "NED", away: "Japan",           awayCode: "JP", awayTla: "JPN", date: "2026-06-14T16:00:00-04:00", group: "Group F" },
  { id: 32, home: "Sweden",         homeCode: "SE", homeTla: "SWE", away: "Tunisia",         awayCode: "TN", awayTla: "TUN", date: "2026-06-14T22:00:00-04:00", group: "Group F" },
  { id: 33, home: "Netherlands",    homeCode: "NL", homeTla: "NED", away: "Sweden",          awayCode: "SE", awayTla: "SWE", date: "2026-06-20T13:00:00-04:00", group: "Group F" },
  { id: 34, home: "Tunisia",        homeCode: "TN", homeTla: "TUN", away: "Japan",           awayCode: "JP", awayTla: "JPN", date: "2026-06-21T00:00:00-04:00", group: "Group F" },
  { id: 35, home: "Japan",          homeCode: "JP", homeTla: "JPN", away: "Sweden",          awayCode: "SE", awayTla: "SWE", date: "2026-06-25T19:00:00-04:00", group: "Group F" },
  { id: 36, home: "Tunisia",        homeCode: "TN", homeTla: "TUN", away: "Netherlands",     awayCode: "NL", awayTla: "NED", date: "2026-06-25T19:00:00-04:00", group: "Group F" },

  // ── GROUP G: Belgium · Egypt · Iran · New Zealand ─────────────────────────
  { id: 37, home: "Belgium",        homeCode: "BE", homeTla: "BEL", away: "Egypt",           awayCode: "EG", awayTla: "EGY", date: "2026-06-15T15:00:00-04:00", group: "Group G" },
  { id: 38, home: "Iran",           homeCode: "IR", homeTla: "IRN", away: "New Zealand",     awayCode: "NZ", awayTla: "NZL", date: "2026-06-15T21:00:00-04:00", group: "Group G" },
  { id: 39, home: "Belgium",        homeCode: "BE", homeTla: "BEL", away: "Iran",            awayCode: "IR", awayTla: "IRN", date: "2026-06-21T15:00:00-04:00", group: "Group G" },
  { id: 40, home: "New Zealand",    homeCode: "NZ", homeTla: "NZL", away: "Egypt",           awayCode: "EG", awayTla: "EGY", date: "2026-06-21T21:00:00-04:00", group: "Group G" },
  { id: 41, home: "Egypt",          homeCode: "EG", homeTla: "EGY", away: "Iran",            awayCode: "IR", awayTla: "IRN", date: "2026-06-26T23:00:00-04:00", group: "Group G" },
  { id: 42, home: "New Zealand",    homeCode: "NZ", homeTla: "NZL", away: "Belgium",         awayCode: "BE", awayTla: "BEL", date: "2026-06-26T23:00:00-04:00", group: "Group G" },

  // ── GROUP H: Spain · Cape Verde · Saudi Arabia · Uruguay ──────────────────
  { id: 43, home: "Spain",          homeCode: "ES", homeTla: "ESP", away: "Cape Verde",      awayCode: "CV", awayTla: "CPV", date: "2026-06-15T12:00:00-04:00", group: "Group H" },
  { id: 44, home: "Saudi Arabia",   homeCode: "SA", homeTla: "KSA", away: "Uruguay",         awayCode: "UY", awayTla: "URY", date: "2026-06-15T18:00:00-04:00", group: "Group H" },
  { id: 45, home: "Spain",          homeCode: "ES", homeTla: "ESP", away: "Saudi Arabia",    awayCode: "SA", awayTla: "KSA", date: "2026-06-21T12:00:00-04:00", group: "Group H" },
  { id: 46, home: "Uruguay",        homeCode: "UY", homeTla: "URY", away: "Cape Verde",      awayCode: "CV", awayTla: "CPV", date: "2026-06-21T18:00:00-04:00", group: "Group H" },
  { id: 47, home: "Cape Verde",     homeCode: "CV", homeTla: "CPV", away: "Saudi Arabia",    awayCode: "SA", awayTla: "KSA", date: "2026-06-26T20:00:00-04:00", group: "Group H" },
  { id: 48, home: "Uruguay",        homeCode: "UY", homeTla: "URY", away: "Spain",           awayCode: "ES", awayTla: "ESP", date: "2026-06-26T20:00:00-04:00", group: "Group H" },

  // ── GROUP I: France · Senegal · Iraq · Norway ───────────────────────────────
  { id: 49, home: "France",         homeCode: "FR", homeTla: "FRA", away: "Senegal",         awayCode: "SN", awayTla: "SEN", date: "2026-06-16T15:00:00-04:00", group: "Group I" },
  { id: 50, home: "Iraq",           homeCode: "IQ", homeTla: "IRQ", away: "Norway",          awayCode: "NO", awayTla: "NOR", date: "2026-06-16T18:00:00-04:00", group: "Group I" },
  { id: 51, home: "France",         homeCode: "FR", homeTla: "FRA", away: "Iraq",            awayCode: "IQ", awayTla: "IRQ", date: "2026-06-22T17:00:00-04:00", group: "Group I" },
  { id: 52, home: "Norway",         homeCode: "NO", homeTla: "NOR", away: "Senegal",         awayCode: "SN", awayTla: "SEN", date: "2026-06-22T20:00:00-04:00", group: "Group I" },
  { id: 53, home: "Norway",         homeCode: "NO", homeTla: "NOR", away: "France",          awayCode: "FR", awayTla: "FRA", date: "2026-06-26T15:00:00-04:00", group: "Group I" },
  { id: 54, home: "Senegal",        homeCode: "SN", homeTla: "SEN", away: "Iraq",            awayCode: "IQ", awayTla: "IRQ", date: "2026-06-26T15:00:00-04:00", group: "Group I" },

  // ── GROUP J: Argentina · Algeria · Austria · Jordan ───────────────────────
  { id: 55, home: "Argentina",      homeCode: "AR", homeTla: "ARG", away: "Algeria",         awayCode: "DZ", awayTla: "ALG", date: "2026-06-16T21:00:00-04:00", group: "Group J" },
  { id: 56, home: "Austria",        homeCode: "AT", homeTla: "AUT", away: "Jordan",          awayCode: "JO", awayTla: "JOR", date: "2026-06-17T00:00:00-04:00", group: "Group J" },
  { id: 57, home: "Argentina",      homeCode: "AR", homeTla: "ARG", away: "Austria",         awayCode: "AT", awayTla: "AUT", date: "2026-06-22T13:00:00-04:00", group: "Group J" },
  { id: 58, home: "Jordan",         homeCode: "JO", homeTla: "JOR", away: "Algeria",         awayCode: "DZ", awayTla: "ALG", date: "2026-06-22T23:00:00-04:00", group: "Group J" },
  { id: 59, home: "Algeria",        homeCode: "DZ", homeTla: "ALG", away: "Austria",         awayCode: "AT", awayTla: "AUT", date: "2026-06-27T22:00:00-04:00", group: "Group J" },
  { id: 60, home: "Jordan",         homeCode: "JO", homeTla: "JOR", away: "Argentina",       awayCode: "AR", awayTla: "ARG", date: "2026-06-27T22:00:00-04:00", group: "Group J" },

  // ── GROUP K: Portugal · DR Congo · Uzbekistan · Colombia ─────────────────
  { id: 61, home: "Portugal",       homeCode: "PT", homeTla: "POR", away: "DR Congo",        awayCode: "CD", awayTla: "COD", date: "2026-06-17T13:00:00-04:00", group: "Group K" },
  { id: 62, home: "Uzbekistan",     homeCode: "UZ", homeTla: "UZB", away: "Colombia",        awayCode: "CO", awayTla: "COL", date: "2026-06-17T22:00:00-04:00", group: "Group K" },
  { id: 63, home: "Portugal",       homeCode: "PT", homeTla: "POR", away: "Uzbekistan",      awayCode: "UZ", awayTla: "UZB", date: "2026-06-23T13:00:00-04:00", group: "Group K" },
  { id: 64, home: "Colombia",       homeCode: "CO", homeTla: "COL", away: "DR Congo",        awayCode: "CD", awayTla: "COD", date: "2026-06-23T22:00:00-04:00", group: "Group K" },
  { id: 65, home: "Colombia",       homeCode: "CO", homeTla: "COL", away: "Portugal",        awayCode: "PT", awayTla: "POR", date: "2026-06-27T19:30:00-04:00", group: "Group K" },
  { id: 66, home: "DR Congo",       homeCode: "CD", homeTla: "COD", away: "Uzbekistan",      awayCode: "UZ", awayTla: "UZB", date: "2026-06-27T19:30:00-04:00", group: "Group K" },

  // ── GROUP L: England · Croatia · Ghana · Panama ───────────────────────────
  { id: 67, home: "England",        homeCode: "EN", homeTla: "ENG", away: "Croatia",         awayCode: "HR", awayTla: "CRO", date: "2026-06-17T16:00:00-04:00", group: "Group L" },
  { id: 68, home: "Ghana",          homeCode: "GH", homeTla: "GHA", away: "Panama",          awayCode: "PA", awayTla: "PAN", date: "2026-06-17T19:00:00-04:00", group: "Group L" },
  { id: 69, home: "England",        homeCode: "EN", homeTla: "ENG", away: "Ghana",           awayCode: "GH", awayTla: "GHA", date: "2026-06-23T16:00:00-04:00", group: "Group L" },
  { id: 70, home: "Panama",         homeCode: "PA", homeTla: "PAN", away: "Croatia",         awayCode: "HR", awayTla: "CRO", date: "2026-06-23T19:00:00-04:00", group: "Group L" },
  { id: 71, home: "Panama",         homeCode: "PA", homeTla: "PAN", away: "England",         awayCode: "EN", awayTla: "ENG", date: "2026-06-27T17:00:00-04:00", group: "Group L" },
  { id: 72, home: "Croatia",        homeCode: "HR", homeTla: "CRO", away: "Ghana",           awayCode: "GH", awayTla: "GHA", date: "2026-06-27T17:00:00-04:00", group: "Group L" },

  // ── ROUND OF 32 (P73–P88) ────────────────────────────────────────────────
  { id: 73, home: "2nd Group A",  homeCode: "??", homeTla: "??", away: "2nd Group B",  awayCode: "??", awayTla: "??", date: "2026-06-28T15:00:00-04:00", group: "Round of 32" },
  { id: 74, home: "1st Group E",  homeCode: "??", homeTla: "??", away: "3rd A/B/C/D/F",awayCode: "??", awayTla: "??", date: "2026-06-29T12:00:00-04:00", group: "Round of 32" },
  { id: 75, home: "1st Group F",  homeCode: "??", homeTla: "??", away: "2nd Group C",  awayCode: "??", awayTla: "??", date: "2026-06-29T15:00:00-04:00", group: "Round of 32" },
  { id: 76, home: "1st Group C",  homeCode: "??", homeTla: "??", away: "2nd Group F",  awayCode: "??", awayTla: "??", date: "2026-06-29T19:00:00-04:00", group: "Round of 32" },
  { id: 77, home: "1st Group I",  homeCode: "??", homeTla: "??", away: "3rd C/D/F/G/H",awayCode: "??", awayTla: "??", date: "2026-06-30T12:00:00-04:00", group: "Round of 32" },
  { id: 78, home: "2nd Group E",  homeCode: "??", homeTla: "??", away: "2nd Group I",  awayCode: "??", awayTla: "??", date: "2026-06-30T15:00:00-04:00", group: "Round of 32" },
  { id: 79, home: "1st Group A",  homeCode: "??", homeTla: "??", away: "3rd C/E/F/H/I",awayCode: "??", awayTla: "??", date: "2026-06-30T19:00:00-04:00", group: "Round of 32" },
  { id: 80, home: "1st Group L",  homeCode: "??", homeTla: "??", away: "3rd E/H/I/J/K",awayCode: "??", awayTla: "??", date: "2026-07-01T12:00:00-04:00", group: "Round of 32" },
  { id: 81, home: "1st Group D",  homeCode: "??", homeTla: "??", away: "3rd B/E/F/I/J",awayCode: "??", awayTla: "??", date: "2026-07-01T15:00:00-04:00", group: "Round of 32" },
  { id: 82, home: "1st Group G",  homeCode: "??", homeTla: "??", away: "3rd A/E/H/I/J",awayCode: "??", awayTla: "??", date: "2026-07-01T19:00:00-04:00", group: "Round of 32" },
  { id: 83, home: "2nd Group K",  homeCode: "??", homeTla: "??", away: "2nd Group L",  awayCode: "??", awayTla: "??", date: "2026-07-02T12:00:00-04:00", group: "Round of 32" },
  { id: 84, home: "1st Group H",  homeCode: "??", homeTla: "??", away: "2nd Group J",  awayCode: "??", awayTla: "??", date: "2026-07-02T15:00:00-04:00", group: "Round of 32" },
  { id: 85, home: "1st Group B",  homeCode: "??", homeTla: "??", away: "3rd E/F/G/I/J",awayCode: "??", awayTla: "??", date: "2026-07-02T19:00:00-04:00", group: "Round of 32" },
  { id: 86, home: "1st Group J",  homeCode: "??", homeTla: "??", away: "2nd Group H",  awayCode: "??", awayTla: "??", date: "2026-07-03T12:00:00-04:00", group: "Round of 32" },
  { id: 87, home: "1st Group K",  homeCode: "??", homeTla: "??", away: "3rd D/E/I/J/L",awayCode: "??", awayTla: "??", date: "2026-07-03T15:00:00-04:00", group: "Round of 32" },
  { id: 88, home: "2nd Group D",  homeCode: "??", homeTla: "??", away: "2nd Group G",  awayCode: "??", awayTla: "??", date: "2026-07-03T19:00:00-04:00", group: "Round of 32" },

  // ── ROUND OF 16 (P89–P96) ────────────────────────────────────────────────
  { id: 89, home: "G74", homeCode: "??", homeTla: "??", away: "G77", awayCode: "??", awayTla: "??", date: "2026-07-04T15:00:00-04:00", group: "Round of 16" },
  { id: 90, home: "G73", homeCode: "??", homeTla: "??", away: "G75", awayCode: "??", awayTla: "??", date: "2026-07-04T19:00:00-04:00", group: "Round of 16" },
  { id: 91, home: "G76", homeCode: "??", homeTla: "??", away: "G78", awayCode: "??", awayTla: "??", date: "2026-07-05T15:00:00-04:00", group: "Round of 16" },
  { id: 92, home: "G79", homeCode: "??", homeTla: "??", away: "G80", awayCode: "??", awayTla: "??", date: "2026-07-05T19:00:00-04:00", group: "Round of 16" },
  { id: 93, home: "G83", homeCode: "??", homeTla: "??", away: "G84", awayCode: "??", awayTla: "??", date: "2026-07-06T15:00:00-04:00", group: "Round of 16" },
  { id: 94, home: "G81", homeCode: "??", homeTla: "??", away: "G82", awayCode: "??", awayTla: "??", date: "2026-07-06T19:00:00-04:00", group: "Round of 16" },
  { id: 95, home: "G86", homeCode: "??", homeTla: "??", away: "G88", awayCode: "??", awayTla: "??", date: "2026-07-07T15:00:00-04:00", group: "Round of 16" },
  { id: 96, home: "G85", homeCode: "??", homeTla: "??", away: "G87", awayCode: "??", awayTla: "??", date: "2026-07-07T19:00:00-04:00", group: "Round of 16" },

  // ── QUARTERFINALS (P97–P100) ──────────────────────────────────────────────
  { id: 97,  home: "G89", homeCode: "??", homeTla: "??", away: "G90", awayCode: "??", awayTla: "??", date: "2026-07-09T15:00:00-04:00", group: "Quarterfinals" },
  { id: 98,  home: "G93", homeCode: "??", homeTla: "??", away: "G94", awayCode: "??", awayTla: "??", date: "2026-07-10T15:00:00-04:00", group: "Quarterfinals" },
  { id: 99,  home: "G91", homeCode: "??", homeTla: "??", away: "G92", awayCode: "??", awayTla: "??", date: "2026-07-11T15:00:00-04:00", group: "Quarterfinals" },
  { id: 100, home: "G95", homeCode: "??", homeTla: "??", away: "G96", awayCode: "??", awayTla: "??", date: "2026-07-11T19:00:00-04:00", group: "Quarterfinals" },

  // ── SEMIFINALS (P101–P102) ────────────────────────────────────────────────
  { id: 101, home: "G97", homeCode: "??", homeTla: "??", away: "G98", awayCode: "??", awayTla: "??", date: "2026-07-14T15:00:00-04:00", group: "Semifinals" },
  { id: 102, home: "G99", homeCode: "??", homeTla: "??", away: "G100",awayCode: "??", awayTla: "??", date: "2026-07-15T15:00:00-04:00", group: "Semifinals" },

  // ── 3RD PLACE & FINAL ─────────────────────────────────────────────────────
  { id: 103, home: "Loser SF1",   homeCode: "??", homeTla: "??", away: "Loser SF2",   awayCode: "??", awayTla: "??", date: "2026-07-18T15:00:00-04:00", group: "3rd Place" },
  { id: 104, home: "Winner SF1",  homeCode: "??", homeTla: "??", away: "Winner SF2",  awayCode: "??", awayTla: "??", date: "2026-07-19T15:00:00-04:00", group: "Final" },
];

const { query } = require("../db/database");

// Index knockout matches by UTC minute for team-name sync
const KNOCKOUT_BY_UTC = {};
MATCHES.filter(m => m.id >= 73).forEach(m => {
  const key = new Date(m.date).toISOString().slice(0, 16); // "2026-07-04T19:00"
  KNOCKOUT_BY_UTC[key] = m.id;
});

// TLA → ISO-2 flag code for all 48 WC teams
const TLA_TO_ISO2 = {
  MEX:"MX", RSA:"ZA", KOR:"KR", CZE:"CZ", CAN:"CA", BIH:"BA", QAT:"QA", SUI:"CH",
  BRA:"BR", MAR:"MA", HAI:"HT", SCO:"SC", USA:"US", PAR:"PY", AUS:"AU", TUR:"TR",
  GER:"DE", CUR:"CW", CIV:"CI", ECU:"EC", NED:"NL", JPN:"JP", SWE:"SE", TUN:"TN",
  BEL:"BE", EGY:"EG", IRN:"IR", NZL:"NZ", ESP:"ES", CPV:"CV", KSA:"SA", URY:"UY",
  FRA:"FR", SEN:"SN", IRQ:"IQ", NOR:"NO", ARG:"AR", ALG:"DZ", AUT:"AT", JOR:"JO",
  POR:"PT", COD:"CD", UZB:"UZ", COL:"CO", ENG:"EN", CRO:"HR", GHA:"GH", PAN:"PA",
};

// TLA → English display name (built from our MATCHES data)
const TLA_TO_NAME = {};
MATCHES.filter(m => m.homeTla !== "??").forEach(m => {
  TLA_TO_NAME[m.homeTla] = m.home;
  TLA_TO_NAME[m.awayTla] = m.away;
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { rows: overrides } = await query("SELECT * FROM match_teams");
    if (overrides.length === 0) return res.json(MATCHES);
    const overrideMap = {};
    overrides.forEach(o => { overrideMap[o.match_id] = o; });
    res.json(MATCHES.map(m => {
      const ov = overrideMap[m.id];
      if (!ov) return m;
      return { ...m, home: ov.home, homeCode: ov.home_code, away: ov.away, awayCode: ov.away_code };
    }));
  } catch (e) { next(e); }
});

module.exports = router;
module.exports.MATCHES        = MATCHES;
module.exports.KNOCKOUT_BY_UTC = KNOCKOUT_BY_UTC;
module.exports.TLA_TO_ISO2    = TLA_TO_ISO2;
module.exports.TLA_TO_NAME    = TLA_TO_NAME;
