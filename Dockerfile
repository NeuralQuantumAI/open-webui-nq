# syntax=docker/dockerfile:1
# VibeCaaS UI - Production-Ready Multi-Stage Docker Build
# Optimized for deployment with security best practices

# Build arguments with sensible defaults
ARG USE_CUDA=false
ARG USE_OLLAMA=false
ARG USE_CUDA_VER=cu128
ARG USE_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
ARG USE_RERANKING_MODEL=""
ARG USE_TIKTOKEN_ENCODING_NAME="cl100k_base"
ARG BUILD_HASH=dev-build

# Security: Use non-root user by default
ARG UID=1001
ARG GID=1001
ARG USERNAME=vibecaas

######## VibeCaaS UI frontend build ########
FROM --platform=$BUILDPLATFORM node:22-alpine3.20 AS frontend-build
ARG BUILD_HASH

# Security: Create non-root user for build
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vibecaas -u 1001 -G nodejs

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy package files and install dependencies
COPY --chown=vibecaas:nodejs package.json package-lock.json ./
RUN npm ci --only=production --no-audit --no-fund

# Copy source code
COPY --chown=vibecaas:nodejs . .

# Set build environment
ENV NODE_ENV=production
ENV APP_BUILD_HASH=${BUILD_HASH}

# Build the application
USER vibecaas
RUN npm run build

######## WebUI backend ########
FROM python:3.11-slim-bookworm AS backend

# Use args
ARG USE_CUDA
ARG USE_OLLAMA
ARG USE_CUDA_VER
ARG USE_EMBEDDING_MODEL
ARG USE_RERANKING_MODEL
ARG UID
ARG GID
ARG USERNAME

# Set environment variables
ENV ENV=prod \
    PORT=8080 \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    # pass build args to the build
    USE_OLLAMA_DOCKER=${USE_OLLAMA} \
    USE_CUDA_DOCKER=${USE_CUDA} \
    USE_CUDA_DOCKER_VER=${USE_CUDA_VER} \
    USE_EMBEDDING_MODEL_DOCKER=${USE_EMBEDDING_MODEL} \
    USE_RERANKING_MODEL_DOCKER=${USE_RERANKING_MODEL}

## Basis URL Config ##
ENV OLLAMA_BASE_URL="/ollama" \
    OPENAI_API_BASE_URL=""

## API Key and Security Config ##
ENV OPENAI_API_KEY="" \
    WEBUI_SECRET_KEY="" \
    SCARF_NO_ANALYTICS=true \
    DO_NOT_TRACK=true \
    ANONYMIZED_TELEMETRY=false

#### Other models #########################################################
## whisper TTS model settings ##
ENV WHISPER_MODEL="base" \
    WHISPER_MODEL_DIR="/app/backend/data/cache/whisper/models"

## RAG Embedding model settings ##
ENV RAG_EMBEDDING_MODEL="$USE_EMBEDDING_MODEL_DOCKER" \
    RAG_RERANKING_MODEL="$USE_RERANKING_MODEL_DOCKER" \
    SENTENCE_TRANSFORMERS_HOME="/app/backend/data/cache/embedding/models"

## Tiktoken model settings ##
ENV TIKTOKEN_ENCODING_NAME="cl100k_base" \
    TIKTOKEN_CACHE_DIR="/app/backend/data/cache/tiktoken"

## Hugging Face download cache ##
ENV HF_HOME="/app/backend/data/cache/embedding/models"

#### Other models ##########################################################

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    build-essential \
    pandoc \
    netcat-openbsd \
    curl \
    jq \
    gcc \
    python3-dev \
    ffmpeg \
    libsm6 \
    libxext6 \
    dumb-init && \
    rm -rf /var/lib/apt/lists/*

# Install Ollama if requested
RUN if [ "$USE_OLLAMA" = "true" ]; then \
    curl -fsSL https://ollama.com/install.sh | sh; \
    fi

# Create non-root user
RUN groupadd -g ${GID} ${USERNAME} && \
    useradd -r -u ${UID} -g ${GID} -d /app -s /bin/bash ${USERNAME}

# Set working directory
WORKDIR /app/backend

# Create necessary directories and set permissions
RUN mkdir -p /app/backend/data/cache/whisper/models \
    /app/backend/data/cache/embedding/models \
    /app/backend/data/cache/tiktoken \
    /home/${USERNAME}/.cache/chroma && \
    echo -n 00000000-0000-0000-0000-000000000000 > /home/${USERNAME}/.cache/chroma/telemetry_user_id && \
    chown -R ${UID}:${GID} /app /home/${USERNAME}

# Install Python dependencies
COPY --chown=${USERNAME}:${USERNAME} ./backend/requirements.txt ./requirements.txt

# Install Python package manager and dependencies
RUN pip3 install --no-cache-dir uv

# Install PyTorch and Python dependencies based on CUDA support
RUN if [ "$USE_CUDA" = "true" ]; then \
    pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/$USE_CUDA_DOCKER_VER --no-cache-dir; \
    else \
    pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu --no-cache-dir; \
    fi

# Install Python requirements
RUN uv pip install --system -r requirements.txt --no-cache-dir

# Pre-download models for faster startup
RUN python -c "import os; from sentence_transformers import SentenceTransformer; SentenceTransformer(os.environ['RAG_EMBEDDING_MODEL'], device='cpu')" && \
    python -c "import os; from faster_whisper import WhisperModel; WhisperModel(os.environ['WHISPER_MODEL'], device='cpu', compute_type='int8', download_root=os.environ['WHISPER_MODEL_DIR'])" && \
    python -c "import os; import tiktoken; tiktoken.get_encoding(os.environ['TIKTOKEN_ENCODING_NAME'])"

# Copy application files
COPY --chown=${USERNAME}:${USERNAME} ./backend .

# Copy frontend build from frontend-build stage
COPY --chown=${USERNAME}:${USERNAME} --from=frontend-build /app/build /app/build
COPY --chown=${USERNAME}:${USERNAME} --from=frontend-build /app/CHANGELOG.md /app/CHANGELOG.md
COPY --chown=${USERNAME}:${USERNAME} --from=frontend-build /app/package.json /app/package.json

# Set proper permissions
RUN chown -R ${USERNAME}:${USERNAME} /app/backend/data/

# Expose port
EXPOSE 8080

# Add comprehensive health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl --silent --fail http://localhost:${PORT:-8080}/health | jq -ne 'input.status == true' || exit 1

# Switch to non-root user
USER ${USERNAME}

# Set build metadata
ARG BUILD_HASH
ENV WEBUI_BUILD_VERSION=${BUILD_HASH}
ENV DOCKER=true

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["bash", "start.sh"]
