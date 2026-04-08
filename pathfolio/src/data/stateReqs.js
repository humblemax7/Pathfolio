// src/data/stateReqs.js
// Statewide minimum course-credit requirements for a standard diploma (2024–25).


const STATE_REQS = {
  "Alabama":        { total: 24,  english: 4,   math: 4,   science: 4,   social: 4,   arts: 1,   pe: 1 },
  "Alaska":         { total: 21,  english: 4,   math: 3,   science: 2,   social: 3,   arts: 1,   pe: 1 },
  "Arizona":        { total: 22,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Arkansas":       { total: 22,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 0.5, pe: 0.5 },

  // California

  "California":     { total: null,english: 3,   math: 2,   science: 2,   social: 3,   arts: 1,   pe: null },

  // Colorado
  "Colorado":       { total: null,english: null,math: null,science: null,social: null,arts: null, pe: null },

  "Connecticut":    { total: 25,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Delaware":       { total: 24,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "District of Columbia": { total: 24, english: 4, math: 4, science: 4, social: 4, arts: 1, pe: 1 },

  "Florida":        { total: 24,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Georgia":        { total: 23,  english: 4,   math: 4,   science: 4,   social: 3,   arts: 1,   pe: 1 },
  "Hawaii":         { total: 24,  english: 4,   math: 3,   science: 3,   social: 4,   arts: 2,   pe: 1 },
  "Idaho":          { total: 23,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 2,   pe: 2 },

  // Illinois
  "Illinois":       { total: 16,  english: 4,   math: 3,   science: 2,   social: 2,   arts: 1,   pe: null },

  // Indiana 
  "Indiana":        { total: 40,  english: 8,   math: 6,   science: 6,   social: 6,   arts: 2,   pe: 2 },

  // Iowa: 
  "Iowa":           { total: null,english: 4,   math: 3,   science: 3,   social: 3,   arts: 0,   pe: null },

  "Kansas":         { total: 21,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Kentucky":       { total: 22,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Louisiana":      { total: 24,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1.5 },
  "Maine":          { total: 24,  english: 4,   math: 2,   science: 2,   social: 2,   arts: 1,   pe: 1 },
  "Maryland":       { total: 22,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 1 },

  // Massachusetts
  "Massachusetts":  { total: null,english: null,math: null,science: null,social: null,arts: null, pe: null },

  "Michigan":       { total: 18,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Minnesota":      { total: 21.5,english: 4,   math: 3,   science: 3,   social: 3.5, arts: 1,   pe: 1 },
  "Mississippi":    { total: 24,  english: 4,   math: 4,   science: 3,   social: 3.5, arts: 1,   pe: 1 },
  "Missouri":       { total: 24,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Montana":        { total: 20,  english: 4,   math: 2,   science: 2,   social: 2,   arts: 1,   pe: 2 },

  // Nebraska
  "Nebraska":       { total: null,english: 4,   math: 3,   science: 3,   social: 3,   arts: 0,   pe: null },

  "Nevada":         { total: 23,  english: 4,   math: 3,   science: 2,   social: 3,   arts: 1,   pe: 2 },
  "New Hampshire":  { total: 20,  english: 4,   math: 3,   science: 2,   social: 2.5, arts: 0.5, pe: 1 },
  // New Jersey 
  "New Jersey":     { total: 120, english: 20,  math: 15,  science: 15,  social: 15,  arts: 5,   pe: 10 },
  "New Mexico":     { total: 24,  english: 4,   math: 4,   science: 3,   social: 3.5, arts: 1,   pe: 1 },
  "New York":       { total: 22,  english: 4,   math: 3,   science: 3,   social: 4,   arts: 1,   pe: 2 },

  "North Carolina": { total: 22,  english: 4,   math: 4,   science: 3,   social: 4,   arts: 1,   pe: 1 },
  "North Dakota":   { total: 22,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 0,   pe: 1 },
  "Ohio":           { total: 20,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 2,   pe: 1 },
  "Oklahoma":       { total: 23,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 2,   pe: 1 },

  // Oregon
  "Oregon":         { total: 24,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 3,   pe: 1 },

  // Pennsylvania
  "Pennsylvania":   { total: null,english: 4,   math: 3,   science: 3,   social: 3,   arts: 0,   pe: null },

  "Rhode Island":   { total: 20,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "South Carolina": { total: 24,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "South Dakota":   { total: 22,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 0.5 },
  "Tennessee":      { total: 22,  english: 4,   math: 4,   science: 3,   social: 3,   arts: 1,   pe: 1.5 },
  "Texas":          { total: 22,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Utah":           { total: 24,  english: 4,   math: 3,   science: 3,   social: 3.5, arts: 1.5, pe: 2 },
  "Vermont":        { total: 20,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 1,   pe: 1 },
  "Virginia":       { total: 22,  english: 4,   math: 3,   science: 3,   social: 4,   arts: 2,   pe: 2 },

  // Washington
  "Washington":     { total: 24,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 2,   pe: 2 },

  "West Virginia":  { total: 22,  english: 4,   math: 4,   science: 3,   social: 4,   arts: 1,   pe: 1 },
  "Wisconsin":      { total: 22,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 0,   pe: 1.5 },
  "Wyoming":        { total: 24,  english: 4,   math: 3,   science: 3,   social: 3,   arts: 0,   pe: 2 },

  // Abbreviation 
  "DC": { total: 24, english: 4, math: 4, science: 4, social: 4, arts: 1, pe: 1 },
  "NC": { total: 22, english: 4, math: 4, science: 3, social: 4, arts: 1, pe: 1 },
  "SC": { total: 24, english: 4, math: 4, science: 3, social: 3, arts: 1, pe: 1 }
};

export default STATE_REQS;
