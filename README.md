# SmartTvätt

SmartTvätt är en webbapp för bokning av tvättider. Frontend och backend delar nu en gemensam projektrot och npm-konfiguration.

## Förutsättningar

- Node.js 18 eller senare
- MongoDB lokalt eller via Atlas

## Installation

Eftersom detta är ett skolprojekt och inte lanserat i produktionsläge körs applikationen i utvecklingsläge. Både backend (API-server) och frontend (Vite) startas parallellt i två terminalfönster från projektroten:

### 1. Installera beroenden
Öppna en terminal i projektmappen `SmartTvatt` och installera projektets frontend- och backendberoenden:

```bash
npm install
```
### 2. Konfigurera miljövariabler
Skapa sedan en `.env`-fil i projektroten med anslutningsuppgifter till MongoDB och en egen JWT-hemlighet:

```env
PORT=5001
MONGO_URI=mongodb+srv://<användarnamn>:<lösenord>@smarttvatt.fg8oaoz.mongodb.net/smarttvatt?retryWrites=true&w=majority
JWT_SECRET=byt-till-en-egen-hemlig-nyckel
```

## Bygga frontend för produktion

Kör följande kommando från projektmappen:

```bash
npm run build
```

Vite kompilerar och optimerar frontendfilerna och lägger resultatet i `dist/`. Mappen skapas automatiskt och behöver inte fyllas i eller ändras manuellt.

För att testa den byggda frontendversionen lokalt:

```bash
npm run preview
```

Öppna adressen som kommandot skriver ut, vanligtvis `http://localhost:4173`. För att publicera appen distribuerar du innehållet i `dist/` till din webbserver eller hostingtjänst.

## Köra appen i utvecklingsläge

Frontend och backend startas var för sig i två terminaler, båda öppnade i projektmappen.

Terminal 1 – starta API-servern:

```bash
npm start
```

Servern behöver en nåbar MongoDB-instans och giltiga värden i `.env`.

Terminal 2 – starta Vites utvecklingsserver:

```bash
npm run dev
```

Öppna adressen som Vite skriver ut, vanligtvis `http://localhost:5173`.

## Kontrollera koden

Kör dessa kommandon från projektmappen för att bygga frontend respektive kontrollera kodstil:

```bash
npm run build
npm run lint
```

## Projektstruktur

Projektet följer en tydlig **MVC-struktur** för att hålla koden ren och strukturerad:

- `controllers/` – API- och frontendlogik
- `middleware/`, `models/` (MongoDB / Mongoose), `routes/`, `server.js` – backend
- `src/views/` – appens startpunkt, sidvyer, komponenter och stilmallar
- `src/assets/` – frontendens bilder och andra importerade tillgångar
- `public/` – statiska tillgångar

## API Endpoints

### Autentisering (`/api/auth`)
- `POST /api/auth/register` – Registrera ny boende
- `POST /api/auth/login` – Logga in och erhåll JWT-token
- `POST /api/auth/forgot-password` – Begär återställning av lösenord
- `PUT /api/auth/reset-password/:resetToken` – Sätt nytt lösenord

### Bokningar (`/api/bookings`)
- `GET /api/bookings` – Hämta alla bokningar / lediga tider
- `POST /api/bookings` – Skapa ny tvättbokning (Kräver JWT)
- `DELETE /api/bookings/:id` – Avboka tvättid (Kräver JWT)
