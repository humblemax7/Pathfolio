
import STATE_REQS from "./stateReqs";

//  Subject labels & general tips (shown after the requirement line) 
const SUBJECT_LABEL = {
  english: "English",
  math: "Math",
  science: "Science",
  social: "Social Studies",
  arts: "Arts/Electives",
  pe: "PE/Health",
};

const SUBJECT_TIPS = {
  english:
    "Typical sequence: English I–IV. AP Lang/AP Lit often count toward English requirements.",
  math:
    "Common paths: Algebra I → Geometry → Algebra II → Pre-Calculus/Statistics → Calculus for advanced tracks.",
  science:
    "Core labs: Biology, Chemistry, Physics. Earth/Environmental or AP sciences may satisfy credits in many districts.",
  social:
    "Usually includes World History, U.S. History, Government & Economics. AP Gov/APUSH frequently satisfy parts.",
  arts:
    "Visual/Performing Arts or approved CTE design courses. If the state lists 0 credits, district rules may still apply.",
  pe:
    "PE/Health is often district-specific. Some districts offer waivers via varsity sports, marching band, or JROTC.",
};

// Helpful state name normalization & aliases 
const ALIAS = {
  DC: "District of Columbia",
  "D.C.": "District of Columbia",
  "North Carolina": "North Carolina",
  "South Carolina": "South Carolina",
  NC: "North Carolina",
  SC: "South Carolina",
};

function normalizeStateName(name) {
  if (!name) return name;
  const trimmed = String(name).trim();
  return ALIAS[trimmed] || trimmed;
}

// Format credit numbers 
function fmt(n) {
  if (n == null || Number.isNaN(Number(n))) return null;
  const x = Number(n);
  // Show ".0" when it's an integer, otherwise keep decimals as-is (e.g., 2.5, 4.5)
  return x % 1 === 0 ? `${x.toFixed(1)}` : `${x}`;
}

// Build the baseline requirement line from STATE_REQS
function requirementLine(state, key) {
  const s = normalizeStateName(state);
  const data = STATE_REQS[s];
  const subjectName = SUBJECT_LABEL[key] || (key.charAt(0).toUpperCase() + key.slice(1));
  if (!data) return "State data not found. Check your selection.";

  const val = data[key];

  // Locally determined (LD)
  if (val == null) {
    if (key === "arts") {
      return `${subjectName}: Locally determined in many districts. Check your local handbook.`;
    }
    return `${subjectName}: Requirement is locally determined; verify with your district.`;
  }

  // No statewide credit requirement
  if (val === 0) {
    return `No statewide ${subjectName} credit requirement; your district may still require ${subjectName}.`;
  }

  return `${s} requires ${fmt(val)} ${subjectName} credits.`;
}

// State specific responses
const STATE_OVERRIDES = {
  "California": {
    arts:
      "Many districts require VAPA (Visual/Performing Arts) locally; UC/CSU A–G have their own expectations.",
    social:
      "Most districts include World History/Geography and U.S. History; AP versions typically count.",
  },
  "Texas": {
    social:
      "Foundation + Endorsement plan often includes U.S. History (1.0), Government (0.5) and Economics (0.5).",
    math:
      "Common advanced options include Pre-Calculus, AP Calculus, AP Statistics, or Advanced Quantitative Reasoning.",
  },
  "New York": {
    social:
      "Regents track typically includes Global History, U.S. History, Government & Economics; Regents exams may be required.",
    science:
      "At least one lab science with Regents may be expected on certain diploma tracks—confirm with counseling.",
  },
  "District of Columbia": {
    science:
      "DC lists four lab sciences; check your school’s approved lab courses list.",
    arts:
      "A dedicated 1.0 Arts credit is part of the DC graduation framework.",
  },
  "North Carolina": {
    math:
      "NC often expects Math I, Math II, Math III plus a higher-level math aligned to post-secondary plans.",
    social:
      "NC typically includes World History, American History, and Founding Principles/Economics & Personal Finance.",
  },
  "Virginia": {
    social:
      "Standard/Advanced Studies diplomas include U.S./Virginia History and U.S./Virginia Government; verify sequences locally.",
    science:
      "Lab sciences aligned to the state SOLs; course options vary by district (e.g., Earth Science, Biology, Chemistry, Physics).",
  },
  "Florida": {
    science:
      "3.0 credits usually include Biology; other lab sciences may include Chemistry, Physics, or Environmental Science.",
    math:
      "Algebra I and Geometry are common anchors; advanced options include Statistics, Pre-Calc, and AP math.",
  },
  "New Jersey": {
    social:
      "Total Social Studies requirement includes U.S. History; Civics/Financial Literacy elements appear in many districts.",
    arts:
      "1.0 credit typically in Visual/Performing Arts; district catalogs list approved courses.",
  },
  "Minnesota": {
    social:
      "Includes U.S. History, World History, Government & Economics; district specifics vary.",
    arts:
      "1.0 credit in Arts may be fulfilled via visual, media, or performing arts sequences.",
  },
  "Tennessee": {
    social:
      "Typically includes U.S. History & Geography plus Government/Economics; confirm your cohort’s plan.",
    arts:
      "1.0 credit in Fine Arts is commonly required (band, chorus, visual arts, etc.).",
  },
  "Utah": {
    social:
      "3.5 total often includes U.S. History (1.0), World History/Geography (1.0), U.S. Government & Citizenship (0.5), plus electives.",
    arts:
      "1.5 credits in Fine Arts; options span visual, performing, and applied arts.",
  },
  "South Dakota": {
    social:
      "3.5 credits typically include U.S. History (1.0), U.S. Government (0.5), plus world or elective social studies.",
  },
  "Idaho": {
    english:
      "4.5 English credits commonly include composition and literature; senior projects vary by district.",
    arts:
      "1.0 credit may be any visual/performing arts course designated by the district.",
  },
  "Mississippi": {
    science:
      "4.0 credits often include Biology and a selection of Chemistry/Physics or approved lab sciences.",
    arts:
      "1.0 Fine Arts credit can include visual or performing arts as listed in district catalogs.",
  },
  "Washington": {
    science:
      "At least 2.0 Science; many districts encourage a third lab science for 4-year college readiness.",
    arts:
      "1.0 Arts; High School and Beyond Plan may influence recommended courses.",
  },
  "Michigan": {
    math:
      "Usually includes Algebra I, Geometry, Algebra II; senior-year math experience required under MMC guidance.",
  },
  "Kansas": {
    arts:
      "1.0 Fine Arts credit; options include band, choir, theatre, visual arts, or media arts.",
  },
  "New Mexico": {
    social:
      "3.5 credits generally include U.S. History (1.0), Government (0.5), and additional social studies.",
  },
  "New Hampshire": {
    social:
      "2.5 credits often include U.S. History and Government/Civics plus additional social studies.",
  },
  "South Carolina": {
    english:
      "Sequence typically includes English I–IV; honors/AP options may satisfy requirements.",
  },
  "Wisconsin": {
    social:
      "3.0 credits commonly include U.S. History and other social studies electives as defined by district.",
  },
  // Locally determined states requirements
  "Colorado": {
    english:
      "Locally determined. Districts publish graduation competencies; check your counseling office.",
    math:
      "Locally determined. Algebra/Geometry sequences are common; verify district pathways.",
    science:
      "Locally determined. Lab science expectations vary by district.",
    social:
      "Locally determined. U.S./World History + Civics are common—confirm locally.",
    arts:
      "Locally determined. Some districts integrate Arts via CTE or electives.",
  },
  "Massachusetts": {
    english:
      "Locally determined (state frameworks exist). MCAS requirements may influence course planning.",
    math:
      "Locally determined. Algebra/Geometry/Algebra II pathways are common; confirm with guidance.",
  },
  "Pennsylvania": {
    english:
      "Locally determined. Keystone Exams and district policies shape graduation credit plans.",
    math:
      "Locally determined. Sequences vary; check local program of studies.",
  },
};

// Final description
export default function creditInfo(state, key) {
  const s = normalizeStateName(state);
  const base = requirementLine(s, key);
  const extra = STATE_OVERRIDES[s]?.[key] || "";
  const tip = SUBJECT_TIPS[key] || "";

  // Join non empty parts with spacing
  return [base, extra, tip].filter(Boolean).join(" ");
}
