export function badgeSet(profile){
  return {
    "Getting Started": !!profile.lastOpen,
    "1-Week Streak": (profile.streak||0) >= 7,
    "Math Master": (profile.credits?.math||0) >= 3,
    "Science Star": (profile.credits?.science||0) >= 3,
    "Planner Pro": (profile.plan||[]).length >= 4,
  };
}
