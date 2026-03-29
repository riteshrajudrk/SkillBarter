export const buildBadges = (user) => {
  const badges = new Set(user.badges || []);

  if (user.sessionsCompleted >= 1) badges.add("First Swap");
  if (user.sessionsCompleted >= 5) badges.add("Community Helper");
  if (user.rating >= 4.8 && user.reviewsCount >= 3) badges.add("Top Teacher");
  if (user.points >= 200) badges.add("Fast Learner");

  return [...badges];
};
