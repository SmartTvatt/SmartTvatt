# SmartTvätt

SmartTvätt är en webbapp för bokning av tvättider. Frontend och backend delar nu en gemensam projektrot och npm-konfiguration.

## Förutsättningar

- Node.js 20.19.0 eller senare
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

Kör dessa kommandon från projektmappen för att testa schemavalideringen, bygga frontend och kontrollera kodstil:

```bash
npm test
npm run build
npm run lint
```

Det första schemat med standardtider skapas automatiskt när backend startar. Administratörens ändringar av intervall sparas automatiskt i MongoDB; tillägg och borttagningar sparas direkt, och tidsändringar skickas direkt till API:t. Eventuella validerings- eller serverfel visas på schemasidan.

## Projektstruktur

Projektet följer en tydlig **MVC-struktur** för att hålla koden ren och strukturerad:

- `controllers/` – API- och frontendlogik
- `middleware/`, `models/` (MongoDB / Mongoose), `routes/`, `server.js` – backend
- `src/views/` – appens startpunkt, sidvyer, komponenter och stilmallar
- `src/assets/` – frontendens bilder och andra importerade tillgångar
- `public/` – statiska tillgångar

## Teknik och dataflöde

- **React** bygger vyerna och håller formulär- och sidtillstånd, till exempel bokning, inkorg och adminutskick.
- **Vite** startar utvecklingsservern och bygger frontendfilerna snabbt.
- **Express** tillhandahåller API-rutter och kopplar dem till controllers som hanterar anropens regler.
- **MongoDB och Mongoose** lagrar användare, bokningar, meddelanden och bokningsschema; Mongoose-modeller beskriver dokumentens struktur.
- **Bokningsschemat** lagras i MongoDB. Administratören kan spara ett gemensamt veckoschema och separata dagsöverskrivningar; servern kontrollerar att bokningar följer det sparade schemat.
- **JWT** identifierar inloggade användare. Middleware kontrollerar token och adminroll innan admin-API:er körs.
- **ESLint** hittar kodstilproblem och vanliga fel med `npm run lint`.

Adminmeddelanden skickas som in-app-meddelanden, inte e-post. Admin-API:et sparar ett meddelande per boende och boendesidan hämtar endast den inloggades meddelanden.

## API Endpoints

### Autentisering (`/api/auth`)
- `POST /api/auth/register` – Registrera ny boende
- `POST /api/auth/login` – Logga in och erhåll JWT-token
- `POST /api/auth/forgot-password` – Begär återställning av lösenord
- `PUT /api/auth/reset-password/:resetToken` – Sätt nytt lösenord

### Bokningar (`/api/bookings`)
- `GET /api/bookings` – Hämta alla bokningar / lediga tider
- `GET /api/bookings/mine` – Hämta den inloggades aktiva bokning (Kräver JWT)
- `POST /api/bookings` – Skapa ny tvättbokning (Kräver JWT)
- `DELETE /api/bookings/:id` – Avboka tvättid (Kräver JWT)

### Bokningsschema
- `GET /api/timeslots` – Hämta veckoschema och dagsöverskrivningar (Kräver JWT)
- `PUT /api/admin/timeslots` – Spara gemensamt schema eller en dagsöverskrivning (Kräver admin-JWT)

### Admin (`/api/admin`)
- `GET /api/admin/users` – Hämta användare (Kräver admin-JWT)
- `POST /api/admin/messages` – Skicka meddelande till en boende eller alla boende (Kräver admin-JWT)

### Meddelanden (`/api/messages`)
- `GET /api/messages/mine` – Hämta den inloggades meddelanden (Kräver JWT)
