import Review from "../models/Review.js";
import User from "../models/User.js";
import { buildBadges } from "../services/badgeService.js";

export const createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    reviewer: req.user._id
  });

  const reviewee = await User.findById(req.body.reviewee);
  const reviews = await Review.find({ reviewee: req.body.reviewee });
  const total = reviews.reduce((sum, item) => sum + item.rating, 0);

  reviewee.rating = Number((total / reviews.length).toFixed(2));
  reviewee.reviewsCount = reviews.length;
  reviewee.points += 25;
  reviewee.reputation += review.rating * 10;
  reviewee.badges = buildBadges(reviewee);
  await reviewee.save();

  res.status(201).json(review);
};
