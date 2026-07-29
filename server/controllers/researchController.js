// import Research from '../models/Research.js';
// import { asyncHandler } from '../utils/asyncHandler.js';

// // GET /api/research
// export const getAll = asyncHandler(async (req, res) => {
//   const items = await Research.find({ userId: req.user._id }).sort({ createdAt: -1 });
//   res.json(items);
// });

// // POST /api/research
// export const create = asyncHandler(async (req, res) => {
//   const item = await Research.create({ ...req.body, userId: req.user._id });
//   res.status(201).json(item);
// });

// // PUT /api/research/:id
// export const update = asyncHandler(async (req, res) => {
//   const item = await Research.findOneAndUpdate(
//     { _id: req.params.id, userId: req.user._id },
//     { $set: req.body },
//     { new: true, runValidators: true },
//   );
//   if (!item) return res.status(404).json({ message: 'Company not found.' });
//   res.json(item);
// });

// // DELETE /api/research/:id
// export const remove = asyncHandler(async (req, res) => {
//   const item = await Research.findOneAndDelete({
//     _id: req.params.id,
//     userId: req.user._id,
//   });
//   if (!item) return res.status(404).json({ message: 'Company not found.' });
//   res.json({ message: 'Company removed.' });
// });


import Research from '../models/Research.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/research
export const getAll = asyncHandler(async (req, res) => {
  const research = await Research.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json(research);
});

// GET /api/research/:id
export const getById = asyncHandler(async (req, res) => {
  const research = await Research.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!research) {
    return res.status(404).json({
      message: 'Research not found.',
    });
  }

  res.status(200).json(research);
});

// POST /api/research
export const create = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    company,
    tags,
    summary,
    content,
    source,
    isFavorite,
  } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({
      message: 'Title, category and content are required.',
    });
  }

  const research = await Research.create({
    userId: req.user._id,
    title,
    category,
    company,
    tags,
    summary,
    content,
    source,
    isFavorite,
  });

  res.status(201).json(research);
});

// PUT /api/research/:id
export const update = asyncHandler(async (req, res) => {
  const research = await Research.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    {
      $set: req.body,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!research) {
    return res.status(404).json({
      message: 'Research not found.',
    });
  }

  res.status(200).json(research);
});

// DELETE /api/research/:id
export const remove = asyncHandler(async (req, res) => {
  const research = await Research.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!research) {
    return res.status(404).json({
      message: 'Research not found.',
    });
  }

  res.status(200).json({
    message: 'Research deleted successfully.',
  });
});