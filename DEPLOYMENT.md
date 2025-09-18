# VibeCaaS UI - Production Deployment Guide

This guide covers deploying VibeCaaS UI using Docker containers with production-ready configurations.

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- At least 4GB RAM (8GB+ recommended for AI workloads)
- 20GB+ free disk space
- Linux/macOS/Windows with WSL2

### 1. Clone and Configure

```bash
git clone <repository-url>
cd vibecaas-ui
cp .env.production .env
```

### 2. Configure Environment

Edit `.env` file with your settings:

```bash
# Required: Database passwords
POSTGRES_PASSWORD=your_secure_postgres_password
REDIS_PASSWORD=your_secure_redis_password

# Required: WebUI secret key (generate with: openssl rand -base64 32)
WEBUI_SECRET_KEY=your_generated_secret_key

# Optional: OpenAI API key
OPENAI_API_KEY=your_openai_api_key

# Optional: GPU support
USE_CUDA=true
USE_CUDA_VER=cu128
```

### 3. Deploy

```bash
# Make deployment script executable
chmod +x docker/deploy.sh

# Deploy the application
./docker/deploy.sh deploy
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Ollama**: http://localhost:11434

## 📋 Architecture

The deployment includes the following services:

### Core Services
- **Frontend**: Nginx serving the SvelteKit application
- **Backend**: Python FastAPI application with AI/ML capabilities
- **Database**: PostgreSQL for persistent data storage
- **Cache**: Redis for session and cache management
- **AI Engine**: Ollama for local AI model inference

### Optional Services
- **Monitoring**: Prometheus + Grafana for metrics and dashboards
- **Logging**: ELK stack (Elasticsearch, Logstash, Kibana)
- **Reverse Proxy**: Nginx for load balancing and SSL termination

## 🔧 Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_PASSWORD` | - | PostgreSQL database password |
| `REDIS_PASSWORD` | - | Redis cache password |
| `WEBUI_SECRET_KEY` | - | Secret key for JWT tokens |
| `OPENAI_API_KEY` | - | OpenAI API key for external models |
| `USE_CUDA` | false | Enable CUDA for GPU acceleration |
| `USE_OLLAMA` | true | Enable local Ollama AI models |
| `UVICORN_WORKERS` | 2 | Number of backend worker processes |

### Docker Compose Files

- `docker-compose.prod.yaml` - Production deployment
- `docker-compose.monitoring.yaml` - Monitoring stack
- `docker-compose.dev.yaml` - Development environment

## 🛠️ Management Commands

### Using the Deployment Script

```bash
# Deploy the application
./docker/deploy.sh deploy

# Stop all services
./docker/deploy.sh stop

# Restart services
./docker/deploy.sh restart

# View logs
./docker/deploy.sh logs [service_name]

# Check status
./docker/deploy.sh status

# Create database backup
./docker/deploy.sh backup
```

### Using Docker Compose Directly

```bash
# Start services
docker-compose -f docker-compose.prod.yaml up -d

# Stop services
docker-compose -f docker-compose.prod.yaml down

# View logs
docker-compose -f docker-compose.prod.yaml logs -f

# Scale backend workers
docker-compose -f docker-compose.prod.yaml up -d --scale backend=3
```

## 📊 Monitoring

### Enable Monitoring Stack

```bash
# Start monitoring services
docker-compose -f docker-compose.monitoring.yaml up -d

# Access monitoring dashboards
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
# Kibana: http://localhost:5601
```

### Key Metrics

- **System**: CPU, Memory, Disk usage
- **Application**: Request rate, Response time, Error rate
- **Database**: Connection pool, Query performance
- **AI Models**: Inference time, Model loading

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change default passwords
- [ ] Generate secure secret keys
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure firewall rules
- [ ] Set up log monitoring
- [ ] Enable database encryption
- [ ] Regular security updates

### SSL/TLS Configuration

1. Place SSL certificates in `docker/ssl/`:
   - `cert.pem` - Certificate file
   - `key.pem` - Private key file

2. Uncomment HTTPS server block in `docker/nginx/nginx.conf`

3. Update environment variables:
   ```bash
   SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
   SSL_KEY_PATH=/etc/nginx/ssl/key.pem
   ```

## 🚨 Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check service status
docker-compose -f docker-compose.prod.yaml ps

# View detailed logs
docker-compose -f docker-compose.prod.yaml logs [service_name]

# Check resource usage
docker stats
```

#### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yaml logs postgres

# Test database connection
docker-compose -f docker-compose.prod.yaml exec postgres psql -U vibecaas -d vibecaas
```

#### AI Model Loading Issues
```bash
# Check Ollama status
docker-compose -f docker-compose.prod.yaml logs ollama

# Test Ollama API
curl http://localhost:11434/api/tags
```

### Performance Optimization

#### Backend Scaling
```bash
# Scale backend workers
docker-compose -f docker-compose.prod.yaml up -d --scale backend=4

# Scale frontend instances
docker-compose -f docker-compose.prod.yaml up -d --scale frontend=2
```

#### Database Optimization
- Increase PostgreSQL shared_buffers
- Configure connection pooling
- Set up read replicas for heavy read workloads

#### Caching Strategy
- Configure Redis memory limits
- Implement application-level caching
- Use CDN for static assets

## 📈 Scaling

### Horizontal Scaling

1. **Load Balancer**: Use external load balancer (HAProxy, NGINX)
2. **Database**: Set up PostgreSQL read replicas
3. **Cache**: Use Redis Cluster for distributed caching
4. **Storage**: Use shared storage (NFS, Ceph) for model files

### Vertical Scaling

1. **CPU**: Increase worker processes
2. **Memory**: Allocate more RAM for AI models
3. **GPU**: Use multiple GPUs for parallel inference

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup
./docker/deploy.sh backup

# Restore from backup
docker-compose -f docker-compose.prod.yaml exec postgres psql -U vibecaas -d vibecaas < backup_file.sql
```

### Full System Backup
```bash
# Backup all volumes
docker run --rm -v vibecaas_postgres_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
docker run --rm -v vibecaas_redis_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/redis_backup.tar.gz -C /data .
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Ollama Documentation](https://ollama.ai/docs)

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review application logs
3. Check system resources
4. Open an issue on GitHub

---

**Note**: This deployment configuration is optimized for production use. For development, use the development docker-compose file with hot-reload enabled.