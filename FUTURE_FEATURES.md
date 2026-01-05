# LOCKED IN - Future Features Roadmap

This document outlines features and improvements to be implemented by future agents or developers. The core MVP is now functional with SQLite persistence, but these enhancements will make it a production-ready application.

---

## 🔐 **PHASE 1: Authentication & Multi-User Support**

### 1.1 User Authentication System
**Priority:** HIGH  
**Current State:** Single-user MVP with hardcoded user ID

**Features to Add:**
- [ ] User registration with username/email and password
- [ ] Secure password hashing (bcrypt/argon2)
- [ ] Login/logout functionality
- [ ] Session management with JWT tokens or express-session
- [ ] Password reset flow
- [ ] Email verification (optional)

**Implementation Notes:**
- Update `shared/schema.ts` to add proper password hashing fields
- Create auth middleware for protected routes
- Add login/register pages to frontend
- Store JWT in httpOnly cookies or localStorage
- Update all API routes to use `req.user.id` instead of hardcoded `SINGLE_USER_ID`

**Files to Modify:**
- `/app/server/routes.ts` - Add auth routes and middleware
- `/app/shared/schema.ts` - Update user schema
- `/app/client/src/pages/` - Add login/register pages
- `/app/client/src/lib/api.ts` - Add auth API calls

### 1.2 Alternative: Emergent Google Social Login
**Priority:** HIGH (Alternative to 1.1)

**Features:**
- [ ] Integrate Emergent's Google OAuth system
- [ ] Store Google user profile data
- [ ] Handle OAuth callback and token management
- [ ] Link Google accounts to user profiles

**Implementation Notes:**
- Call `integration_playbook_expert_v2` with: "INTEGRATION: Emergent Google Auth"
- Follow the playbook for OAuth setup
- Update schema to include OAuth provider fields

---

## 👥 **PHASE 2: Social Features**

### 2.1 Real Leaderboard System
**Priority:** MEDIUM  
**Current State:** Mock leaderboard data in `/app/client/src/pages/social.tsx`

**Features to Add:**
- [ ] Calculate global XP rankings
- [ ] Filter leaderboards by timeframe (daily, weekly, all-time)
- [ ] Show user's rank position
- [ ] Pagination for large leaderboards
- [ ] Filter by friends/followers only

**Database Changes:**
```sql
-- Add index for efficient ranking queries
CREATE INDEX idx_user_progress_xp ON user_progress(current_xp DESC);
```

**API Endpoints to Create:**
```
GET /api/leaderboard?period=weekly&limit=100
GET /api/leaderboard/rank/:userId
```

### 2.2 Friends & Following System
**Priority:** MEDIUM

**Features:**
- [ ] Send/accept friend requests
- [ ] Follow/unfollow users
- [ ] View friends' progress
- [ ] Activity feed showing friends' achievements
- [ ] Private vs public profiles

**Schema Additions:**
```typescript
// Add to shared/schema.ts
export const friendships = sqliteTable("friendships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status", { enum: ["pending", "accepted"] }),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const follows = sqliteTable("follows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
});
```

### 2.3 Challenges & Competitions
**Priority:** LOW

**Features:**
- [ ] Create 30-day challenges (like "30-DAY MONK MODE")
- [ ] Join public challenges
- [ ] Track challenge participants
- [ ] Challenge leaderboards
- [ ] Challenge completion rewards

---

## 📊 **PHASE 3: Advanced Analytics & Insights**

### 3.1 Progress Analytics
**Priority:** MEDIUM

**Features:**
- [ ] Weekly/monthly XP trends graph
- [ ] Habit completion rate statistics
- [ ] Best/worst performing habits
- [ ] Time-of-day completion patterns
- [ ] Streak history and longest streaks
- [ ] Export data to CSV/JSON

**Frontend Components:**
- Use `recharts` (already installed) for visualizations
- Add new Analytics page/tab
- Show charts on profile page

### 3.2 Smart Insights & Recommendations
**Priority:** LOW

**Features:**
- [ ] AI-powered habit suggestions based on completion patterns
- [ ] Optimal habit scheduling recommendations
- [ ] Identify habits that lead to streak failures
- [ ] Motivational insights ("You complete 30% more habits on Mondays!")

**Implementation:**
- Could integrate AI via Emergent LLM Key for insights
- Call `integration_playbook_expert_v2` with: "INTEGRATION: OpenAI GPT-4 for habit insights"

---

## 🎯 **PHASE 4: Gamification Enhancements**

### 4.1 Achievement/Badge System
**Priority:** MEDIUM

**Features:**
- [ ] Unlock badges for milestones (10-day streak, Level 10, etc.)
- [ ] Rare achievements for difficult goals
- [ ] Display badges on profile
- [ ] Achievement notifications

**Schema Addition:**
```typescript
export const achievements = sqliteTable("achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  rarity: text("rarity", { enum: ["common", "rare", "epic", "legendary"] }),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }),
});
```

### 4.2 Custom Rewards System
**Priority:** LOW

**Features:**
- [ ] Users define custom rewards for XP milestones
- [ ] "Redeem" rewards when reaching goals
- [ ] Reward history tracking

---

## 🔔 **PHASE 5: Notifications & Reminders**

### 5.1 Push Notifications (Web/Mobile)
**Priority:** MEDIUM

**Features:**
- [ ] Daily habit reminders at custom times
- [ ] Streak warning notifications
- [ ] Achievement unlock notifications
- [ ] Friend activity notifications
- [ ] Challenge starting soon alerts

**Implementation Options:**
- Web Push API for browser notifications
- Firebase Cloud Messaging for mobile
- Email notifications as fallback

### 5.2 Email Notifications
**Priority:** LOW

**Features:**
- [ ] Weekly progress report emails
- [ ] Missed day reminder emails
- [ ] Achievement celebration emails

**Integration:**
- Call `integration_playbook_expert_v2` with: "INTEGRATION: SendGrid email service"
- Or use Nodemailer with SMTP

---

## 📱 **PHASE 6: Mobile Optimization**

### 6.1 Progressive Web App (PWA)
**Priority:** HIGH

**Features:**
- [ ] Add service worker for offline support
- [ ] Install as standalone app
- [ ] Offline habit tracking (sync when online)
- [ ] App manifest for home screen icon

**Files to Create:**
- `/app/client/public/manifest.json`
- `/app/client/public/sw.js` (service worker)

### 6.2 Native Mobile App
**Priority:** LOW

**Options:**
- Convert to React Native
- Use Capacitor/Ionic for hybrid app
- Create separate Flutter/Swift/Kotlin apps

---

## 🗂️ **PHASE 7: Data & Content Features**

### 7.1 Custom Habit Templates
**Priority:** MEDIUM

**Features:**
- [ ] Pre-made habit templates library
- [ ] Users can save their own templates
- [ ] Share templates with community
- [ ] Import/export habit lists

### 7.2 Journal/Notes System
**Priority:** LOW

**Features:**
- [ ] Daily journal entries
- [ ] Attach notes to specific habits
- [ ] Mood tracking
- [ ] Gratitude log

### 7.3 Explore Content Management
**Priority:** LOW  
**Current State:** Hardcoded articles in `/app/client/src/pages/explore.tsx`

**Features:**
- [ ] Admin CMS for adding articles/courses
- [ ] Article/course database tables
- [ ] User bookmarks/favorites
- [ ] Reading progress tracking
- [ ] User-generated content (community posts)

---

## 🚀 **PHASE 8: Performance & Scalability**

### 8.1 Database Migration to PostgreSQL
**Priority:** MEDIUM (when user base grows)

**Why:**
- SQLite is excellent for MVP but has concurrency limitations
- PostgreSQL better for production with multiple users

**Migration Steps:**
- [ ] Export SQLite data
- [ ] Update `drizzle.config.ts` to use PostgreSQL
- [ ] Update schema imports from `sqlite-core` to `pg-core`
- [ ] Run migrations
- [ ] Import data
- [ ] Update storage.ts to use Postgres driver

**Environment Variables Needed:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### 8.2 Caching Layer
**Priority:** LOW

**Features:**
- [ ] Redis for leaderboard caching
- [ ] Cache user progress data
- [ ] Cache frequently accessed habits

---

## 🎨 **PHASE 9: Customization & Settings**

### 9.1 Theme Customization
**Priority:** LOW  
**Current State:** Dark mode only

**Features:**
- [ ] Light mode theme
- [ ] Custom color schemes
- [ ] Accent color picker
- [ ] Font size preferences

### 9.2 User Preferences
**Priority:** MEDIUM

**Features:**
- [ ] Privacy settings (public/private profile)
- [ ] Notification preferences
- [ ] Language selection
- [ ] Timezone settings
- [ ] Week start day preference

**Schema Addition:**
```typescript
export const userSettings = sqliteTable("user_settings", {
  userId: integer("user_id").primaryKey(),
  theme: text("theme").default("dark"),
  notifications: text("notifications").default("all"),
  privacy: text("privacy").default("public"),
  language: text("language").default("en"),
});
```

---

## 🛡️ **PHASE 10: Security & Privacy**

### 10.1 Security Enhancements
**Priority:** HIGH (before production)

**Features:**
- [ ] Rate limiting on API endpoints
- [ ] CSRF protection
- [ ] SQL injection prevention (use Drizzle ORM properly)
- [ ] XSS protection
- [ ] Helmet.js for security headers
- [ ] Input validation and sanitization

### 10.2 Data Privacy
**Priority:** HIGH (before production)

**Features:**
- [ ] GDPR compliance
- [ ] Privacy policy page
- [ ] Terms of service
- [ ] Data export functionality
- [ ] Account deletion
- [ ] Cookie consent banner

---

## 🔧 **PHASE 11: DevOps & Deployment**

### 11.1 Production Deployment
**Priority:** HIGH

**Current State:** Development setup only

**Steps:**
1. **Environment Configuration**
   - [ ] Set up production environment variables
   - [ ] Configure proper CORS origins
   - [ ] Set up proper database credentials
   - [ ] Configure session secrets

2. **Database Setup**
   - [ ] Provision PostgreSQL database (recommended)
   - [ ] Run production migrations
   - [ ] Set up database backups

3. **Server Setup**
   - [ ] Deploy to cloud provider (AWS, DigitalOcean, Heroku, Railway)
   - [ ] Set up reverse proxy (Nginx)
   - [ ] Configure SSL/HTTPS
   - [ ] Set up CDN for static assets

4. **Monitoring**
   - [ ] Error tracking (Sentry)
   - [ ] Analytics (Google Analytics, Mixpanel)
   - [ ] Uptime monitoring
   - [ ] Performance monitoring

### 11.2 CI/CD Pipeline
**Priority:** MEDIUM

**Features:**
- [ ] GitHub Actions workflow
- [ ] Automated testing
- [ ] Automated deployments
- [ ] Database migration automation
- [ ] Rollback strategy

---

## 📝 **PHASE 12: Testing**

### 12.1 Backend Testing
**Priority:** HIGH

**Features:**
- [ ] Unit tests for API routes
- [ ] Integration tests for database operations
- [ ] Test coverage reports
- [ ] API endpoint documentation (Swagger/OpenAPI)

**Framework:** Use Jest or Vitest

### 12.2 Frontend Testing
**Priority:** MEDIUM

**Features:**
- [ ] Component unit tests
- [ ] Integration tests
- [ ] E2E tests with Playwright or Cypress
- [ ] Visual regression testing

---

## 🐛 **Known Issues & Improvements**

### Current Limitations:
1. **Single User System** - Currently hardcoded to user ID 1
2. **No Authentication** - Anyone can access and modify data
3. **No Data Backup** - SQLite file can be lost
4. **No Error Recovery** - Failed API calls don't retry
5. **No Optimistic Updates** - UI waits for server response
6. **Mock Social Data** - Leaderboard is fake
7. **No Timezone Support** - Uses server timezone
8. **Limited Validation** - Need more input validation

### UI/UX Improvements:
- [ ] Add loading skeletons instead of blank screens
- [ ] Add error boundaries for crash recovery
- [ ] Improve mobile gesture support
- [ ] Add haptic feedback on mobile
- [ ] Add sound effects (optional)
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add onboarding tutorial for new users
- [ ] Add empty states with helpful messages

---

## 📚 **Documentation Needs**

**For Future Developers:**
- [ ] API documentation (endpoints, request/response formats)
- [ ] Database schema documentation
- [ ] Setup/installation guide
- [ ] Contributing guidelines
- [ ] Code style guide
- [ ] Architecture overview diagram
- [ ] User guide / help documentation

---

## 🎯 **Quick Wins (Easy Implementations)**

These are simple features that provide good value:

1. **Dark/Light Mode Toggle** (2-3 hours)
   - Use `next-themes` (already installed)
   - Add toggle in settings

2. **Habit Sorting** (1 hour)
   - Sort by XP, category, completion status
   - Drag-and-drop reordering

3. **Habit Categories Management** (2 hours)
   - Add custom categories
   - Category colors/icons

4. **Export Data** (2 hours)
   - Export habits to JSON/CSV
   - Export progress history

5. **Keyboard Shortcuts** (3 hours)
   - Quick habit toggle (1-8 keys)
   - Navigation shortcuts
   - Complete day shortcut

---

## 💡 **Integration Opportunities**

Consider these third-party integrations:

1. **Calendar Integration**
   - Google Calendar
   - Apple Calendar
   - Show habits in calendar view

2. **Health App Integration**
   - Apple Health
   - Google Fit
   - Auto-track exercise habits

3. **Productivity Tools**
   - Notion integration
   - Todoist sync
   - Calendar blocking

4. **Payment Integration** (for premium features)
   - Stripe for subscriptions
   - PayPal
   - In-app purchases

---

## 🎓 **Resources for Implementation**

### Key Technologies Already Installed:
- **React Query (@tanstack/react-query)** - For data fetching/caching
- **Drizzle ORM** - For database operations
- **Framer Motion** - For animations
- **Radix UI** - For accessible components
- **Zod** - For validation schemas
- **Express** - For backend API
- **Better-SQLite3** - For database

### Useful Documentation Links:
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- React Query: https://tanstack.com/query/latest
- Radix UI: https://www.radix-ui.com/primitives
- Framer Motion: https://www.framer.com/motion/

---

## 🚦 **Getting Started for Future Agents**

When picking up this project:

1. **Read Current State:**
   - App is functional with SQLite persistence
   - Single-user MVP (user ID 1)
   - Core features work: habits, tracking, XP, streaks, sprints

2. **Start Server:**
   ```bash
   cd /app
   yarn dev
   # Server runs on http://localhost:5000
   ```

3. **Database Location:**
   - `/app/data/app.db` (SQLite file)
   - Schema defined in `/app/shared/schema.ts`
   - Migrations in `/app/migrations/`

4. **Key Files:**
   - Backend API: `/app/server/routes.ts`
   - Frontend API Client: `/app/client/src/lib/api.ts`
   - State Management: `/app/client/src/hooks/use-habits.tsx`
   - Database Storage: `/app/server/storage.ts`

5. **Recommended First Task:**
   - Implement authentication (Phase 1)
   - This unlocks multi-user support and all other social features

---

## 📞 **Need Help?**

For complex integrations or when stuck:
- Use `integration_playbook_expert_v2` for third-party APIs
- Use `troubleshoot_agent` for debugging issues
- Use `testing_agent_v3` for comprehensive testing

---

**Last Updated:** January 2025  
**Version:** 1.0 (Post-MVP)  
**Status:** Core functionality complete, ready for enhancements
