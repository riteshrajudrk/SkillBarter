import SwapRequest from "../models/SwapRequest.js";

const countByStatus = (requests, status) => {
  return requests.filter((request) => request.status === status).length;
};

export const getDashboard = async (req, res) => {
  const receivedRequests = await SwapRequest.find({ receiverId: req.user._id })
    .populate("senderId", "name bio skillsOffered skillsWanted")
    .sort({ createdAt: -1 });

  const sentRequests = await SwapRequest.find({ senderId: req.user._id })
    .populate("receiverId", "name bio skillsOffered skillsWanted")
    .sort({ createdAt: -1 });

  res.json({
    stats: {
      receivedCount: receivedRequests.length,
      sentCount: sentRequests.length,
      acceptedCount: countByStatus(receivedRequests.concat(sentRequests), "accepted"),
      pendingCount: countByStatus(receivedRequests.concat(sentRequests), "pending")
    },
    receivedRequests,
    sentRequests
  });
};
