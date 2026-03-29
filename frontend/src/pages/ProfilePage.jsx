import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setBio(user.bio || "");
    setSkillsOffered(user.skillsOffered?.map((skill) => skill.name).join(", ") || "");
    setSkillsWanted(user.skillsWanted?.map((skill) => skill.name).join(", ") || "");
  }, [user]);

  const offeredPreview = useMemo(
    () => skillsOffered.split(",").map((item) => item.trim()).filter(Boolean),
    [skillsOffered]
  );

  const wantedPreview = useMemo(
    () => skillsWanted.split(",").map((item) => item.trim()).filter(Boolean),
    [skillsWanted]
  );

  const saveProfile = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.patch("/users/profile/me", {
        name,
        bio,
        skillsOffered: offeredPreview,
        skillsWanted: wantedPreview
      });

      setUser(response.data);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="section-label">Profile</p>
        <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Edit your profile</h1>
        <p className="mt-2 text-sm text-slate-400">
          Keep your skills updated so other users can find the right match.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={saveProfile} className="surface-card p-5 sm:p-6">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Bio</label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="field-input min-h-28"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Skills Offered</label>
              <input
                value={skillsOffered}
                onChange={(event) => setSkillsOffered(event.target.value)}
                className="field-input"
                placeholder="Example: React, JavaScript"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Skills Wanted</label>
              <input
                value={skillsWanted}
                onChange={(event) => setSkillsWanted(event.target.value)}
                className="field-input"
                placeholder="Example: Python, UI Design"
              />
            </div>

            {message ? <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">{message}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full sm:w-auto disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="soft-card p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-200">Offered skills preview</p>
            <p className="mt-2 text-sm text-slate-400">{offeredPreview.join(", ") || "No skills added yet"}</p>
          </div>
          <div className="soft-card p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-200">Wanted skills preview</p>
            <p className="mt-2 text-sm text-slate-400">{wantedPreview.join(", ") || "No skills added yet"}</p>
          </div>
          <div className="soft-card p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-200">Profile tip</p>
            <p className="mt-2 text-sm text-slate-400">
              The clearer your offered and wanted skills are, the easier it is for other users to send useful requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
