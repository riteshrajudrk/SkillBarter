import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-sm text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
