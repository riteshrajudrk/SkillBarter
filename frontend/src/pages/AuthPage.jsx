import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

const emptyForm = {
  name: "",
  email: "",
  password: ""
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.onboardingCompleted) {
      navigate("/feed");
      return;
    }

    navigate("/profile-setup");
  }, [navigate, user]);

  const updateField = (fieldName, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const response = await api.post(endpoint, payload);
      setAuth(response.data);

      if (response.data.user.onboardingCompleted) {
        navigate("/feed");
      } else {
        navigate("/profile-setup");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_480px] lg:gap-10">
        <div className="surface-card hidden p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="section-label">Welcome to SkillBarter</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Build your profile and start exchanging skills.</h1>
            <p className="mt-4 max-w-xl text-base text-slate-400">
              Sign in, complete your profile, browse people, send requests, and move accepted swaps into messages.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="soft-card p-5">
              <p className="text-sm font-medium text-white">Profile-first flow</p>
              <p className="mt-2 text-sm text-slate-400">Every user completes skills offered and skills wanted before entering the app.</p>
            </div>
            <div className="soft-card p-5">
              <p className="text-sm font-medium text-white">Simple request system</p>
              <p className="mt-2 text-sm text-slate-400">Send requests, accept them, and continue the conversation in one place.</p>
            </div>
          </div>
        </div>

        <div className="surface-card p-5 sm:p-8">
          <p className="text-sm text-slate-400">Welcome to SkillBarter</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {isLogin ? "Login to your account" : "Create your account"}
          </h1>

          <div className="mt-6 flex rounded-2xl bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${isLogin ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${!isLogin ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={submitForm} className="mt-6 space-y-4">
            {!isLogin ? (
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="field-input"
              />
            ) : null}

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="field-input"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="field-input"
            />

            {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full disabled:opacity-60"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
