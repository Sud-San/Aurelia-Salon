# Reflection: One Thing the Agent Got Wrong

**Course:** MSc IT — Vibe Coding Lab  
**Project:** Aurelia Salon Queue Management System  
**Deliverable:** Half-Page Reflection (`fixes.md`)

---

### 1. What the Agent Got Wrong
When implementing the Barber Workstation (`/barber`) and Reception Dashboard (`/reception`), the AI agent incorrectly implemented stylist availability (`Available` vs. `On Break`) as local, component-level React state rather than synchronizing it through the database and WebSocket layer. Furthermore, the "Call Next" logic initially failed to properly update the barber's active chair status in real time. When a stylist toggled their status to "Available", the system failed to reflect the change on the reception desk or the waiting area TV board, preventing the stylist from calling waiting customers.

### 2. How I Noticed It
I caught this bug while following the **Multi-Device Sync Check** from the lab checklist:
1. I opened two browser windows side-by-side: Window A logged in as Stylist Amit (`/barber`), and Window B on the Reception Desk (`/reception`).
2. On Window A, Amit finished a break and clicked `[ Available ]`.
3. However, on Window B, Amit's chair card remained stuck on `On Break`, and clicking `[ Call Next ]` returned an error stating the barber was not on duty.
4. Inspecting the browser's Developer Tools Network tab revealed that the toggle only updated local component state without persisting to MongoDB or broadcasting a `barber:status_changed` event through Socket.IO.

### 3. How I Fixed My Prompt and Documentation
Rather than repeatedly prompting with vague instructions like *"make available barber work"*, I followed the core principle taught in the Vibe Coding Guide: **"The details live in your docs — update the docs first, then give a scoped prompt."**

1. **Updated `docs/03-flows-rules.md` & `AGENTS.md`**:  
   I added an explicit invariant stating that barber duty (`AVAILABLE`, `BUSY`, `ON_BREAK`) is a server-authoritative state that must persist in MongoDB and immediately broadcast to all connected clients (`reception`, `tv_board`, `customer`). I also enforced that all queue transition logic must reside in a single file (`server/services/queueRules.js`).
2. **Constructed a Scoped, Concrete Prompt**:  
   > *"Read Rule 3 and 4 in `docs/03-flows-rules.md`. In `server/controllers/barberController.js` and `server/services/queueService.js`, persist the barber's duty status to the database, trigger `io.emit('barber:status_changed')`, and ensure `queueRules.canBarberTakeCustomer()` evaluates this status before assigning a token. Do not touch client UI styling."*

### 4. Key Takeaway
AI coding assistants naturally default to isolated, single-page state (`useState`) unless explicitly instructed otherwise. In real-time multi-client systems (phone, tablet, TV), you cannot rely on the agent's assumptions. Providing explicit state machine rules and communication contracts in `docs/` before prompting is what makes vibe coding reliable and production-ready.
