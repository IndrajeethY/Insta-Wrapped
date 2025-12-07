# InstaWrapped

> Your Instagram Year, Beautifully Wrapped

InstaWrapped is a privacy-focused web application that transforms your Instagram data export into a beautiful, Spotify Wrapped-style year-in-review experience. Discover your top interactions, engagement patterns, and activity insights through stunning animated slides.

## ✨ Features

- **📊 Comprehensive Statistics**: Analyze your likes, comments, story reactions, and more
- **💬 DM Insights**: View your most active conversations and messaging patterns
- **📈 Engagement Analytics**: Discover your engagement level and interaction trends
- **🎨 Beautiful Visualizations**: Experience your data through animated, colorful slides
- **🔒 Privacy-First**: All data processing happens in your browser - nothing is uploaded
- **📱 Shareable Results**: Generate a shareable link to show your wrapped to friends
- **⏰ Activity Patterns**: See your peak usage times and days
- **🎯 Personality Insights**: Get fun personality traits based on your usage

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Recharts** - Chart library for data visualization

### Backend
- **Go** - Backend API server
- **Gin** - Web framework for Go
- **SQLite** - Database for storing shared wraps

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or equivalent package manager)
- Go 1.21+ (for backend development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IndrajeethY/Insta-Wrapped.git
cd Insta-Wrapped
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install Go dependencies:
```bash
go mod download
```

### Development

#### Frontend Development
Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:8080`

#### Backend Development
Run the Go backend server:
```bash
go run main.go
```
Or use the provided script:
```bash
./run.sh
```

#### Full Stack Development
For full-stack development, run both the frontend and backend servers in separate terminals.

### Building for Production

Build the frontend for production:
```bash
npm run build
```

Build for development mode:
```bash
npm run build:dev
```

## 📖 Usage

1. **Export Your Instagram Data**
   - Go to Instagram Settings → Security → Download Your Information
   - Request a download of your data in JSON format
   - Wait for Instagram to prepare your data (usually takes a few days)

2. **Upload Your Data**
   - Open InstaWrapped in your browser
   - Upload your Instagram data ZIP file
   - The app will process it locally in your browser

3. **Explore Your Wrapped**
   - Navigate through beautiful animated slides
   - View your statistics and insights
   - Share your results with a generated link (optional)

## 🔒 Privacy & Security

- **Local Processing**: All Instagram data is processed entirely in your browser
- **No Server Upload**: Your personal data never leaves your device during analysis
- **Optional Sharing**: Only anonymized statistics are stored when you choose to share
- **Secure**: No tracking, no analytics, no data collection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by Spotify Wrapped
- Built with modern web technologies
- UI components from shadcn/ui

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ for Instagram users who love their data
