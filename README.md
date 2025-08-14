# URL Trimmer - MERN Stack

A modern, full-stack URL shortening service built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- **URL Shortening**: Convert long URLs to short, memorable links
- **Click Tracking**: Monitor how many times each shortened URL is accessed
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: See recently shortened URLs and statistics
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Mobile Responsive**: Works perfectly on all devices
- **Rate Limiting**: Built-in protection against abuse
- **Security**: Helmet.js for security headers and input validation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **nanoid** - Unique ID generation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory (copy from `env.example`):

```bash
MONGODB_URI=mongodb://localhost:27017/url-shortener
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas users:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**Or use MongoDB Atlas (cloud service)**

### 4. Run the Application

**Development Mode (with hot reload):**
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
npm run client
```

**Production Mode:**
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🌐 API Endpoints

### POST `/api/shorten`
Create a shortened URL
```json
{
  "originalUrl": "https://example.com/very-long-url"
}
```

### GET `/:shortCode`
Redirect to original URL (increments click count)

### GET `/api/stats/:shortCode`
Get statistics for a shortened URL

### GET `/api/urls`
Get all shortened URLs (for admin purposes)

## 📱 Usage

1. **Shorten a URL**: Enter any long URL in the input field and click "Shorten"
2. **Copy Link**: Use the copy button to copy the shortened URL to clipboard
3. **Visit Link**: Click the visit button to test the shortened URL
4. **View Stats**: Toggle the stats button to see overall statistics
5. **Track Clicks**: Each visit to a shortened URL increments the click counter

## 🎨 Customization

### Styling
- Modify `client/src/index.css` for custom CSS
- Update `client/tailwind.config.js` for theme customization
- Icons can be changed using Lucide React icons

### Features
- Add user authentication in `server.js`
- Implement URL expiration in the MongoDB schema
- Add custom domains support
- Implement URL analytics and charts

## 🚀 Deployment

### Heroku
```bash
# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
```

### Vercel
```bash
# Deploy frontend
vercel --prod

# Deploy backend to your preferred hosting
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Features

- **Input Validation**: URL format validation
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for protection
- **CORS**: Configurable cross-origin requests
- **MongoDB Injection Protection**: Mongoose ODM

## 📊 Performance

- **Efficient Routing**: Express.js routing with middleware
- **Database Indexing**: MongoDB indexes on shortCode and originalUrl
- **Client-side Caching**: React state management
- **Optimized Builds**: Production-ready React builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MERN Stack](https://www.mongodb.com/mern-stack) - Full-stack JavaScript solution
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful open-source icons
- [React Hot Toast](https://react-hot-toast.com/) - Elegant notifications

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/url-shortener-mern/issues) page
2. Create a new issue with detailed information
3. Include your Node.js version, MongoDB version, and error logs

---

**Happy URL Shortening! 🎉**

# URL_Trimmer
