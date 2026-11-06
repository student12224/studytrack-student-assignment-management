# StudyTrack Frontend

Premium React + Vite frontend for the StudyTrack Express/MongoDB backend.

## Run locally
1. Open this `frontend-app` folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Keep the StudyTrack backend running.
5. Run `npm run dev`.
6. Open `http://localhost:5173`.

## API configuration
`.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

The frontend uses HTTP-only cookie authentication. Axios is configured with `withCredentials: true`. The backend must allow `http://localhost:5173` through CORS and set `credentials: true`.

## Expected backend routes
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /users/me`, `PUT /users/me`
- `GET /assignments`, `POST /assignments`
- `GET /assignments/:id`, `PUT /assignments/:id`, `DELETE /assignments/:id`
- `GET /dashboard`
- `GET /notifications`, `PATCH /notifications/:id/read`

The API service layer is in `src/services/`. If your backend returns a different response shape or route path, adjust that service rather than scattering endpoint changes across UI components.
