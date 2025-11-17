# TalkMate Bot

A modern chatbot application built with React, Vite, and the Gemini API, designed to deliver engaging and intelligent conversational experiences.

<details>
<summary><b>View More Screenshots</b></summary>
<br>
<p align="center">
<img width="1899" height="917" alt="Screenshot 2025-11-17 105009" src="https://github.com/user-attachments/assets/b606c85a-838a-47e7-953f-536c26e3b275" />

<br><br>
<img width="1895" height="917" alt="Screenshot 2025-11-17 105057" src="https://github.com/user-attachments/assets/b21ce818-0ac6-4c01-b595-5309380fef11" />

<br><br>
<img width="1900" height="917" alt="Screenshot 2025-11-17 105108" src="https://github.com/user-attachments/assets/c6a94384-8e72-48df-a767-153fba3ace21" />

</p>
</details>

---

## 🚀 Live Demo

**[View the live application here!](https://chat-bot-mu-red.vercel.app)**

---

## ✨ Features

* **Interactive Chat UI**: Clean, responsive interface with smooth animations
* **Dual API Integration**: Gemini API (primary) with OpenAI fallback and automatic retry logic
* **Rich Text Support**: Full Markdown rendering with GitHub Flavored Markdown
* **Voice Input**: Browser-based speech recognition for voice commands
* **Text-to-Speech**: Automatic speech synthesis for bot responses with mute toggle
* **Multiple Chat Management**: Create, pin, rename, search, and delete conversations
* **Smart Features**: Auto-generated titles, message previews, copy-to-clipboard
* **Responsive Design**: Collapsible sidebar, mobile-friendly layout

---

## 🛠️ Technologies Used

* **React** - UI library
* **Vite** - Build tool and dev server
* **React Icons** - Icon library
* **React Markdown** - Markdown rendering
* **Remark GFM** - GitHub Flavored Markdown support
* **UUID** - Unique identifier generation
* **ESLint** - Code linting
* **Gemini API** - Primary AI integration
* **OpenAI API** - Fallback AI integration

---

## 📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/suresh-datt-joshi/ChatBot.git
   cd ChatBot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env.local` file in the root directory:

   ```bash
   VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
   VITE_OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"  # Optional
   ```

   Get your API keys:
   - **Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will open at `http://localhost:5173`.

---

## 🎮 Available Scripts

* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run preview` - Preview production build
* `npm run lint` - Run ESLint

---

## 💻 Usage

* **New Chat**: Click "New Chat" button in the sidebar
* **Send Message**: Type and press `Enter` (or `Shift+Enter` for new line)
* **Voice Input**: Click microphone icon to record
* **Manage Chats**: Use the three-dot menu (⋮) to pin, rename, share, or delete chats
* **Search**: Use the search bar to find chats by title or content
* **Mute/Unmute**: Click volume icon to toggle text-to-speech

---

## 🐛 Troubleshooting

* **API Key Issues**: Ensure `.env.local` is in root directory and restart dev server
* **Voice Recognition**: Use Chrome, Edge, or Safari and allow microphone permissions
* **Build Errors**: Clear `node_modules` and reinstall dependencies

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Suresh Datt Joshi** - [suresh-datt-joshi](https://github.com/suresh-datt-joshi)
