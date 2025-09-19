# Open WebUI - Neural Quantum AI Fork

A user-friendly AI interface that supports Ollama, OpenAI API, and more. This is a fork of the original [Open WebUI](https://github.com/open-webui/open-webui) project, enhanced by Neural Quantum AI.

Visit [openwebui.com](https://openwebui.com) for more information.

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Pull the latest image
docker pull neuralquantum/open-webui-nq:latest

# Run with default settings
docker run -d --name open-webui-nq -p 3000:8080 -e DOCKER=true -v open-webui-nq:/app/backend/data neuralquantum/open-webui-nq:latest
```

### Using Docker Compose

```bash
# Start with default configuration
docker compose up -d

# Customize port and tag
PORT=8080 TAG=latest docker compose up -d

# Build and start
docker compose up -d --build
```

## 🌟 Features

- **Multi-Model Support**: Works with Ollama, OpenAI API, and other AI providers
- **User-Friendly Interface**: Clean, intuitive design for easy AI interaction
- **Local & Cloud Models**: Run models locally with Ollama or use cloud APIs
- **Chat Management**: Organize conversations with folders and tags
- **File Upload**: Support for various file types and document processing
- **Custom Prompts**: Create and manage custom prompt templates
- **User Management**: Multi-user support with authentication
- **API Integration**: RESTful API for external integrations
- **Docker Support**: Easy deployment with Docker containers
- **Cross-Platform**: Web interface accessible from any device

## 🛠️ Installation

### Prerequisites

- Docker and Docker Compose (recommended)
- Or Python 3.8+ for manual installation
- Ollama (for local model support)

### Docker Installation

```bash
# Clone the repository
git clone https://github.com/NeuralQuantumAI/open-webui-nq.git
cd open-webui-nq

# Run with Docker Compose
docker compose up -d

# Or run directly with Docker
docker run -d --name open-webui-nq -p 3000:8080 -v open-webui-nq:/app/backend/data neuralquantum/open-webui-nq:latest
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/NeuralQuantumAI/open-webui-nq.git
cd open-webui-nq

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Start the backend
python main.py

# In another terminal, install frontend dependencies
cd ../src
npm install

# Start the frontend development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database
DATABASE_URL=sqlite:///./data/webui.db

# Authentication
SECRET_KEY=your-secret-key-here

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434

# OpenAI Configuration (optional)
OPENAI_API_KEY=your-openai-api-key

# Other AI Providers
ANTHROPIC_API_KEY=your-anthropic-key
COHERE_API_KEY=your-cohere-key
```

### Docker Environment

```bash
# Set environment variables for Docker
docker run -d \
  --name open-webui-nq \
  -p 3000:8080 \
  -e SECRET_KEY=your-secret-key \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  -v open-webui-nq:/app/backend/data \
  neuralquantum/open-webui-nq:latest
```

## 📱 Usage

### Accessing the Interface

1. Open your web browser
2. Navigate to `http://localhost:3000` (or your configured port)
3. Create an account or log in
4. Start chatting with AI models

### Adding Models

#### Ollama Models
```bash
# Pull a model
ollama pull llama2

# The model will automatically appear in the interface
```

#### API Models
1. Go to Settings → Models
2. Add your API key for the provider
3. Select the model from the dropdown
4. Start using it in your chats

### Features

- **Chat Interface**: Clean, modern chat interface
- **Model Management**: Easy switching between different AI models
- **File Upload**: Upload documents for AI analysis
- **Custom Prompts**: Create reusable prompt templates
- **User Management**: Multi-user support with role-based access
- **API Access**: RESTful API for external integrations

## 🛠️ Development

### Setting up Development Environment

```bash
# Clone the repository
git clone https://github.com/NeuralQuantumAI/open-webui-nq.git
cd open-webui-nq

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../src
npm install

# Start development servers
# Terminal 1: Backend
cd backend && python main.py

# Terminal 2: Frontend
cd src && npm run dev
```

### Project Structure

```
open-webui-nq/
├── backend/                 # Python FastAPI backend
│   ├── open_webui/         # Main application code
│   │   ├── models/         # Database models
│   │   ├── routers/        # API routes
│   │   ├── utils/          # Utility functions
│   │   └── main.py         # FastAPI application
│   └── requirements.txt    # Python dependencies
├── src/                    # SvelteKit frontend
│   ├── lib/               # Reusable components
│   ├── routes/            # Page routes
│   └── app.html           # Main HTML template
├── docker-compose.yaml    # Docker configuration
├── Dockerfile            # Docker image definition
└── README.md             # This file
```

### API Documentation

The backend provides a RESTful API. When running locally, visit:
- API Documentation: `http://localhost:8080/docs`
- Alternative docs: `http://localhost:8080/redoc`

### Testing

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd src
npm test
```

## 🔒 Security

- User authentication and authorization
- API key management for AI providers
- Secure file upload handling
- HTTPS support for production deployments
- Regular security updates and patches

## 📈 Performance

- Fast and responsive web interface
- Efficient model switching
- Optimized API calls
- Caching for improved performance
- Docker containerization for easy scaling

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Original Open WebUI**: [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
- **Website**: [https://openwebui.com](https://openwebui.com)
- **Documentation**: [https://docs.openwebui.com](https://docs.openwebui.com)

## 🚨 Troubleshooting

### Common Issues

**Can't connect to Ollama?**
- Ensure Ollama is running: `ollama serve`
- Check the OLLAMA_BASE_URL in your configuration
- Verify firewall settings allow connections

**Models not appearing?**
- Check if Ollama is running and models are pulled
- Verify API keys for external providers
- Check the logs for error messages

**Docker issues?**
- Ensure Docker is running
- Check port availability (3000, 8080)
- Verify volume permissions

### Getting Help

1. Check the [troubleshooting guide](https://docs.openwebui.com/troubleshooting)
2. Search existing [GitHub Issues](https://github.com/NeuralQuantumAI/open-webui-nq/issues)
3. Create a new issue with detailed information
4. Join the community discussions

## 📞 Support

For support and questions:

- **GitHub Issues**: [https://github.com/NeuralQuantumAI/open-webui-nq/issues](https://github.com/NeuralQuantumAI/open-webui-nq/issues)
- **Documentation**: [https://docs.openwebui.com](https://docs.openwebui.com)
- **Community**: [Open WebUI Discord](https://discord.gg/openwebui)

---

**Built with ❤️ by Neural Quantum AI**

A powerful, user-friendly AI interface for everyone! 🚀