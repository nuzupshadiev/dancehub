# DanceHub

DanceHub is a collaborative platform built for choreographers and dance teams to streamline practice sessions, provide structured feedback, and enhance communication. By addressing inefficiencies in traditional choreography collaboration, DanceHub enables better coordination and creativity through advanced tools like timestamped comments, mentions, and version tracking.

---

## Key Features

- **Timestamped Comments:** Provide precise feedback on specific moments in practice videos.
- **Mentions:** Highlight individuals or key choreography sections for targeted feedback.
- **Filters:** Easily sort feedback by the user
- **Version Tracking:** Access past performance reviews to monitor progress.
- **Collaborative Environment:** Structured communication tools to minimize misunderstandings and ambiguity.

---

## Codebase structure

### Backend

/backend/src directory includes all core implementation code.

#### middleware

This folder includes all middleware used in backend server (jwtMiddleware, uploader)

#### interfaces

This folder includes definitions of types. However, type was not strictly applied to the project due to early deadline.

#### handler

All api endpoints are directed to functions in handler. Handlers include all core feature implementation.

#### database

Handles connection to database. Basically, all api endpoints use one pooled connection to mysql database.

#### index.ts

Entry point of the project. Running this code initiates the whole backend server.

---

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/nuzupshadiev/dancehub
   cd dancehub
   ```

2. **Setup Backend**:

   - Create .env file and put secrets

     ```
     # example .env

     PORT=8000
     JWT_SECRET=KimSeyeonBabo
     JWT_EXPIRES_IN=1h
     DB_USER=username
     DB_PASSWORD=password
     DB_HOST=localhost
     DB_PORT=3306
     DB_DATABASE=social_computing
     CODE_SALT=9999
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Start the development server:
     ```bash
     npm run dev
     ```

3. **Setup Frontend**:

   - Navigate to the frontend folder:
     ```bash
     cd thunderhawks
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Run the App**:
   - Open your browser and navigate to `http://localhost:3000`.

---
