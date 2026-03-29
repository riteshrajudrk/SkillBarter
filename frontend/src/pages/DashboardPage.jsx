import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestCard from "../components/cards/RequestCard.jsx";
import api from "../services/api.js";

const emptyDashboard = {
  stats: {
    receivedCount: 0,
    sentCount: 0,
    acceptedCount: 0,
    pendingCount: 0
  },
  receivedRequests: [],
  sentRequests: []
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [activeTab, setActiveTab] = useState("received");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data);
    } catch (_error) {
      setDashboard(emptyDashboard);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRequestAction = async (requestId, status) => {
    try {
      await api.patch(`/swaps/${requestId}`, { status });
      setMessage(`Request ${status} successfully.`);
      loadDashboard();
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || "Could not update request.");
    }
  };

  const openChat = (user) => {
    navigate(`/messages?userId=${user._id}&name=${encodeURIComponent(user.name)}`);
  };

  const activeRequests = activeTab === "received"
    ? dashboard.receivedRequests
    : dashboard.sentRequests;

  return (
    <div>
      <div className="mb-8">
        <p className="section-label">Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Manage your swap requests</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review requests, track their status, and start a conversation after acceptance.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="soft-card p-5">
          <p className="text-sm text-slate-400">Received</p>
          <p className="mt-2 text-2xl font-bold text-white">{dashboard.stats.receivedCount}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-400">Sent</p>
          <p className="mt-2 text-2xl font-bold text-white">{dashboard.stats.sentCount}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-400">Accepted</p>
          <p className="mt-2 text-2xl font-bold text-white">{dashboard.stats.acceptedCount}</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="mt-2 text-2xl font-bold text-white">{dashboard.stats.pendingCount}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setActiveTab("received")}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${activeTab === "received" ? "bg-emerald-400 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
        >
          Received Requests
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sent")}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${activeTab === "sent" ? "bg-emerald-400 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
        >
          Sent Requests
        </button>
      </div>

      {message ? <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-sm">{message}</div> : null}
      {loading ? <p className="mb-4 text-sm text-slate-400">Loading dashboard...</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {activeRequests.map((request) => (
          <RequestCard
            key={request._id}
            title={activeTab === "received" ? "Received from" : "Sent to"}
            request={request}
            type={activeTab}
            onAction={handleRequestAction}
            onOpenChat={openChat}
          />
        ))}
      </div>

      {!loading && !activeRequests.length ? (
        <div className="surface-card p-8 text-center text-sm text-slate-400">
          {activeTab === "received" ? "No received requests yet." : "No sent requests yet."}
        </div>
      ) : null}
    </div>
  );
}
