# SmartTvätt

SmartTvätt är en webbapp för bokning av tvättider. Frontend och backend delar nu en gemensam projektrot och npm-konfiguration.

## Förutsättningar

- Node.js 18 eller senare
- MongoDB lokalt eller via Atlas

## Installation

Öppna en terminal i projektmappen `SmartTvatt` och installera projektets frontend- och backendberoenden:

```bash
npm install
```

Skapa sedan en `.env`-fil i projektroten med anslutningsuppgifter till MongoDB och en egen JWT-hemlighet:

```env
MONGO_URI=mongodb://localhost:27017/smarttvatt
PORT=5000
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

- `controllers/` – API- och frontendlogik
- `middleware/`, `models/`, `routes/`, `server.js` – backend
- `src/views/` – appens startpunkt, sidvyer, komponenter och stilmallar
- `src/assets/` – frontendens bilder och andra importerade tillgångar
- `public/` – statiska tillgångar
