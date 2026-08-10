# PrievyChat 💬

PrievyChat – Real-time chat application supporting private and group conversations, persistent messaging, online/offline presence, and media sharing, built with the MERN stack and Socket.IO.
---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io  
**Frontend:** React, React Context API, Bootstrap, React Router  
**Auth:** JWT (Bearer token, localStorage), OTP-based password reset  
**Media:** Cloudinary (signed uploads — profile pictures, images, documents)  
**Real-time:** Socket.io (live messaging, typing indicators, online status)  
**Email:** Brevo (transactional emails for OTP)

---

## Features

### Messaging

- One-to-one and group chat
- Send text messages, images, and documents (up to 1MB)
- Real-time message delivery via Socket.io
- Typing indicators (shows when the other user is typing)
- Latest message preview in chat list

### Users

- Register with name, email, password, and profile picture
- Login / Logout
- Update profile name and picture
- Search users by name or email
- Online/offline status indicators

### Group Chat

- Create group with name, picture, and members (min 3 total)
- Admin can rename group, update group picture
- Admin can add or remove members
- Members can leave the group

### Notifications

- Unread message notification badges on chat list
- Notifications auto-cleared when chat is opened

### Auth

- OTP-based password reset via email (Brevo)
- JWT token stored in localStorage, sent as Bearer token

---

## Project Structure

```
prievychat/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── socket/
│   ├── utils/
│   ├── app.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── config/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   └── utils/
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- Cloudinary account
- Brevo account (for transactional emails)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:8080
```

```bash
npm run dev
```

---

## Environment Variables Summary

| Variable                                        | Used In                                 |
| ----------------------------------------------- | --------------------------------------- |
| `MONGODB_URI`                                   | MongoDB connection                      |
| `JWT_SECRET_KEY`                                | JWT signing                             |
| `CLOUD_NAME / CLOUD_API_KEY / CLOUD_API_SECRET` | Cloudinary image/file uploads           |
| `BREVO_API_KEY`                                 | Transactional emails via Brevo HTTP API |
| `BREVO_SENDER_EMAIL`                            | Sender email address for Brevo          |
| `FRONTEND_URL`                                  | CORS + Socket.io origin (backend)       |
| `VITE_BASE_URL`                                 | Backend API and Socket.io URL           |

---

## API Overview

| Method | Endpoint                                  | Description                     |
| ------ | ----------------------------------------- | ------------------------------- |
| POST   | `/api/v1/auth/signup`                     | Register user                   |
| POST   | `/api/v1/auth/login`                      | Login                           |
| POST   | `/api/v1/auth/password-reset/otp`         | Send OTP for password reset     |
| POST   | `/api/v1/auth/password-reset/verify`      | Verify OTP                      |
| POST   | `/api/v1/auth/password-reset`             | Reset password                  |
| GET    | `/api/v1/users`                           | Search users                    |
| GET    | `/api/v1/users/me`                        | Get logged-in user              |
| PUT    | `/api/v1/users/me`                        | Update profile                  |
| GET    | `/api/v1/chats`                           | Get all user chats              |
| POST   | `/api/v1/chats/one-to-one`                | Get or create one-to-one chat   |
| POST   | `/api/v1/chats/group`                     | Create group chat               |
| PUT    | `/api/v1/chats/group/rename`              | Rename group                    |
| PUT    | `/api/v1/chats/group/add-user`            | Add user to group               |
| PUT    | `/api/v1/chats/group/remove-user`         | Remove user from group          |
| PUT    | `/api/v1/chats/group/update-picture`      | Update group picture            |
| GET    | `/api/v1/messages/chat/:chatId`           | Get messages for a chat         |
| POST   | `/api/v1/messages`                        | Send a message                  |
| GET    | `/api/v1/notifications`                   | Get unread notifications        |
| PUT    | `/api/v1/notifications/chat/:chatId/read` | Mark chat notifications as read |

---

## Author

**Ranjan Kumar Behera**  
[GitHub](https://github.com/ranjankbdev) · [LinkedIn](https://www.linkedin.com/in/ranjankb-dev/)
