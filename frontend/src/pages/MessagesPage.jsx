import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const selectedUserId = searchParams.get("userId") || "";

  const selectedContact = useMemo(() => {
    return contacts.find((contact) => String(contact._id) === String(selectedUserId));
  }, [contacts, selectedUserId]);

  const loadContacts = async () => {
    setLoadingContacts(true);

    try {
      const response = await api.get("/messages/contacts");
      setContacts(response.data);
    } catch (_error) {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  const loadMessages = async (partnerId) => {
    if (!partnerId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);

    try {
      const response = await api.get(`/messages/${partnerId}`);
      setMessages(response.data);
      await api.patch(`/messages/${partnerId}/read`);
    } catch (requestError) {
      setMessages([]);
      setFeedback(requestError.response?.data?.message || "Could not load messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const openConversation = (contact) => {
    setFeedback("");
    setSearchParams({ userId: contact._id, name: contact.name });
  };

  const sendMessage = async () => {
    if (!selectedUserId || !draft.trim()) {
      return;
    }

    try {
      const response = await api.post("/messages", {
        receiver: selectedUserId,
        message: draft
      });

      setMessages((currentMessages) => [...currentMessages, response.data]);
      setDraft("");
    } catch (requestError) {
      setFeedback(requestError.response?.data?.message || "Could not send message.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="section-label">Messages</p>
        <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Contact accepted swap partners</h1>
        <p className="mt-2 text-sm text-slate-400">
          You can message users only after a swap request has been accepted.
        </p>
      </div>

      {feedback ? <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-sm">{feedback}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="surface-card p-4">
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
          <p className="mt-1 text-sm text-slate-400">Accepted users appear here.</p>

          <div className="mt-4 space-y-3 xl:max-h-[540px] xl:overflow-y-auto">
            {loadingContacts ? <p className="text-sm text-slate-400">Loading contacts...</p> : null}

            {!loadingContacts && !contacts.length ? (
              <div className="rounded-2xl bg-slate-950/70 p-4 text-sm text-slate-400">
                No accepted swap partners yet.
              </div>
            ) : null}

            {contacts.map((contact) => (
              <button
                key={contact._id}
                type="button"
                onClick={() => openConversation(contact)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${String(selectedUserId) === String(contact._id) ? "border-emerald-400 bg-emerald-400/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]" : "border-slate-800 bg-slate-950/50 text-white hover:border-slate-700 hover:bg-slate-900"}`}
              >
                <p className="font-medium">{contact.name}</p>
                <p className={`mt-1 text-sm ${String(selectedUserId) === String(contact._id) ? "text-emerald-100" : "text-slate-400"}`}>
                  {contact.bio || "No bio added yet."}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card p-4 sm:p-6">
          {selectedContact ? (
            <>
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-semibold text-white">{selectedContact.name}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Start the conversation, discuss the skill exchange, and plan the next step.
                </p>
              </div>

              <div className="mt-6 min-h-[260px] space-y-3 sm:min-h-[360px]">
                {loadingMessages ? <p className="text-sm text-slate-400">Loading messages...</p> : null}

                {!loadingMessages && !messages.length ? (
                  <div className="rounded-2xl bg-slate-950/70 p-4 text-sm text-slate-400">
                    No messages yet. Send the first message.
                  </div>
                ) : null}

                {messages.map((message) => {
                  const isOwnMessage = String(message.sender) !== String(selectedContact._id);

                  return (
                    <div
                      key={message._id}
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm sm:max-w-[75%] ${isOwnMessage ? "ml-auto bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-100"}`}
                    >
                      <p>{message.message}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  className="field-input"
                  placeholder="Write a message"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="primary-button w-full px-4 py-3 sm:w-auto"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl bg-slate-950/70 px-4 text-center text-sm text-slate-400 sm:min-h-[420px]">
              Select an accepted partner from the left to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
