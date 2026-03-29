import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export default function ProfileSetupPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate("/feed");
    }
  }, [navigate, user]);

  const offeredPreview = useMemo(
    () => skillsOffered.split(",").map((item) => item.trim()).filter(Boolean),
    [skillsOffered]
  );

  const wantedPreview = useMemo(
    () => skillsWanted.split(",").map((item) => item.trim()).filter(Boolean),
    [skillsWanted]
  );

  const submitProfile = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.patch("/auth/onboarding", {
        name,
        bio,
        skillsOffered: offeredPreview,
        skillsWanted: wantedPreview
      });

      setUser(response.data);
      navigate("/feed");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="surface-card p-5 sm:p-8">
          <p className="section-label">Profile setup</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Complete your profile</h1>
          <p className="mt-3 text-sm text-slate-400">
            This step is required before you can use the main app.
          </p>

          <form onSubmit={submitProfile} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="field-input"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Bio</label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="field-input min-h-28"
                placeholder="Write a short bio"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Skills Offered</label>
              <input
                value={skillsOffered}
                onChange={(event) => setSkillsOffered(event.target.value)}
                className="field-input"
                placeholder="Example: React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Skills Wanted</label>
              <input
                value={skillsWanted}
                onChange={(event) => setSkillsWanted(event.target.value)}
                className="field-input"
                placeholder="Example: UI Design, Python"
              />
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full sm:w-auto disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        <div className="space-y-4 lg:space-y-5">
          <div className="soft-card p-5 sm:p-6">
            <p className="text-sm font-medium text-white">Offered preview</p>
            <p className="mt-2 text-sm text-slate-400">
              {offeredPreview.join(", ") || "No skills added yet"}
            </p>
          </div>
          <div className="soft-card p-5 sm:p-6">
            <p className="text-sm font-medium text-white">Wanted preview</p>
            <p className="mt-2 text-sm text-slate-400">
              {wantedPreview.join(", ") || "No skills added yet"}
            </p>
          </div>
          <div className="soft-card p-5 sm:p-6">
            <p className="text-sm font-medium text-white">Quick tip</p>
            <p className="mt-2 text-sm text-slate-400">
              Use simple comma-separated skills so other users can find you quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
