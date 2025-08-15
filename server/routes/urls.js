const express = require('express');
const { body, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Create short URL
// @route   POST /api/urls
// @access  Private
router.post('/', protect, [
  body('originalUrl', 'Original URL is required').not().isEmpty(),
  body('title', 'Title cannot be more than 100 characters').optional().isLength({ max: 100 }),
  body('description', 'Description cannot be more than 200 characters').optional().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { originalUrl, title, description, tags } = req.body;
    
    // Validate URL format
    let urlToValidate = originalUrl;
    // Add protocol if missing
    if (!urlToValidate.match(/^https?:\/\//)) {
      urlToValidate = 'https://' + urlToValidate;
    }
    
    try {
      // Use built-in URL constructor for better validation
      new URL(urlToValidate);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if URL already exists for this user
    const existingUrl = await Url.findOne({ originalUrl, user: req.user.id });
    if (existingUrl) {
      return res.json({
        originalUrl: existingUrl.originalUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/${existingUrl.shortCode}`,
        shortCode: existingUrl.shortCode,
        clicks: existingUrl.clicks,
        title: existingUrl.title,
        description: existingUrl.description,
        tags: existingUrl.tags
      });
    }

    // Generate short code
    let shortCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 40;
    while (!isUnique && attempts < maxAttempts) {
      shortCode = nanoid(3);
      const existingShortCode = await Url.findOne({ shortCode });
      if (!existingShortCode) {
        isUnique = true;
      } else {
        attempts++;
      }
    }
    if (!isUnique) {
      shortCode = nanoid(4);
    }

    const shortUrl = `${process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`}/${shortCode}`;

    // Create new URL
    const url = new Url({
      originalUrl,
      shortUrl,
      shortCode,
      title,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      user: req.user.id
    });
    await url.save();
    res.status(201).json({
      originalUrl,
      shortUrl,
      shortCode,
      title,
      description,
      tags: url.tags,
      clicks: 0
    });

  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get user's URLs
// @route   GET /api/urls
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-createdAt' } = req.query;
    
    const query = { user: req.user.id };
    
    // Search functionality
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    const urls = await Url.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');
    const total = await Url.countDocuments(query);
    res.json({
      urls,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get URL analytics
// @route   GET /api/urls/analytics/summary
// @access  Private
router.get('/analytics/summary', protect, async (req, res) => {
  try {
    const totalUrls = await Url.countDocuments({ user: req.user.id });
    const totalClicks = await Url.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);
    const recentUrls = await Url.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(5)
      .select('title clicks createdAt');
    const topUrls = await Url.find({ user: req.user.id })
      .sort('-clicks')
      .limit(5)
      .select('title clicks originalUrl');
    res.json({
      totalUrls,
      totalClicks: totalClicks.length > 0 ? totalClicks[0].total : 0,
      recentUrls,
      topUrls
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get single URL
// @route   GET /api/urls/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id).populate('user', 'name email');
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    // Make sure user owns the URL
    if (url.user._id.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }
    res.json(url);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update URL
// @route   PUT /api/urls/:id
// @access  Private
router.put('/:id', protect, [
  body('title', 'Title cannot be more than 100 characters').optional().isLength({ max: 100 }),
  body('description', 'Description cannot be more than 200 characters').optional().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let url = await Url.findById(req.params.id);
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    // Make sure user owns the URL
    if (url.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }
    const { title, description, tags, isActive } = req.body;
    url = await Url.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        tags: tags ? tags.split(',').map(tag => tag.trim()) : url.tags,
        isActive: isActive !== undefined ? isActive : url.isActive
      },
      { new: true, runValidators: true }
    );
    res.json(url);
  } catch (error) {
    console.error('Error updating URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Delete URL
// @route   DELETE /api/urls/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    if (url.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: 'URL removed' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;













// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const { nanoid } = require('nanoid');
// const Url = require('../models/Url');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// // @desc    Create short URL
// // @route   POST /api/urls
// // @access  Private
// router.post('/', protect, [
//   body('originalUrl', 'Original URL is required').not().isEmpty(),
//   body('title', 'Title cannot be more than 100 characters').optional().isLength({ max: 100 }),
//   body('description', 'Description cannot be more than 200 characters').optional().isLength({ max: 200 })
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { originalUrl, title, description, tags } = req.body;
    
//     // Validate URL format
//     let urlToValidate = originalUrl;
//     // Add protocol if missing
//     if (!urlToValidate.match(/^https?:\/\//)) {
//       urlToValidate = 'https://' + urlToValidate;
//     }
    
//     try {
//       // Use built-in URL constructor for better validation
//       new URL(urlToValidate);
//     } catch (error) {
//       return res.status(400).json({ error: 'Invalid URL format' });
//     }
//       return res.status(400).json({ error: 'Invalid URL format' });
//     }
// //dd
//     // Check if URL already exists for this user
//     const existingUrl = await Url.findOne({ originalUrl, user: req.user.id });
//     if (existingUrl) {
//       return res.json({
//         originalUrl: existingUrl.originalUrl,
//         shortUrl: `${req.protocol}://${req.get('host')}/${existingUrl.shortCode}`,
//         shortCode: existingUrl.shortCode,
//         clicks: existingUrl.clicks,
//         title: existingUrl.title,
//         description: existingUrl.description,
//         tags: existingUrl.tags
//       });
//     }

//     // Generate short code
//   let shortCode;
//   let isUnique = false;
//   let attempts = 0;
//   const maxAttempts = 40;
//   while (!isUnique && attempts < maxAttempts) {
//     shortCode = nanoid(3);
//     const existingShortCode = await Url.findOne({ shortCode });
//     if (!existingShortCode) {
//       isUnique = true;
//     } else {
//       attempts++;
//     }
//   }
//   if (!isUnique) { 
//     shortCode = nanoid(4);  
//   }
// //ddd
//     const shortUrl = `${process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`}/${shortCode}`;


//     // Create new URL
//     const url = new Url({
//       originalUrl,
//       shortUrl,
//       shortCode,
//       title,
//       description,
//       tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
//       user: req.user.id
//     });

//     await url.save();

//     res.status(201).json({
//       originalUrl,
//       shortUrl,
//       shortCode,
//       title,
//       description,
//       tags: url.tags,
//       clicks: 0
//     });

//   } catch (error) {
//     console.error('Error creating short URL:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // @desc    Get user's URLs
// // @route   GET /api/urls
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '', sort = '-createdAt' } = req.query;
    
//     const query = { user: req.user.id };
    
//     // Search functionality
//     if (search) {
//       query.$or = [
//         { originalUrl: { $regex: search, $options: 'i' } },
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { tags: { $in: [new RegExp(search, 'i')] } }
//       ];
//     }

//     const urls = await Url.find(query)
//       .sort(sort)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate('user', 'name email');

//     const total = await Url.countDocuments(query);

//     res.json({
//       urls,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     console.error('Error fetching URLs:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // @desc    Get single URL
// // @route   GET /api/urls/:id
// // @access  Private
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const url = await Url.findById(req.params.id).populate('user', 'name email');
    
//     if (!url) {
//       return res.status(404).json({ error: 'URL not found' });
//     }

//     // Make sure user owns the URL
//     if (url.user._id.toString() !== req.user.id) {
//       return res.status(401).json({ error: 'User not authorized' });
//     }

//     res.json(url);
//   } catch (error) {
//     console.error('Error fetching URL:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // @desc    Update URL
// // @route   PUT /api/urls/:id
// // @access  Private
// router.put('/:id', protect, [
//   body('title', 'Title cannot be more than 100 characters').optional().isLength({ max: 100 }),
//   body('description', 'Description cannot be more than 200 characters').optional().isLength({ max: 200 })
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     let url = await Url.findById(req.params.id);
    
//     if (!url) {
//       return res.status(404).json({ error: 'URL not found' });
//     }

//     // Make sure user owns the URL
//     if (url.user.toString() !== req.user.id) {
//       return res.status(401).json({ error: 'User not authorized' });
//     }

//     const { title, description, tags, isActive } = req.body;

//     url = await Url.findByIdAndUpdate(
//       req.params.id,
//       { 
//         title, 
//         description, 
//         tags: tags ? tags.split(',').map(tag => tag.trim()) : url.tags,
//         isActive: isActive !== undefined ? isActive : url.isActive
//       },
//       { new: true, runValidators: true }
//     );

//     res.json(url);
//   } catch (error) {
//     console.error('Error updating URL:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // @desc    Delete URL
// // @route   DELETE /api/urls/:id
// // @access  Private
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const url = await Url.findById(req.params.id);
    
//     if (!url) {
//       return res.status(404).json({ error: 'URL not found' });
//     }

//     if (url.user.toString() !== req.user.id) {
//       return res.status(401).json({ error: 'User not authorized' });
//     }

//     await Url.findByIdAndDelete(req.params.id);

//     res.json({ message: 'URL removed' });
//   } catch (error) {
//     console.error('Error deleting URL:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // @desc    Get URL analytics
// // @route   GET /api/urls/analytics/summary
// // @access  Private
// router.get('/analytics/summary', protect, async (req, res) => {
//   try {
//     const totalUrls = await Url.countDocuments({ user: req.user.id });
//     const totalClicks = await Url.aggregate([
//       { $match: { user: req.user._id } },
//       { $group: { _id: null, total: { $sum: '$clicks' } } }
//     ]);

//     const recentUrls = await Url.find({ user: req.user.id })
//       .sort('-createdAt')
//       .limit(5)
//       .select('title clicks createdAt');

//     const topUrls = await Url.find({ user: req.user.id })
//       .sort('-clicks')
//       .limit(5)
//       .select('title clicks originalUrl');

//     res.json({
//       totalUrls,
//       totalClicks: totalClicks.length > 0 ? totalClicks[0].total : 0,
//       recentUrls,
//       topUrls
//     });
//   } catch (error) {
//     console.error('Error fetching analytics:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
