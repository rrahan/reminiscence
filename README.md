<h1 align="center">reminiscence</h1>

<p align="center">
  <img src="https://github.com/user-attachments/assets/087bde6b-e49e-4f71-880e-e9736c4de65c" alt="reminiscence" width="800" />
</p>


<p align="center">
  <strong>A state-serialization protocol for portable context.</strong><br/>
  
</p>



<p align="center">
  <img src="https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="Apache 2.0" />
</p>

---

## What is reminiscence?

LLM conversations are trapped inside vendor platforms. When you switch models or want to continue a conversation elsewhere, the context is lost.

**Reminiscence** solves this by acting as a universal context bridge:

1. Paste a shared conversation URL from a supported platform
2. The server scrapes and parses the conversation into a normalized format
3. The parsed messages are converted to a portable Markdown transcript
4. The Markdown is uploaded to a temporary file host and a shareable URL is returned
5. Paste that URL into **any** LLM to resume the conversation with full context



---

## Supported Platforms

| Platform | Status 
|----------|--------
| **ChatGPT** (chatgpt.com) | ⚠️ Unsupported | 
| **Claude** (claude.ai) | ✅ Supported | 
| **Grok** (grok.com) | ✅ Supported | 
| **Scira** (scira.ai) | ✅ Supported |
| **V0** (v0.dev) | ✅ Supported |
| **Gemini** (gemini.google.com) | 🚧 Planned |
| **Perplexity** (perplexity.ai) | ⛔ Blocked |

---



## Project Structure

```
reminiscence/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Fonts, icons, images
│   │   ├── components/
│   │   │   └── ui/             # shadcn components + custom UI
│   │   │       ├── bg-card.jsx            # Main URL input card
│   │   │       ├── pixel-heading-character.jsx  # Animated heading
│   │   │       ├── button.jsx / card.jsx / dialog.jsx / ...
│   │   │       └── ...                    # shadcn primitives
│   │   ├── lib/                # Utility functions (cn)
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles & font faces
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── app.js              # Express app entry point
│   │   ├── routes/
│   │   │   ├── index.js        # Route aggregator
│   │   │   ├── serialize.route.js
│   │   │   └── purge.route.js
│   │   ├── controllers/
│   │   │   ├── serialize.controller.js
│   │   │   └── purge.controller.js
│   │   ├── services/
│   │   │   ├── parseContext.js  # Platform-specific parsers
│   │   │   └── uploadMD.js     # lmfiles.com upload logic
│   │   ├── middleware/
│   │   │   └── validateUrl.js  # URL validation middleware
│   │   └── utils/
│   │       └── createMarkDown.js  # JSON → Markdown converter
│   └── package.json
│
├── .gitignore
├── LICENSE                     # Apache 2.0
├── README.md
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (ships with Node)
- An [lmfiles.com](https://lmfiles.com) API key for file uploads

### Installation

```bash
# Clone the repository
git clone https://github.com/rrahan/reminiscence.git
cd reminiscence

# Install  dependencies
npm install
```

### Environment Variables

Create a `.env` file inside the `server/` directory:

```env
LMF_API_KEY=your_lmfiles_api_key_here
PORT=5000
```

> [!NOTE]
> Register for an API key at [lmfiles.com](https://lmfiles.com/api/v1/accounts/register) by sending a POST request with your desired username.

### Running Locally

Start both the client and server in terminal:

```bash
cd reminiscence
npm run reminiscence

```

---



## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

