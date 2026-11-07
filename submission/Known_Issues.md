# WorkNest — Known Issues & Planned Enhancements

## 1. Current Known Issues & Limitations
In strict adherence to AUREX Month 3 reporting ethics (PDF Section 6: "Never fabricate completed work; clearly distinguish completed vs. blocked"), the following project conditions are documented transparently:

1. **Formal Mentor Capstone Approval:**
   - *Status:* Proposed Capstone Project pending formal mentor sign-off.
   - *Condition:* In accordance with AUREX Month 3 guidelines, WorkNest has been fully implemented based on the approved category (Task/Project Management System), but is explicitly noted as a proposed capstone awaiting formal evaluation.
2. **Email Delivery Service:**
   - *Status:* Internal in-app notification center implemented and fully verified with unread counts.
   - *Limitation:* External SMTP email delivery (e.g. via SendGrid / Resend) is not configured in order to prevent hardcoding third-party API credentials. All operational alerts (task assignment, project invites, status updates) are delivered in-app via the `Notification` collection.
3. **WebSocket Real-Time Broadcasts:**
   - *Status:* RESTful polling with optimistic UI updates active.
   - *Limitation:* Bidirectional WebSocket push (Socket.io) is omitted to maintain stateless server design for seamless deployment on serverless and containerized cloud providers (Vercel, Render).
4. **Cloud Database Provisioning:**
   - *Status:* VERIFIED & ACTIVE.
   - *Details:* Successfully connected to MongoDB Atlas (`WorkNestCluster`), roundtrip ping verified (`{"ok":1}`), and seeded with full initial dataset.

---

## 2. Planned Future Enhancements
1. **File Attachments:** Integration with AWS S3 / Cloudinary for task document uploads.
2. **Gantt Charts & Timelines:** Visual project dependency mapping.
3. **Export Reports:** Automated PDF/CSV export for project milestone summaries.
