# SecureLink Scanner

SecureLink Scanner is a web application designed to analyse URLs for potential threats using Google Safe Browsing and a custom Machine Learning (ML) model. It provides users with detailed results about the safety and legitimacy of URLs, including phishing and suspicious activity detection.

## Features

- **Google Safe Browsing Integration**: Checks URLs against Google's Safe Browsing API to detect malware and phishing threats.
- **Machine Learning Model**: Uses a custom ML model to predict the legitimacy of URLs and provides confidence scores for phishing and legitimate classifications.
- **Kasm Secure Browser Integration**: Allows users to open suspicious URLs in a secure, isolated browser environment.
- **Responsive Design**: The application is fully responsive and optimised for both desktop and mobile devices.
- **URL Database**: Stores and displays a history of scanned URLs and their results.
- **Contact Page**: Provides a way for users to reach out for support or inquiries(inactive).

---

## Project Structure

### Frontend

The frontend is built using **React** and styled with **CSS** for a clean and responsive user interface.

#### Key Components:
- **`App.js`**: The main entry point of the application. It handles routing, user input, and API calls for URL scanning.
  - **Google Safe Browsing Check**: Sends a URL to the backend to check its safety using Google's Safe Browsing API.
  - **Manual Test (ML Model)**: Sends a URL to the backend for analysis by the custom ML model.
  - **Kasm Secure Browser**: Provides a button to open suspicious URLs in a secure browser environment.
- **`URLDatabase.js`**: Displays a list of previously scanned URLs and their results.
- **`Contact.js`**: A simple contact form for user inquiries.

#### Styling:
- **`App.css`**: Contains all the styles for the application, including responsive design for mobile devices.

---

### Backend

The backend is built using **Node.js** and **Express**, with **MongoDB** as the database for storing scan results.

#### Key Files:
- **`Server.js`**: The main server file that handles API requests.
  - **Google Safe Browsing Check**: Sends URLs to Google's Safe Browsing API and stores the results in MongoDB.
  - **ML Model Integration**: Forwards URLs to a Python-based ML model API for analysis and stores the results in MongoDB.
  - **URL History Endpoint**: Provides an endpoint to fetch all stored scan results.
- **`ScanResults.js`**: Defines the MongoDB schema for storing scan results, including Google Safe Browsing and ML model results.

---

### Tests

The project includes automated tests using **Selenium WebDriver** to ensure the functionality of the application.

#### Key Test File:
- **`ScanFlow.test.js`**: Contains tests for scanning URLs (e.g., Google and GitHub) and verifying the results displayed on the frontend.

---

## How It Works

1. **User Input**: The user enters a URL into the input field on the homepage.
2. **Google Safe Browsing Check**:
   - The URL is sent to the backend, which forwards it to Google's Safe Browsing API.
   - The API checks the URL for threats and returns the results.
   - The results are displayed on the frontend and stored in the database.
3. **ML Model Check**:
   - The URL is sent to the backend, which forwards it to a Python-based ML model API.
   - The ML model predicts whether the URL is legitimate or phishing and provides confidence scores.
   - The results are displayed on the frontend and stored in the database.
4. **Kasm Secure Browser**:
   - If the URL is flagged as suspicious or phishing, the user can open it in a secure browser environment using Kasm.
5. **URL Database**:
   - Users can view a history of all scanned URLs and their results on the URL Database page.

---

## Installation

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- **MongoDB** instance for storing scan results.
- **ChromeDriver** for running Selenium tests.

### Steps
1. Clone the repository:
   git clone https://github.com/your-repo/securelink-scanner.git
   cd securelink-scanner
2. Install dependencies:
    - npm install
3. Start the backend server:
    - node Server.js
4. Start the frontend:
    - npm start

## Technologies Used
- Frontend: React, React Router, Circular Progress Bar
- Backend: Node.js, Express, MongoDB, Axios
- Testing: Selenium WebDriver
- Styling: CSS
- APIs: Google Safe Browsing API, Custom ML Model API
- Secure Browser: Kasm Workspaces

### DEMO
- YT: https://youtu.be/e_8h8wUYiP4