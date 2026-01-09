# LOCKED IN - Implementation Strategy

This plan bridges the gap between the current MVP and the `FUTURE_FEATURES.md` roadmap.

## 🚨 IMMEDIATE PRIORITIES (Next 24 Hours)

### 1. 🌍 Real Social Leaderboard (Phase 2)
The "Community" tab is currently fake. We need to make it real to drive competition.
- **Backend**: Implement `GET /api/leaderboard` to fetch top users by XP and Streak.
- **Frontend**: Connect `social.tsx` to this endpoint.
- **Database**: Ensure user names and avatars are public.

### 2. 🧠 Protocol Library (Phase 7 - "Explore")
Currently, the "Explore" page is just text. It should be actionable.
- **Transformation**: Rename "Explore" to **"Library"**.
- **Feature**: "Installable Protocols". Users see a card for "Monk Mode" (Meditation + No Phone + Reading) and can click **[INSTALL]** to instantly add these 3 habits to their dashboard.
- **Data**: Create a static list of "Official Protocols" in the frontend or DB.

### 3. ⚙️ User Settings (Phase 9)
Users need basic control over their profile.
- **Feature**: Add a "Settings" button to the Profile page.
- **Capabilities**:
    - Edit Display Name.
    - specialized "Danger Zone" (Reset Account / Delete).
    - Toggle Light/Dark mode (if requested, though Dark is brand).

---

## 📅 SHORT TERM (Next Sprint)

### 4. 📊 Enhanced Analytics (Phase 3)
- Add a chart to the Profile page showing XP growth over the last 30 days.
- Use `recharts` (already installed) for this.

### 5. 🔔 Notifications (Phase 5)
- Since PWA is active, ask for Notification permissions.
- Send a simple "Don't break your streak!" notification if it's 8 PM and status is pending.

---

## 🛠 TECHNICAL DEBT & MAINTENANCE

- **Optimistic Updates**: Ensure all mutations (toggles, adds) feel instant (already partially done).
- **Error Boundaries**: Handle network failures gracefully (e.g., if offline/PWA mode).
