# 🧩 ARCHITECTURE.md — Collaborative Drawing System

This document explains the system architecture, data flow, real-time protocol, synchronization model, and design trade-offs for the Collaborative Real-Time Drawing Canvas.

---

## 1. System Overview

The system enables multiple users to draw simultaneously on a shared canvas with real-time synchronization. It uses:

- **WebSockets** (Socket.io) for bidirectional messaging
- **Server-authoritative state** to ensure consistency
- **Native Canvas API** for rendering stroke operations
- **Rooms** for session isolation
- **Global undo/redo** for collaborative history control

---

## 2. High-Level Architecture Diagram

┌──────────────┐ stroke events ┌──────────────┐
│ Client A │ ───────────────────▶ │ │
│ (Canvas) │ ◀─────────────────── │ Server │
└──────────────┘ broadcast │ (Node + WS) │
▲ └──────────────┘
│ ▲
│ │
┌──────────────┐ stroke events │
│ Client B │ ───────────────────────────────┘
│ (Canvas) │
└──────────────┘

Server is the **source of truth** for stroke state.

---

## 3. Data Flow

**Local event pipeline:**

mousemove → stroke event → websocket emit → server → broadcast → other clients → canvas draw

---

## 4. Real-Time WebSocket Protocol

The app uses the following message types:

| Event | Direction | Meaning |
|---|---|---|
| `stroke:start` | client → server | a stroke begins |
| `stroke:point` | client → server | point sampled |
| `stroke:live` | client → server | broadcast segment to peers |
| `stroke:end` | client → server | stroke finished |
| `canvas:update` | server → client | send full stroke history |
| `undo` | client → server | request undo |
| `redo` | client → server | request redo |
| `clear` | client → server | request full reset |

The server rebroadcasts to all clients in the same **room**.

---

## 5. Canonical State Management

State is stored on the server in:

drawing-state.js


The server maintains:

- `strokes[]` — list of completed strokes
- `undoStack[]` — popped strokes for redo
- `redoStack[]` — redo buffer

Operations:

addStroke(stroke)
undo() → pop from strokes → push to redoStack
redo() → pop from redoStack → push to strokes
clear() → reset all


This makes undo/redo **global**, not per-user.

---

## 6. Rendering Strategy (Canvas)

Canvas is **immediate mode**, meaning it does not keep objects.  
Undo requires:

clear canvas
for each stroke in strokes:
draw()


This replay model avoids state divergence.

---

## 7. Rooms

Rooms allow isolated collaboration sessions.

rooms.js


Manages:

- room creation
- room membership
- stroke storage per room

---

## 8. Conflict Handling Model

Conflicts from simultaneous drawing are resolved via:

✔ **FIFO event ordering** (last stroke visually wins)

This is acceptable for drawing apps and avoids the complexity of CRDT/OT in text editors.

---

## 9. Performance Considerations

Current version uses:

- raw per-sample stroke events
- no batching
- no compression
- no prediction

This is acceptable for small groups (2–10 users).

---

## 10. Scaling Discussion (Future Work)

For >100 users or cross-region scaling:

**Recommended improvements:**

✔ WebSocket horizontal scaling using Redis Pub/Sub  
✔ Binary encoding for stroke payloads  
✔ Event coalescing / batching  
✔ Optional client-side prediction  
✔ CRDT for independent stroke merging  
✔ Persistence to store room history  
✔ CDN for static assets

---

## 11. Security Considerations

Current version lacks:

- auth
- quota
- permissions

Server trusts client requests. For production:

✔ add JWT or session IDs  
✔ throttle network events  
✔ elevate server authority for critical ops

---

## 12. Non-Functional Constraints

| Concern | Status |
|---|---|
| Latency | Low (<20ms local) |
| Scalability | Limited (single instance) |
| Fault tolerance | None (memory-only) |
| Persistence | None |
| Interop | Browser only |
| Mobile | Touch not implemented |

---

## 13. Time Trade-Offs & Justification

Given assignment timeline:

Priority was given to:

✔ real-time sync  
✔ undo/redo  
✔ shared global state  
✔ rooms  
✔ documentation  

Deprioritized:

✖ cursors  
✖ identity  
✖ persistence  
✖ scaling optimizations

---

## 14. Conclusion

The application successfully demonstrates:

✔ real-time collaborative drawing  
✔ shared state synchronization  
✔ distributed undo/redo  
✔ server-authoritative model  

while maintaining architectural clarity suitable for future extension.


