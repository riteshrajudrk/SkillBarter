import { useEffect, useState } from "react";
import UserCard from "../components/cards/UserCard.jsx";
import api from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export default function FeedPage() {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async (searchValue = "") => {
    setLoading(true);

    try {
      const response = await api.get("/users", {
        params: { q: searchValue }
      });

      const filteredUsers = response.data.filter((item) => item._id !== user?._id);
      setUsers(filteredUsers);
    } catch (_error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user?._id]);

  const submitSwapRequest = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await api.post("/swaps", {
        receiverId: selectedUser._id,
        skillOffered: user.skillsOffered?.[0]?.name || "General skill",
        skillRequested: selectedUser.skillsOffered?.[0]?.name || "Skill exchange",
        message: requestMessage
      });

      setFeedback("Swap request sent successfully.");
      setSelectedUser(null);
      setRequestMessage("");
    } catch (requestError) {
      setFeedback(requestError.response?.data?.message || "Could not send request.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label">Main feed</p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Find people to exchange skills with</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Browse all users, see what they offer, and send a swap request.
          </p>
        </div>
        <div className="surface-card flex w-full flex-col gap-3 p-3 sm:flex-row lg:max-w-md">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loadUsers(searchText);
              }
            }}
            placeholder="Search by name or skill"
            className="field-input border-0 bg-transparent px-3 py-3"
          />
          <button
            type="button"
            onClick={() => loadUsers(searchText)}
            className="secondary-button w-full px-4 py-3 sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>

      {feedback ? <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-sm">{feedback}</div> : null}

      {selectedUser ? (
        <div className="surface-card mb-6 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-white">Request swap with {selectedUser.name}</h2>
          <p className="mt-2 text-sm text-slate-400">Add an optional message before sending the request.</p>
          <textarea
            value={requestMessage}
            onChange={(event) => setRequestMessage(event.target.value)}
            className="field-input mt-4 min-h-24"
            placeholder="Example: Hi, I can help with React and would like to learn UI Design."
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={submitSwapRequest}
              className="primary-button w-full px-4 py-2 sm:w-auto"
            >
              Send Request
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setRequestMessage("");
              }}
              className="secondary-button w-full px-4 py-2 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {loading ? <p className="text-sm text-slate-400">Loading users...</p> : null}

      {!loading && !users.length ? (
        <div className="surface-card p-8 text-center text-sm text-slate-400">
          No users found. Try a different search.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {users.map((item) => (
          <UserCard key={item._id} user={item} onRequest={setSelectedUser} />
        ))}
      </div>
    </div>
  );
}
