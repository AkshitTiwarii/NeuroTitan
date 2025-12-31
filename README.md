# NeuroTitan - Advanced AI Research Platform-

Building the future of artificial intelligence through open research, collaborative innovation, and cutting-edge technology.

## 🚀 Features

- **Premium Dark Theme** - Monochromatic design with smooth animations
- **Interactive 3D Elements** - Spline 3D animations for engaging user experience
- **Scroll-Based Animations** - Framer Motion powered smooth reveals
- **Mouse Tracking Effects** - Interactive glow effects that follow cursor
- **Responsive Design** - Optimized for all device sizes
- **Fast Performance** - Optimized React components with lazy loading

## 🛠️ Tech Stack

- **Frontend**: React 19, Framer Motion, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **3D Graphics**: Spline
- **Backend**: Python Flask (in `/backend`)
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+ (for backend)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will run on `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python server.py
```

## 🌐 Deployment to Vercel

### Quick Deploy

1. **Push to GitHub** (already configured)
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your `NuroTitan` repository
   - Vercel will auto-detect the configuration from `vercel.json`
   - Click "Deploy"

### Manual Configuration (if needed)

- **Framework Preset**: Create React App
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `cd frontend && npm install`

### Environment Variables

No environment variables required for frontend deployment.

## 📁 Project Structure

```
NuroTitan/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   └── hooks/      # Custom React hooks
│   ├── public/         # Static assets
│   └── package.json
├── backend/            # Python Flask backend
│   ├── server.py
│   └── requirements.txt
└── vercel.json        # Vercel deployment config
```

## 👥 Team

**Founder**
- [Satyabrat Sahu](https://github.com/Satyabrat2005)

**Co-Founders**
- [Kartik Bhardwaj](https://github.com/kartik1446)
- [Ashutosh Rath](https://github.com/GitGudScrubss)

**Developers**
- [Akshit Tiwari](https://github.com/AkshitTiwarii)
- [Rajan Jha](https://github.com/Rajan167030)

## 🔗 Links

- **GitHub Organization**: [NeuroTitan-Hub](https://github.com/NeuroTitan-Hub)
- **Email**: neurotitancontact@gmail.com

## 📄 License

© 2024 NeuroTitan. All rights reserved.

## 🎨 Design Features

- Monochromatic color scheme (#000000, #FFFFFF, grays)
- Custom easing curves: `[0.22, 1, 0.36, 1]`
- Typography: Space Grotesk (headings), Montserrat (body)
- Smooth scroll-triggered animations
- Interactive hover effects
- 3D flip cards in Ecosystem section
- Mouse-tracking glow effects

---

Built with precision and passion by the NeuroTitan team.
