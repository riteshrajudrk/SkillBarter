export default function UserCard({ user, onRequest }) {
  const offeredSkills = user.skillsOffered?.map((skill) => skill.name) || [];
  const wantedSkills = user.skillsWanted?.map((skill) => skill.name) || [];

  return (
    <div className="surface-card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-slate-200">
          {user.name?.slice(0, 2).toUpperCase()}
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          Skill Match
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-white">{user.name}</h3>
      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">{user.bio || "No bio added yet."}</p>

      <div className="mt-5 space-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-100">Skills Offered</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {offeredSkills.length ? offeredSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
                {skill}
              </span>
            )) : <p className="text-slate-500">No skills added</p>}
          </div>
        </div>
        <div>
          <p className="font-medium text-slate-100">Skills Wanted</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {wantedSkills.length ? wantedSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-medium text-emerald-300">
                {skill}
              </span>
            )) : <p className="text-slate-500">No skills added</p>}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRequest(user)}
        className="primary-button mt-6 w-full"
      >
        Request Swap
      </button>
    </div>
  );
}
