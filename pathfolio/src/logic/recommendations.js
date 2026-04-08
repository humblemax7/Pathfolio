// Simple, local-only recommender: suggests *classes only* for subjects still needed.
const SUBJECT_SUGGESTIONS = {
  english: ["English 9/10/11/12", "AP English Lang", "AP English Lit", "Creative Writing"],
  math: ["Algebra I/II", "Geometry", "Precalculus", "AP Calculus AB/BC", "AP Statistics"],
  science: ["Biology", "Chemistry", "Physics", "AP Biology", "AP Chemistry", "AP Physics 1"],
  social: ["World History", "US History", "Government/Economics", "AP US History", "AP Gov"],
  arts: ["Art I/II", "Graphic Design", "Theatre", "Band/Choir", "AP Studio Art"],
  pe: ["PE", "Health", "Wellness"]
};

export function recommend({ stateReq, credits }){
  if(!stateReq || !credits) return { courses: [] };
  const courses = [];
  ["english","math","science","social","arts"].forEach(k=>{
    const req = stateReq[k];
    if(req == null) return; // LD
    const have = parseFloat(credits[k]||0);
    if(have < req){
      const pool = SUBJECT_SUGGESTIONS[k] || [];
      courses.push(...pool.slice(0, 3));
    }
  });
  return { courses };
}

export function onTrackVerdict({ requiredTotal, earned }){
  if(!requiredTotal) return { verdict: "Check local requirements" };
  const pct = (earned/requiredTotal) * 100;
  if(pct >= 90) return { verdict: "On track" };
  if(pct >= 70) return { verdict: "Getting there" };
  return { verdict: "Needs attention" };
}
