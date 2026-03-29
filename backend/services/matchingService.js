const normalize = (skills = []) =>
  skills.map((skill) => skill.name.toLowerCase().trim());

const overlapCount = (left, right) =>
  left.filter((skill) => right.includes(skill)).length;

export const scoreMatch = (currentUser, candidate) => {
  const offeredByCurrent = normalize(currentUser.skillsOffered);
  const wantedByCurrent = normalize(currentUser.skillsWanted);
  const offeredByCandidate = normalize(candidate.skillsOffered);
  const wantedByCandidate = normalize(candidate.skillsWanted);

  const barterFit =
    overlapCount(offeredByCurrent, wantedByCandidate) * 4 +
    overlapCount(offeredByCandidate, wantedByCurrent) * 4;

  const levelFit =
    currentUser.experienceLevel === candidate.experienceLevel ? 1 : 0.5;

  const locationFit =
    currentUser.location &&
    candidate.location &&
    currentUser.location.toLowerCase() === candidate.location.toLowerCase()
      ? 1
      : 0.4;

  const availabilityFit =
    (currentUser.availability?.length || 0) > 0 &&
    (candidate.availability?.length || 0) > 0
      ? 1
      : 0.5;

  return Number(
    (barterFit + candidate.rating + levelFit + locationFit + availabilityFit).toFixed(2)
  );
};

export const rankMatches = (currentUser, users) =>
  users
    .map((candidate) => ({
      user: candidate,
      score: scoreMatch(currentUser, candidate)
    }))
    .filter((entry) => entry.score > 4)
    .sort((a, b) => b.score - a.score);
