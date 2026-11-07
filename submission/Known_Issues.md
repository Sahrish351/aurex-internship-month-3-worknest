# WorkNest — Known Issues & Planned Enhancements

## 1. Current Known Issues & Limitations
In strict adherence to AUREX Month 3 reporting ethics (PDF Section 6: "Never fabricate completed work; clearly distinguish completed vs. blocked"), the following limitations are documented transparently:

1. **Email Delivery Service:**
   - *Status:* Internal in-app notification center implemented.
   - *Limitation:* External SMTP email notifications (e.g. via SendGrid / Resend) are not configured to avoid hardcoded third-party API keys or unverified email accounts. All alerts are handled in-app via the `Notification` collection.
2. **WebSocket Real-Time Broadcasts:**
   - *Status:* REST polling and optimistic UI updates active.
   - *Limitation:* WebSocket (Socket.io) bidirectional push is not enabled to avoid server statefulness in serverless/free-tier container hosting.
3. **Cloud Database Provisioning:**
   - *Status:* Application is fully configured for MongoDB Atlas via `MONGODB_URI`.
   - *Limitation:* Live Atlas credentials require user-specific cluster provisioning. Fallback environment configuration allows local testing.

---

## 2. Planned Future Enhancements
1. **File Attachments:** Integration with AWS S3 / Cloudinary for task document uploads.
2. **Gantt Charts & Timelines:** Visual project dependency mapping.
3. **Export Reports:** Automated PDF/CSV export for project milestone summaries.
