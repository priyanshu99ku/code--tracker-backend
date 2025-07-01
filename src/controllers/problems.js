const Problem = require('../models/problem');

/**
 * GET /problems
 * Query params:
 *   rating      – exact rating (number)
 *   minRating   – minimum rating (number)
 *   maxRating   – maximum rating (number)
 *   tag         – single tag or comma-separated list
 *   limit       – page size (default 20)
 *   page        – page number starting from 1 (default 1)
 */
exports.getProblems = async (req, res) => {
  try {
    const {
      rating,
      minRating,
      maxRating,
      tag,
      limit = 20,
      page = 1,
    } = req.query;

    const filter = {};

    if (rating) {
      filter.rating = Number(rating);
    } else {
      if (minRating) filter.rating = { ...(filter.rating || {}), $gte: Number(minRating) };
      if (maxRating) filter.rating = { ...(filter.rating || {}), $lte: Number(maxRating) };
    }

    if (tag) {
      const tags = tag.split(',').map(t => t.trim()).filter(Boolean);
      if (tags.length === 1) {
        filter.tags = tags[0];
      } else if (tags.length > 1) {
        filter.tags = { $in: tags };
      }
    }

    const lim = Math.min(Number(limit) || 20, 100);
    const skip = (Number(page) - 1) * lim;

    const [total, problems] = await Promise.all([
      Problem.countDocuments(filter),
      Problem.find(filter).skip(skip).limit(lim).lean(),
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      pageSize: lim,
      data: problems,
    });
  } catch (err) {
    console.error('Error fetching problems:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
