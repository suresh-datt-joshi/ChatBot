# TalkMate Bot

A modern chatbot application built with React, Vite, and the Gemini API, designed to deliver engaging and intelligent conversational experiences.

TalkMate Bot is an interactive AI-powered chat companion that provides instant, relevant, and context-aware responses. It's built to showcase the power of large language models in a simple, elegant web interface, making it easy for anyone to have a dynamic conversation.

<details>
<summary><b>View More Screenshots</b></summary>
<br>
<p align="center">
<img src="https://github.com/user-attachments/assets/ebb3062e-00c4-49e3-bd7e-6d98e11e4958" width="900" alt="Chatbot empty state">
<br><br>
<img src="https://github.com/user-attachments/assets/15d957b7-dcc5-4d3e-98ef-2cd38d7c3521" width="900" alt="Chatbot with a query and response">
<br><br>
<img src="https://github.com/user-attachments/assets/a155d6c1-4ddb-4619-8c0e-e3dec8edb9b2" width="900" alt="Another chatbot conversation screenshot">
</p>
</details>

---

## 🚀 Live Demo

**[View the live application here!](https://chat-bot-mu-red.vercel.app)**

---

## ✨ Features

This project is designed with a focus on a smooth development process and a rich user experience, including:

* **Interactive Chat UI**: A clean, responsive, and intuitive interface that allows users to easily send messages and view bot responses.

* **Gemini API Integration**: The core of the application, responsible for generating dynamic and relevant replies to user queries.

* **Rich Text Support**: Utilizes `react-markdown` and `remark-gfm` to render bot messages with full Markdown support, including **bold text**, `code blocks`, lists, and tables.

* **Fast Development Environment**: Powered by **Vite**, offering lightning-fast cold server start and hot module replacement (HMR) for a highly efficient development workflow.

* **Code Quality**: Integrated with **ESLint** to enforce best practices and ensure consistent, bug-free code.

* **Unique Message IDs**: Uses the `uuid` library to generate unique identifiers for each message, which is essential for managing chat state in React.

---

## 🛠️ Technologies Used

This project is built on a modern JavaScript stack:

* **React**: A powerful JavaScript library for building user interfaces.

* **Vite**: A next-generation frontend tooling that provides a fast development server and an optimized build process.

* **React Icons**: A collection of popular icon libraries for React projects.

* **React Markdown**: A component to render Markdown as React elements.

* **Remark GFM**: A plugin for `react-markdown` to support GitHub-Flavored Markdown.

* **UUID**: A library for generating universally unique identifiers.

* **ESLint**: A linter to identify and report on patterns in JavaScript code.

---

## 📂 How to Run Locally

To get this project running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/suresh-datt-joshi/ChatBot.git
    cd ChatBot


    ```

2.  **Install dependencies:**
    This project uses `npm` for package management.

    ```bash
    npm install


    ```

3.  **Configure Environment Variables:**
    The chatbot requires an API key for the Gemini API. Create a new file named `.env.local` in the root directory and add your key as shown below. This file is automatically ignored by Git for security.

    ```bash
    VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"


    ```

4.  **Start the development server:**
    Run the development script to start the application.

    ```bash
    npm run dev


    ```

    The application will open in your browser at `http://localhost:5173`.

---

## ✍️ Author

* **Suresh Datt Joshi** - [suresh-datt-joshi](https://github.com/suresh-datt-joshi)

---

## 📄 License

This project is licensed under the MIT License. 
