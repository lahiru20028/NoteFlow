📝 NoteFlow - Full-Stack Collaborative Note-Taking App

NoteFlow is a robust full-stack web application built using the **MERN Stack** (MongoDB, Express, React, Node.js). It allows users to create, manage, and securely share rich-text notes with others in real-time.

🚀 Key Features

* **Secure Authentication**: User registration and login powered by **JWT (JSON Web Tokens)** for secure access.
* **Rich Text Editing**: Integrated **React-Quill** editor for formatting text (Bold, Italic, Lists) and inserting links.
* **Collaboration**: Securely share notes with other registered users via their email addresses.
* **Full-Text Search**: Quickly find specific notes using a dynamic search bar that filters by title and content.
* **Note Management (CRUD)**: Create, Read, Update, and Delete notes with a sleek, intuitive interface.
* **Responsive Design**: Built with **Tailwind CSS** to ensure a seamless experience across Mobile, Tablet, and Desktop devices.

🛠️ Technology Stack

* **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios
* **Backend**: Node.js, Express.js
* **Database**: MongoDB Atlas (Cloud)
* **State Management**: React Hooks (useState, useEffect)

💻 Installation & Setup

Follow these steps to run the project locally:

1. Clone the Repository
```bash
git clone [https://github.com/lahiru20028/NoteFlow.git]
cd NoteFlow

2. Backend Configuration
cd server
npm install

3. Start the server
node index.js

3. Frontend Configuration
cd ../client
npm install
npm run dev

The app will be running at http://localhost:5173
