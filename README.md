# TaskManager Project 🚀

A complete Full-Stack Task Management system built step-by-step. 
* **Frontend:** HTML, Vanilla CSS, JavaScript (To be deployed on Vercel)
* **Backend:** Java Spring Boot REST API (To be deployed on Render via Docker)
* **Database:** PostgreSQL (Neon Serverless DB)
* **Authentication:** Secure JWT implementation

---

## 📂 Project Structure

```text
d:\TaskManager(JAVA)_Project\
├── client/         # Frontend Web Application (HTML, CSS, JS)
├── server/         # Backend Spring Boot REST API (Java 17, Maven)
└── README.md       # Project Documentation
```

---

## ⚙️ How to Run the Backend Server (Local Development)

The backend is built with Spring Boot, Spring Security (JWT), and uses an active Neon PostgreSQL database out of the box.

### Option 1: Running in Eclipse / VS Code (Recommended for Students)
1. Open your IDE (Eclipse or VS Code).
2. Choose **Open Folder/Project** and point it to the `server/` folder explicitly (not the root directory).
3. Wait for the IDE to resolve the Maven dependencies.
4. Locate `src/main/java/com/taskmanager/api/TaskManagerApplication.java`
5. Right-click and run as a **Java Application**.
6. The server will start successfully on port `8080`.

### Option 2: Running via Docker (For Deployments / Render)
The project comes with a Multi-stage Dockerfile that compiles the app cleanly without requiring Maven installed locally.
```bash
cd server
docker build -t taskmanager-api .
docker run -p 8080:8080 taskmanager-api
```

### Option 3: Running via Command Line (Requires Maven)
If you have Maven (`mvn`) installed:
```bash
cd server
mvn spring-boot:run
```

---

## 🎨 How to Run the Frontend Client (Local Development)

The frontend is a pure native web app. It doesn't require complex node servers to read locally but running it via a local development server ensures that it fetches external API data securely (fixing CORS limitations on local file systems).

### Option 1: VS Code Live Server (Easiest)
1. Open the `client/` folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The client will open at `http://localhost:5500`.

### Option 2: Python HTTP Server (Mac/Windows Terminal)
If you have Python installed:
```bash
cd client
python -m http.server 3000
```
Open your browser to `http://localhost:3000`.

---

## 🔐 API Testing (Postman)

Once your backend is running (`http://localhost:8080`), you must provide a Bearer Token for creating and managing tasks.

1. Issue a `POST` request to `http://localhost:8080/api/auth/register`
   - Body: `{"username": "myuser", "password": "mypassword"}`
2. Copy the resulting `token`.
3. Put this token in the **Authorization ➔ Bearer Token** header for all `/api/tasks` endpoints.

*(Detailed endpoints can be found in the attached postman testing guide)*

---

## 🚀 Deployment

- **Backend (Render):** Deploy the `server/` directory as a Docker Web Service on Render. The provided Dockerfile handles the multi-stage build automatically.
- **Frontend (Vercel):** Connect your GitHub repository to Vercel and set the Root Directory to `client/`.
