# 📚 Reading Companion

A comprehensive, modern reading application built with **Next.js 15**, **React 18**, and **TypeScript**. Experience mindful reading with typewriter effects, comprehensive book management, reading analytics, and beautiful dark/light themes.

![Reading Companion](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🌙 **Theme System**
- **Dark/Light Mode Toggle** with smooth transitions
- **Persistent theme preferences** stored locally
- **System-wide theme application** across all components
- **Beautiful gradient backgrounds** that adapt to theme

### 📖 **Reading Experience**
- **Typewriter Effect Reader** for mindful, focused reading
- **Adjustable reading speed** (20ms - 200ms per character)
- **Reading session tracking** with automatic time logging
- **Progress indicators** and completion celebrations
- **Immersive reading interface** with distraction-free design

### 📚 **Book Management**
- **Personal Library** with comprehensive book details
- **Book Keeper Dashboard** for advanced management
- **Search and Filter** by title, author, status, and genre
- **Reading Status Tracking** (To Read, Reading, Completed, Paused)
- **Progress Tracking** with visual progress bars
- **Personal Notes** and rating system
- **Date Tracking** (added, started, finished)

### 📊 **Analytics & Statistics**
- **Reading Statistics** (books read, pages, time spent)
- **Genre-based Progress Charts**
- **Average Rating Calculations**
- **Reading Session History**
- **Performance Metrics** and insights

### 🎯 **Goals & Challenges**
- **Annual Reading Goals** with progress tracking
- **Page Count Challenges**
- **Genre Exploration Goals**
- **Achievement Badges** and completion percentages

### 💬 **Quote Management**
- **Favorite Quotes Collection** with full attribution
- **Book Linking** to connect quotes with your library
- **Page Number Tracking**
- **Tag System** for quote organization
- **Beautiful Quote Display** with elegant typography

### ⏱️ **Reading Timer**
- **Pomodoro-style Reading Sessions** (5-60 minutes)
- **Session Tracking** with automatic logging
- **Book-specific Timer** integration
- **Progress Visualization** with countdown display
- **Session Completion Celebrations**

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/reading-companion.git
   cd reading-companion
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
reading-companion/
├── app/
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Main application component
│   └── loading.tsx          # Loading component
├── components/
│   └── ui/                  # shadcn/ui components
├── lib/
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── README.md                # Project documentation
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
\`\`\`

## 🛠️ Built With

### **Core Technologies**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### **UI Components**
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Lucide React](https://lucide.dev/)** - Modern icon library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components

### **Utilities**
- **[date-fns](https://date-fns.org/)** - Modern JavaScript date utility library
- **[clsx](https://github.com/lukeed/clsx)** - Conditional className utility

## ⚛️ React Architecture

### **Hooks Used**
- **`useState`** - Component state management
- **`useEffect`** - Side effects and lifecycle management
- **`useRef`** - DOM references and mutable values
- **`useMemo`** - Performance optimization for expensive calculations
- **`useCallback`** - Function memoization for performance

### **Custom Hooks**
- **`useLocalStorage`** - Persistent data storage with localStorage
- **`useReadingTimer`** - Reading session timing and management

### **State Management**
- **Local State** with React hooks
- **Persistent Storage** with localStorage
- **Optimized Re-renders** with memoization
- **Type-Safe State** with TypeScript interfaces

## 🎨 Design System

### **Color Palette**
- **Light Theme**: Blue and purple gradients with warm accents
- **Dark Theme**: Deep grays and blues with vibrant highlights
- **Status Colors**: Green (completed), Blue (reading), Orange (to-read)

### **Typography**
- **Primary Font**: Inter (clean, modern sans-serif)
- **Reading Font**: System serif fonts for comfortable reading
- **Responsive Scaling**: From mobile (text-sm) to desktop (text-6xl)

### **Components**
- **Glass Morphism**: Backdrop blur effects for modern appearance
- **Smooth Animations**: CSS transitions and transform effects
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl/2xl)

### **Adaptive Features**
- **Navigation**: Collapsible tabs on mobile
- **Grid Layouts**: Responsive column counts
- **Typography**: Scalable text sizes
- **Touch Targets**: Optimized for mobile interaction

## 🔧 Configuration

### **Environment Variables**
No environment variables required for basic functionality.

### **Customization**
- **Theme Colors**: Modify `app/globals.css` CSS variables
- **Default Data**: Update initial data in `app/page.tsx`
- **Component Styling**: Customize Tailwind classes
- **Reading Speed**: Adjust default values in component state

## 📊 Features Deep Dive

### **Library Management**
\`\`\`typescript
interface BookData {
  id: number
  title: string
  author: string
  genre: string
  excerpt: string
  pages: number
  dateAdded: Date
  dateStarted?: Date
  dateFinished?: Date
  rating?: number
  status: "to-read" | "reading" | "completed" | "paused"
  notes: string
  readingProgress: number
  timeSpent: number
  tags: string[]
}
\`\`\`

### **Reading Sessions**
\`\`\`typescript
interface ReadingSession {
  id: number
  bookId: number
  date: Date
  duration: number
  pagesRead: number
  notes: string
}
\`\`\`

### **Quote System**
\`\`\`typescript
interface QuoteData {
  id: number
  text: string
  author: string
  book: string
  bookId?: number
  dateAdded: Date
  page?: number
  tags: string[]
}
\`\`\`

## 🚀 Performance Optimizations

### **React Optimizations**
- **Memoized Components** with `useMemo` and `useCallback`
- **Efficient Re-renders** with proper dependency arrays
- **Lazy Loading** for heavy components
- **Optimized State Updates** with functional updates

### **Bundle Optimizations**
- **Tree Shaking** with ES modules
- **Code Splitting** with Next.js automatic splitting
- **Image Optimization** with Next.js Image component
- **CSS Optimization** with Tailwind CSS purging

## 🧪 Testing

\`\`\`bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with every push

### **Other Platforms**
\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** for the beautiful component library
- **[Lucide](https://lucide.dev/)** for the comprehensive icon set
- **[Tailwind CSS](https://tailwindcss.com/)** for the utility-first CSS framework
- **[Next.js](https://nextjs.org/)** team for the amazing React framework

## 📞 Support

If you have any questions or need help, please:
- **Open an issue** on GitHub
- **Check the documentation** in this README
- **Review the code comments** for implementation details

## 🗺️ Roadmap

### **Upcoming Features**
- [ ] **Export/Import** functionality for reading data
- [ ] **Social Features** for sharing reading progress
- [ ] **Reading Streaks** and achievement system
- [ ] **Audio Narration** integration
- [ ] **Reading Analytics** with detailed insights
- [ ] **Mobile App** with React Native
- [ ] **Offline Support** with service workers
- [ ] **Multi-language Support** with i18n

---

**Happy Reading! 📚✨**

Made with ❤️ using Next.js, React, and TypeScript
