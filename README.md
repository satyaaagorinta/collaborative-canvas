# 🎨 Collaborative Real-Time Drawing Canvas

A real-time collaborative drawing application where multiple users can draw on the same canvas simultaneously with global undo/redo and synchronized shared state.

---

## 🧰 Tech Stack

**Frontend**
- HTML5 Canvas API (no drawing libraries)
- Vanilla JavaScript (ES Modules)
- CSS (Dark Mode + Poppins + Anton Typography)

**Backend**
- Node.js
- Express
- Socket.io (WebSockets)

---

## 📁 Project Structure

collaborative-canvas/
├── client/
│ ├── index.html
│ ├── style.css
│ ├── main.js
│ ├── canvas.js
│ └── websocket.js
├── server/
│ ├── server.js
│ ├── rooms.js
│ └── drawing-state.js
├── package.json
└── README.md

---

## 🏁 Setup Instructions (Local)

1. **Clone the repository**

git clone https://github.com/
<username>/collaborative-canvas.git
cd collaborative-canvas


2. **Install backend dependencies**

cd server
npm install


3. **Start the backend**


Server runs on:
node server.js


Server runs on:
http://localhost:3000


4. **Start the frontend**

Open `client/index.html` using:
- VS Code Live Server, or
- Directly in browser

---

## 👥 Testing With Multiple Users

**Option A — Same Device**
1. Open in normal browser tab
2. Open again in Incognito
3. Draw in one → strokes appear in the other

**Option B — Two Devices**
1. Backend running locally or deployed
2. Open frontend on both devices
3. Drawing synchronizes in real time

Expected behaviors:
- Strokes are synchronized live
- Undo/redo impacts all users (global)
- Clear resets canvas for all users

---

## 🧠 Behavior & Architecture Overview

**Data Flow**
mousemove → stroke event → websocket → server → broadcast → clients → canvas rendering


**Server Responsibilities**
- Maintains canonical stroke history
- Manages undo/redo stacks
- Broadcasts updates to clients
- Supports room isolation

**Undo Strategy**
undo => remove last stroke => broadcast => clients clear + replay history


Conflict handling uses simple FIFO (later stroke overwrites visually).

---

## 🐞 Known Limitations & Bugs

- No visual user cursor indicators
- No user identity or name assignment
- No persistence across refresh
- No compression for high-frequency stroke events
- Global undo not per-user attributed
- Client must use Live Server for local testing

These were trade-offs made to focus on core real-time functionality.

---

## ⏱ Time Spent on Project

| Task | Time |
|---|---|
| Learning Canvas API | ~6 hours |
| Implementing core features | ~8 hours |
| Testing & debugging | ~3 hours |
| UI styling & polish | ~1 hour |
| Documentation | ~1 hour |
| **Total** | **~19 hours**

---

## 📋 Git History / Commit Note

Development was done locally and pushed once after stabilization.  
To compensate for limited commit granularity, this README documents the iteration process, architecture, and trade-offs explicitly.

---

## 🚀 Future Improvements

Planned enhancements if continued:

- User cursor tracking
- User identity & color assignment
- Touch & mobile support
- Save/load rooms
- Persistent storage
- Deployment to Web (Railway + Netlify)
- Redis pub/sub scaling for many concurrent users
- CRDT/OT for conflict-free collaboration


