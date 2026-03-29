import { Link, NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../../utils/constants.js";
import { useAuthStore } from "../../store/authStore.js";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to={user ? "/feed" : "/"} className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-semibold text-slate-950">
              SB
            </span>
            <span className="truncate text-lg font-bold text-white sm:text-xl">SkillBarter</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-300 sm:block">
                {user.name}
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="secondary-button px-3 py-2 sm:px-4"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/auth" className="secondary-button px-3 py-2 sm:px-4">
                Login
              </Link>
              <Link to="/auth" className="primary-button px-3 py-2 sm:px-4">
                Start
              </Link>
            </div>
          )}
        </div>

        {user ? (
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-900 text-slate-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}

        {user ? (
          <nav className="mt-4 hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm transition ${isActive ? "font-semibold text-white" : "text-slate-400 hover:text-slate-200"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
