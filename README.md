# 🛫 PostPilot

**PostPilot** is an AI-powered autoposting agent that writes, designs, and publishes content automatically across platforms like X and LinkedIn. It helps creators, founders, and developers consistently build in public—without manual effort.

---

## 🚀 Features

- ✍️ **AI-Generated Content**: powered by LLMs.
- 🧠 **Audience-Aware Writing**: Posts adjust tone, length, and call-to-actions based on your selected audience and platform.
- 🎨 **Custom Image Generation**: Automatically creates context-aware visuals using AI image tools (like DALL·E).
- 🧩 **Modular Agent Architecture**: Built with [Inngest](https://www.inngest.com/) for event-driven, scalable automation.
- 📊 **Post Scheduling and Analytics** (coming soon)
- ⏱️ **Autopilot Mode**:  (coming soon)

---

## 🧩 Architecture Overview

PostPilot uses a modular, event-driven architecture built with Inngest, making it scalable, maintainable, and efficient for handling content workflows.

```
                        +-------------------+
                        |   Frontend UI     |
                        |  (Create Request) |
                        +--------+----------+
                                 |
                                 v
                         +-------+--------+
                         |   Express API   |
                         |  (/create-post) |
                         +-------+--------+
                                 |
                                 v
                    +------------+------------+
                    |   Inngest Triggered     |
                    |     Event System        |
                    +------------+------------+
                                 |
        +------------------------+------------------------+
        |                        |                        |
        v                        v                        v
+---------------+      +----------------+       +------------------+
| PostWriter 🧠  |      | Imagey 🎨       |       | Scheduler ⏱️     |
| - Generates   |      | - Creates AI    |       | - Sets publish   |
|   content     |      |   visuals       |       |   times / delay  |
+---------------+      +----------------+       +------------------+

                                 |
                                 v
                      +----------+----------+
                      | MongoDB (Post Model)|
                      +---------------------+

```

### 🔁 Flow Summary

1. User submits a topic, tone, and platform list.
2. API sends an event to Inngest.
3. `PostWriter` creates platform-optimized post text.
4. `Imagey` generates a visual based on prompt.
5. `Scheduler` either sets a delay or publishes immediately.
6. Data is saved and accessible via dashboard or API.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Event System**: Inngest
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (access + refresh tokens)
- **AI**: OpenAI (GPT + DALL·E)
- **Frontend**: (Coming Soon)

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/PostPilot.git
cd PostPilot
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

---

## ▶️ Quick Usage

```json
POST /api/create-post
{
  "topic": "API Gateway in Microservices",
  "tone": "technical",
  "audience": "backend developers",
  "platforms": ["X", "LinkedIn"]
}
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to GitHub (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License © 2025 [Shrey Vats](https://github.com/shreyvats-dev)
