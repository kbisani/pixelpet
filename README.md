# 🐱 PixelPet - Your Coding Companion

A gamified productivity app that motivates developers to maintain consistent coding habits through virtual pet companions that grow with your GitHub activity.

## ✨ Features

### 🎮 Core Mechanics
- **Virtual Pets**: Choose from 5 different pet species (Commit Cat, Bug Bee, PR Penguin, Deploy Dragon, Doc Dog)
- **Dynamic Evolution**: Pets evolve through 5 stages based on your coding consistency
- **Smart XP System**: Rewards meaningful commits with bonus XP based on project type
- **Streak Tracking**: Visual streak counter with 8-bit commit calendar

### 🎯 Project Types (Auto-detected or Manual)
- **📚 Learning Projects**: Extra XP for any progress, perfect for tutorials and practice
- **💰 Side Hustles**: Bonus rewards for documentation, READMEs, and polish work
- **🧪 Experiments**: Rewards exploration and trying new technologies
- **⭐ Portfolio Pieces**: Big bonuses for feature completion and deployment

### 📱 PWA Support
- **Add to Dock**: Works as a native macOS app via Safari
- **Offline Capable**: Core functionality works without internet
- **Push Notifications**: Get notified when your pet needs attention

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd pixelpet
   npm install
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Go to `http://localhost:3000`
   - Try "Demo Mode" to explore features without GitHub token

4. **Install as App (macOS Safari)**
   - Open in Safari
   - File → Add to Dock
   - Launch from Dock like a native app!

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with 8-bit pixel theme
- **Animations**: Framer Motion
- **State**: Zustand with persistence
- **API**: GitHub REST API
- **Deployment**: Ready for Vercel (free tier)

## 🎨 Design Philosophy

**8-Bit Nostalgia**: Retro pixel art aesthetic that developers love
**Psychology-Based**: Rewards quality over quantity, encourages sustainable habits
**Non-Punitive**: Pets get sleepy, not dead - gentle motivation without guilt
**Developer-Focused**: Built specifically for personal coding projects

## 🔧 Configuration

### Project Types
The app auto-detects project types based on:
- Repository description and topics
- File structure (README, tests, package.json)
- Commit patterns and language usage

### Custom Milestones
Each project type has different milestone timings:
- **Learning**: 2→7→21→60 days
- **Side Hustle**: 3→14→45→100 days  
- **Experiments**: 2→10→30→90 days
- **Portfolio**: 5→20→60→120 days

## 🎮 Demo Mode

Try the app without a GitHub token:
1. Click "Try Demo Mode" on auth screen
2. Use "Demo Commit" button to simulate activity
3. Watch your pet grow and evolve!

## 🔮 Future Features

- **Social Features**: Friend leaderboards and team challenges
- **Multiple Projects**: Track different repositories simultaneously
- **Achievements System**: Unlock special badges and rewards
- **Integrations**: Support for GitLab, Bitbucket, and other platforms
- **Mobile App**: Native iOS/Android versions

## 🤝 Contributing

This is a personal project starter, but feel free to:
- Fork and customize for your needs
- Submit issues and suggestions
- Share your pet screenshots!

## 📄 License

MIT - Built for developers, by developers 🚀

---

**Made with ❤️ and lots of ☕ by the coding community**