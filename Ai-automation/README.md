# AI Chatbot & Visual Flow Automation Module

This folder (`Ai-automation`) contains the modular, exportable AI and workflow automation services extracted from **Nexxlytic FlowX**. It can be integrated directly into any new Node.js/Express project to enable visual chatbot builders, auto-AI responses, and automated WhatsApp/Instagram/Facebook messaging.

---

## 📁 Directory Structure
```text
Ai-automation/
├── README.md                 # Setup and integration guide
├── integration_example.js    # Entry file demonstrating Express & Socket.io setup
├── config/
│   ├── db.js                 # Database connection pool setup (MySQL with Aiven/Avion SSL support)
│   └── logger.js             # Console/Winston logger utility (with fallback)
├── services/
│   ├── aiService.js          # Core AI reply engine (OpenAI & OpenRouter)
│   ├── flowEngine.js         # Visual flow step-by-step traversal engine
│   └── messagingService.js   # Meta Graph API sender (IG DM, FB, WA Cloud API)
└── routes/
    ├── ai.js                 # API endpoints for AI reply, caption & broadcast generation
    └── metaWebhook.js        # Webhook router for Meta events (auto-handles AI fallback)
```

---

## ⚙️ Dependencies
To run this module in your other projects, make sure to install the following npm packages:
```bash
npm install axios express uuid dotenv mysql2 cors helmet socket.io winston
```

---

## 🔑 Required Environment Variables
Configure these variables in your target project's `.env` file:
```env
# AI Configurations
OPENAI_API_KEY=sk-xxxx... or sk-or-xxxx... (for OpenRouter)

# Meta Integration Configurations
META_PAGE_ACCESS_TOKEN=your_instagram_or_facebook_page_token
IG_USER_ID=your_instagram_business_account_id
WA_ACCESS_TOKEN=your_whatsapp_business_cloud_api_token
WA_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WA_VERIFY_TOKEN=your_custom_webhook_verification_token

# DB configurations (used by config/db.js)
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name

# Cloud Databases Connection Setup (e.g. Aiven / Avion MySQL)
# Aiven MySQL requires SSL connection. Enable this by setting:
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

---

## 🗄️ Database Tables Schema (MySQL)
The engine relies on a database connection utility (`db.js`) to log transactions, capture inputs, and traverse flows. Below are the SQL table definitions required for these files to operate:

```sql
-- Clients (holds page tokens dynamically)
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  business_name VARCHAR(150),
  wa_phone_number_id VARCHAR(100),
  wa_access_token TEXT,
  ig_page_token TEXT,
  fb_page_token TEXT,
  fb_page_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts (users interacting with the chatbot)
CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(30),
  username VARCHAR(100),
  platform ENUM('whatsapp','instagram','facebook','telegram') NOT NULL,
  platform_id VARCHAR(200),
  tags JSON,
  custom_fields JSON,
  lead_status ENUM('cold','warm','hot','customer','lost') DEFAULT 'cold',
  notes TEXT,
  last_message_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  current_flow_id VARCHAR(36),
  current_node_id VARCHAR(50),
  expect_input VARCHAR(50),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Flows (stores the visual builder JSON graph structure)
CREATE TABLE IF NOT EXISTS flows (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  platform ENUM('whatsapp','instagram','facebook','all') DEFAULT 'whatsapp',
  trigger_type ENUM('keyword','new_subscriber','button_click','api') DEFAULT 'keyword',
  trigger_value VARCHAR(200),
  steps JSON NOT NULL, -- Contains nodes & edges
  is_active TINYINT(1) DEFAULT 1,
  total_triggered INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Keywords (fallback text matching)
CREATE TABLE IF NOT EXISTS keywords (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  keyword VARCHAR(200) NOT NULL,
  platform ENUM('whatsapp','instagram','facebook','all') DEFAULT 'all',
  reply_text TEXT,
  reply_type ENUM('text','flow') DEFAULT 'text',
  flow_id VARCHAR(36),
  match_type ENUM('exact','contains','starts_with') DEFAULT 'contains',
  is_active TINYINT(1) DEFAULT 1,
  hit_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  post_id VARCHAR(100),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Messages (historical records, used by AI context mapping)
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  contact_id VARCHAR(36),
  direction ENUM('inbound','outbound') NOT NULL,
  platform ENUM('whatsapp','instagram','facebook') NOT NULL,
  message_type ENUM('text','image','video','audio','document','button','list') DEFAULT 'text',
  content TEXT,
  media_url TEXT,
  status ENUM('sent','delivered','read','failed') DEFAULT 'sent',
  wa_message_id VARCHAR(200),
  is_ai_reply TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
);
```

---

## 🚀 How to Run and Integrate
To launch this module standalone or review how it operates:

1. Copy the `Ai-automation` folder into your target project.
2. Review **[integration_example.js](file:///c:/Users/Hridoy/Desktop/nexxlytic-flowx%201/nexxlytic-flowx/Ai-automation/integration_example.js)** to see the setup step-by-step.
3. Configure the environment variables (`.env`) and database tables.
4. Execute `node integration_example.js` to start.
