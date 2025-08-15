const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
console.log('PORT from env:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 8000;


app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['https://url-trimmer.01k.in', 'http://localhost:80'],
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Initialize Passport (without sessions)
app.use(passport.initialize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import models
const Url = require('./models/Url');
const User = require('./models/User');

// Import passport configuration
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');

// Routes
app.get('/', (req, res) => {
  res.send('URL Trimmer API is running');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

//dddddd//
app.get('/auth-callback', (req, res) => {
  const { token, userId, name, email, avatar, isPremium } = req.query;
res.redirect(`https://url-trimmer.01k.in/auth-callback?token=${token}&userId=${userId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&avatar=${encodeURIComponent(avatar)}&isPremium=${isPremium}`);
});
// Redirect to original URL (public route)
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ shortCode, isActive: true });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found or inactive' });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
