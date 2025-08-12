# MyMentor 🎓

**Your Personal Interview Mentor** - A comprehensive technical interview preparation platform designed specifically for freshers.

## 🚀 Features

### 💻 Coding Problems
- **Real-world Challenges** - Practice with carefully curated coding problems
- **Multiple Difficulties** - Easy, Medium, and Hard problems
- **Company-specific** - Problems from top tech companies
- **Live Code Editor** - Monaco Editor with syntax highlighting
- **Test Case Validation** - Automatic code execution and testing

### ❓ MCQ Questions
- **Comprehensive Coverage** - Algorithms, Data Structures, System Design
- **Detailed Explanations** - Learn from every answer
- **Progress Tracking** - Monitor your performance
- **Category-wise** - Organized by topics

### 🛡️ Smart Features
- **Duplicate Detection** - Automatic prevention of duplicate content
- **Auto-generated IDs** - No manual ID management needed
- **Progress Tracking** - Monitor your learning journey
- **Google Authentication** - Secure and easy sign-in

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS v3
- **Database**: SQLite with Prisma ORM
- **Authentication**: Firebase Auth (Google Sign-in)
- **Code Editor**: Monaco Editor
- **Deployment**: Self-hosted (your controlled)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mymentor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Firebase configuration:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   node scripts/seed.js
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Usage

### For Students
1. **Sign in** with your Google account
2. **Choose your path** - Coding Problems or MCQ Questions
3. **Start practicing** - Solve problems and take quizzes
4. **Track progress** - Monitor your performance over time

### For Admins
1. **Access admin panel** at `/admin`
2. **Upload content** using JSON templates
3. **Manage problems** and MCQ questions
4. **Monitor usage** and user progress

## 📁 Project Structure

```
mymentor/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin panel
│   ├── problems/          # Problem pages
│   ├── mcq/               # MCQ pages
│   └── globals.css        # Global styles
├── modules/               # Feature modules
│   ├── problems/          # Problem-related components
│   ├── mcq/               # MCQ-related components
│   └── auth/              # Authentication components
├── shared/                # Shared components and utilities
│   ├── components/        # Reusable components
│   ├── lib/               # Database and utilities
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── prisma/                # Database schema and migrations
├── scripts/               # Database seeding and utilities
└── public/                # Static assets
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Google Authentication
3. Add your web app
4. Copy configuration to `.env`

### Database Configuration
- **SQLite**: Default for development
- **PostgreSQL**: For production (update DATABASE_URL)
- **Migrations**: Use `npx prisma migrate dev`

## 🚀 Deployment

### Self-hosted (Recommended)
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Set up reverse proxy** (nginx/apache)
4. **Configure SSL** for HTTPS
5. **Set up database** (PostgreSQL for production)

### Environment Variables
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

## 📊 Features in Detail

### Smart Content Management
- **Auto-generated IDs** - No manual ID management
- **Duplicate Detection** - Prevents accidental duplicates
- **Batch Upload** - Upload multiple items at once
- **Template System** - Easy content creation

### Code Execution
- **Safe Environment** - Sandboxed code execution
- **Test Case Validation** - Automatic testing
- **Error Handling** - Clear error messages
- **Performance Metrics** - Execution time tracking

### User Experience
- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - Coming soon
- **Progress Tracking** - Visual progress indicators
- **Personalized Dashboard** - Coming soon

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [Wiki](../../wiki)
- **Issues**: Report bugs on [GitHub Issues](../../issues)
- **Discussions**: Join the [GitHub Discussions](../../discussions)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic coding problems
- ✅ MCQ questions
- ✅ User authentication
- ✅ Admin panel
- ✅ Code execution

### Phase 2 (Next)
- 🔄 Real-time features
- 🔄 Interviews
- 🔄 Advanced analytics
- 🔄 Company-specific tracks

### Phase 3 (Future)
- 📋 AI-powered recommendations
- 📋 Video explanations
- 📋 Peer learning
- 📋 Certification system

---

**Built with ❤️ for freshers preparing for technical interviews**

*MyMentor - Your journey to interview success starts here!*
