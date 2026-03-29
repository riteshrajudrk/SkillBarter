const badgeStyles = {
  pending: "bg-amber-500/12 text-amber-300",
  accepted: "bg-emerald-500/12 text-emerald-300",
  rejected: "bg-rose-500/12 text-rose-300",
  completed: "bg-slate-700 text-slate-200"
};

export default function RequestCard({ title, request, type, onAction, onOpenChat }) {
  const otherUser = type === "received" ? request.senderId : request.receiverId;
  const canChat = request.status === "accepted" || request.status === "completed";

  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{otherUser?.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{otherUser?.bio || "No bio added yet."}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[request.status] || badgeStyles.pending}`}>
          {request.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        <p><span className="font-medium text-slate-200">Offered:</span> {request.skillOffered}</p>
        <p><span className="font-medium text-slate-200">Wanted:</span> {request.skillRequested}</p>
        <p><span className="font-medium text-slate-200">Message:</span> {request.message || "No message added"}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {type === "received" && request.status === "pending" ? (
          <>
            <button
              type="button"
              onClick={() => onAction(request._id, "accepted")}
              className="primary-button px-4 py-2"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onAction(request._id, "rejected")}
              className="secondary-button px-4 py-2"
            >
              Reject
            </button>
          </>
        ) : null}

        {canChat ? (
          <button
            type="button"
            onClick={() => onOpenChat?.(otherUser)}
            className="secondary-button px-4 py-2"
          >
            Open Chat
          </button>
        ) : null}
      </div>
    </div>
  );
}
