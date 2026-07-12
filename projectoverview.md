# SocialMedia - Full Stack MERN Application

A Twitter/X-style social media platform built with the MERN stack (MongoDB, Express, React, Node.js).

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express** | Web framework & API routing |
| **MongoDB + Mongoose** | Database & ODM |
| **JSON Web Token (JWT)** | Authentication (token-based) |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Image upload (posts, profile & cover images) |
| **cookie-parser** | Parse JWT cookies |
| **dotenv** | Environment variable management |
| **nodemon** | Development auto-restart |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **TanStack React Query v5** | Server state management (caching, fetching, mutations) |
| **Tailwind CSS v4** | Utility-first CSS |
| **daisyUI 5** | Tailwind component library |
| **react-hot-toast** | Toast notifications |
| **react-icons** | Icon library |

---

## Project Structure

```
SOCIALmedia/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js   # Signup, Login, Logout, GetMe
│   │   ├── post.controller.js   # CRUD posts, like, comment
│   │   ├── user.controller.js   # Profile, follow, update, delete user
│   │   └── notification.controller.js
│   ├── lib/generateToken.js     # JWT generation & cookie setter
│   ├── middleware/protectRoute.js # Auth middleware (JWT verification)
│   ├── models/
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── notification.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── post.route.js
│   │   ├── user.route.js
│   │   └── notification.route.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── App.jsx              # Root component + routing
│       ├── main.jsx             # Entry point
│       ├── components/
│       │   ├── common/
│       │   │   ├── Post.jsx     # Individual post card
│       │   │   ├── Posts.jsx    # Post list with feed logic
│       │   │   ├── SideBar.jsx  # Navigation + theme picker
│       │   │   ├── RightPanel.jsx  # Suggested users
│       │   │   └── LoadingSpinner.jsx
│       │   ├── hooks/
│       │   │   ├── useFollow.jsx
│       │   │   └── useUpdateUserProfile.jsx
│       │   └── skeletons/
│       │       ├── PostSkeleton.jsx
│       │       ├── ProfileHeaderSkeleton.jsx
│       │       └── RightPanelSkeleton.jsx
│       ├── pages/
│       │   ├── HomePage.jsx     # Feed with "For you" / "Following" tabs
│       │   ├── CreatePost.jsx   # Post creation form
│       │   ├── auth/
│       │   │   ├── LoginPage.jsx
│       │   │   └── SignupPage.jsx
│       │   ├── notification/
│       │   │   └── NotificationPage.jsx
│       │   └── profile/
│       │       ├── ProfilePage.jsx
│       │       └── EditProfileModal.jsx
│       └── utils/
│           ├── date.js           # Date formatting helpers
│           ├── fetchAuthUser.js  # Auth user query helper
│           └── themeContext.js   # Theme provider + daisyUI themes
└── projectoverview.md
```

---

## API Endpoints

All endpoints are prefixed with `/api`. Authentication is handled via JWT stored in an httpOnly cookie named `jwt`.

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register a new user |
| POST | `/login` | No | Log in with username + password |
| POST | `/logout` | No | Clear JWT cookie |
| GET | `/me` | Yes | Get currently authenticated user |

### Post Routes — `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/all` | Yes | Get all posts (sorted by newest) |
| GET | `/following` | Yes | Get posts from users you follow |
| GET | `/likes/:id` | Yes | Get liked posts by user ID |
| GET | `/user/:username` | Yes | Get posts by username |
| POST | `/create` | Yes | Create a new post (text + optional image) |
| POST | `/like/:id` | Yes | Like or unlike a post |
| POST | `/comment/:id` | Yes | Add a comment to a post |
| DELETE | `/:id` | Yes | Delete your own post |

### User Routes — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile/:username` | Yes | Get user profile by username |
| GET | `/suggested` | Yes | Get 4 suggested users to follow |
| POST | `/follow/:id` | Yes | Follow or unfollow a user |
| POST | `/update` | Yes | Update profile (name, bio, images, password) |
| DELETE | `/delete` | Yes | Delete your own account |

### Notification Routes — `/api/notifications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Get all notifications (marks as read) |
| DELETE | `/` | Yes | Delete all notifications |
| DELETE | `/:id` | Yes | Delete a single notification |

---

## Data Models

### User
- `username` (unique), `fullName`, `email` (unique), `password` (hashed)
- `followers[]`, `following[]` — arrays of User ObjectIds
- `profileImg`, `coverImg` — Cloudinary URLs
- `bio`, `links` — profile text fields
- `likedPosts[]` — array of Post ObjectIds

### Post
- `user` — reference to User
- `text`, `img` — post content
- `likes[]` — array of User ObjectIds
- `comments[]` — array of `{ text, user }` subdocuments

### Notification
- `from` — User who performed the action
- `to` — User who receives the notification
- `type` — enum: `"follow"`, `"like"`, `"comment"`
- `read` — boolean, defaults to false

---

## Key Features

- **JWT Authentication** — Stateless auth via httpOnly cookies
- **Image Uploads** — Posts and profile/cover images uploaded to Cloudinary
- **Follow/Unfollow** — Toggle follow state with a single endpoint
- **Like/Unlike** — Toggle like, updates both post and user's `likedPosts`
- **Commenting** — Nested subdocument comments with user population
- **Notification System** — Auto-generated on like, comment, follow
- **Suggested Users** — Random sampling excluding self and existing follows
- **Theme Switcher** — 35+ daisyUI themes persisted to localStorage
- **Optimistic UI** — React Query handles cache invalidation on mutations
