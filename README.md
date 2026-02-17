# Vineyard Progress Tracker

A secure web application to track progress on vineyard work with AI-powered automatic row detection.

## Features

- Upload satellite imagery of your vineyard
- **🤖 AI-powered automatic row detection** using OpenAI Vision API
- Manual row marking for fine-tuning
- Create multiple progress tasks (pruning, harvesting, etc.)
- Select completed rows/plants
- View real-time progress percentages
- All data stored locally in your browser
- **🔒 Secure**: API keys stored as environment variables on the server

## Architecture

This application uses a secure client-server architecture:

- **Frontend**: HTML/CSS/JavaScript (runs in browser)
- **Backend**: Node.js + Express (handles API requests)
- **Container**: Docker + docker-compose for easy deployment
- **Security**: OpenAI API key stored as environment variable on server

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vineyard-tracker
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env and add your OpenAI API key**
   ```bash
   OPENAI_API_KEY=sk-your-api-key-here
   PORT=3000
   NODE_ENV=production
   ```

4. **Start the application**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   
   Open your browser to: http://localhost:3000

### Stop the application

```bash
docker-compose down
```

## Local Development (without Docker)

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   
   Open your browser to: http://localhost:3000

## Usage

1. **Upload Image**: Click "Upload Satellite Image" to add your vineyard image
2. **AI Detection**: 
   - Click "Auto-Detect Rows with AI" 
   - Wait for automatic detection (10-30 seconds)
   - Manually adjust any rows if needed
3. **Manual Marking** (Alternative):
   - Click "Add Row Markers" mode
   - Click on the image to place row markers
4. **Create Task**: Add a new task with a name
5. **Track Progress**: Click on rows in a task to mark them as complete
6. **View Progress**: See real-time percentage completion for each task

## API Endpoints

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Vineyard Tracker API is running"
}
```

### POST /api/detect-rows

Detects vineyard rows in an image using AI.

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "choices": [{
    "message": {
      "content": "[{\"x\": 50.0, \"y\": 10.5}, ...]"
    }
  }]
}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | production | Node environment |

## Security

- ✅ API keys stored as environment variables (never in browser)
- ✅ Backend proxy prevents exposing API keys to client
- ✅ Docker containerization for isolated environment
- ✅ Health checks for monitoring
- ✅ No sensitive data in version control

**Best Practices:**
- Use a restricted OpenAI API key with spending limits
- Keep your .env file secure and never commit it
- Use environment-specific .env files for different deployments
- Regularly update dependencies for security patches

## Docker Commands

```bash
# Build the image
docker-compose build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## Troubleshooting

### "OpenAI API key not configured"

Make sure your `.env` file exists and contains:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

Then restart the container:
```bash
docker-compose down
docker-compose up -d
```

### Port already in use

Change the port in `.env` or `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Container won't start

Check logs:
```bash
docker-compose logs
```

## Technologies

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **AI**: OpenAI GPT-4 Vision API (gpt-4o)
- **Container**: Docker, docker-compose
- **Storage**: LocalStorage for UI state

## License

MIT
