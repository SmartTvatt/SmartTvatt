# SmartTvatt
Developing web application called SmartTvätt. Participants: Gresa, Ellen, Vasilis, Jafar. Part of the course Webbutveckling at Jönköping University. 
tu-ta-ta-ta-tu-ta-ta

# 🚀 SmartTvätt – Hur du kör projektet (MERN)

## 1. Förutsättningar
Installera:
* Node.js (version 18+)
* Git
* MongoDB (lokalt eller Atlas)

## 2. Klona projektet

```bash
git clone <repo-url>
cd SmartTvatt
```

## 3. Backend

Gå till backend-mappen och installera beroenden:

```bash
cd Backend
npm install
```

Skapa en `.env`-fil i `Backend/` och lägg till följande:

```env
MONGO_URI=mongodb://localhost:27017/smarttvatt
PORT=3001
```

Starta backend:

```bash
npm run dev
```

Backend kör nu på: `http://localhost:3001`

## 4. Frontend

Gå till frontend-mappen och installera beroenden:

```bash
cd ../Frontend
npm install
npm run dev
```

Frontend kör nu på: `http://localhost:5173`

## 5. Starta hela appen

1. Starta backend
2. Starta frontend
3. Öppna webbläsaren på `http://localhost:5173`
