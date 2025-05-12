# HireFire (A  Worker Hiring System)

This repository contains the **HireFire** project, which includes both the backend and frontend components. Follow the instructions below to set up and run the project.

---

## Prerequisites

- **Backend**:  
  - JDK 17
  - Apache Maven 3.9.9
  - IntelliJ IDEA (or any Java IDE)

- **Frontend**:  
  - Node.js and npm
  - React Native
  - Expo Go app (for Android)

---

## Setup Instructions

### Backend

1. Open the `HireFireBackend` folder in IntelliJ IDEA.
2. Navigate to `src/main/java/com.HireFire.HireFireBackend`.
3. Open `HireFireBackendApplication.java` and run it.

### Frontend

1. Open the `HireFireFrontend` folder in Visual Studio Code.
2. Locate the `config.js` file and update the IPv4 address to your local machine's IPv4 address.  
   - You can find your IPv4 address by running the following command in the terminal:
     ```bash
     ipconfig
     ```
3. Open a terminal in the `HireFireFrontend` directory and install dependencies:
   ```bash
   npm install --force

4. Start the application:
   ```bash
   npm start
   
5. Use the QR code displayed in the terminal to open the app on an Android device using the Expo Go app.
