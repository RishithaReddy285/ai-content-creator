## AI-Powered Content Summarizer

This repository contains a full-stack AI-powered content summarizer. Below are the main sections in the requested order with links to key files.

**1. Complete Project Folder Structure**
- `server/` - backend (Express + Mongoose)
- `client/` - frontend (React + Vite + Tailwind)

**2. Frontend Setup**
- Package manifest: [client/package.json](client/package.json#L1)
- Vite config (dev proxy): [client/vite.config.js](client/vite.config.js#L1)

**3. Backend Setup**
- Package manifest: [server/package.json](server/package.json#L1)
- Server entry: [server/src/index.js](server/src/index.js#L1-L120)

**4. MongoDB Atlas Configuration**
- Instructions: [server/README.md](server/README.md#L1)

**5. React Frontend Code**
- Main entry: [client/src/main.jsx](client/src/main.jsx#L1)
- App routes: [client/src/App.jsx](client/src/App.jsx#L1)
- Pages: [client/src/pages](client/src/pages)

**6. Express Backend Code**
- Routes: [server/src/routes/authRoutes.js](server/src/routes/authRoutes.js#L1), [server/src/routes/summaryRoutes.js](server/src/routes/summaryRoutes.js#L1), [server/src/routes/historyRoutes.js](server/src/routes/historyRoutes.js#L1)
- Controllers: [server/src/controllers](server/src/controllers)

**7. API Routes**
- Auth: `/api/auth/*` -> [server/src/routes/authRoutes.js](server/src/routes/authRoutes.js#L1)
- Summaries: `/api/summaries/*` -> [server/src/routes/summaryRoutes.js](server/src/routes/summaryRoutes.js#L1)
- History: `/api/history/*` -> [server/src/routes/historyRoutes.js](server/src/routes/historyRoutes.js#L1)

**8. Database Models**
- `User` model: [server/src/models/User.js](server/src/models/User.js#L1)
- `Summary` model: [server/src/models/Summary.js](server/src/models/Summary.js#L1)

**9. Authentication Flow**
- JWT + bcrypt implemented in [server/src/controllers/authController.js](server/src/controllers/authController.js#L1) and protected by [server/src/middlewares/authMiddleware.js](server/src/middlewares/authMiddleware.js#L1)

**10. AI Integration**
- OpenAI wrapper: [server/src/utils/openai.js](server/src/utils/openai.js#L1)

**11. File Upload Logic**
- File extractors and upload handling: [server/src/utils/extractors.js](server/src/utils/extractors.js#L1) and multer usage in [server/src/routes/summaryRoutes.js](server/src/routes/summaryRoutes.js#L1)

**12. URL Summarization Logic**
- HTML extraction: [server/src/utils/extractors.js](server/src/utils/extractors.js#L1)

**13. Deployment Steps**
- Frontend: deploy `client` to Vercel (build command: `npm run build`, output `dist`)
- Backend: deploy `server` to Render or Railway, set `PORT` and env vars, start with `npm start`
- DB: connect MongoDB Atlas and set `MONGO_URI`

**14. Environment Variables**
- Examples: [server/.env.example](server/.env.example#L1), [client/.env.example](client/.env.example#L1)

**15. README.md**
- This file. More detailed server README: [server/README.md](server/README.md#L1)

**16. Testing Instructions**
- Run backend tests manually by calling endpoints with Postman or curl.
- Example API test using `curl` (replace token):

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"t@t.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"t@t.com","password":"pass123"}'

# Summarize text (replace TOKEN)
curl -X POST http://localhost:5000/api/summaries/text -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"content":"Long article...","summaryLength":"short"}'
```

---

If you want, I can now:
- run `npm install` for both `server` and `client` here,
- or add more frontend polish, tests, and CI/CD scripts.

Which next step would you like me to perform?
"# ai-content-creator" 
"# ai-content-creator" 
