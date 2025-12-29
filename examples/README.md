# Examples

This directory contains example configurations for spec-snake.

## Directory Structure

```
examples/
├── local/     # Local development examples
└── docker/    # Docker deployment examples
```

## Local Examples

The `local/` directory contains configuration files that can be used directly with the `spec-snake start` command.

### Files

- `spec-snake.config.ts` - English configuration example
- `spec-snake-ja.config.ts` - Japanese configuration example

### Usage

```bash
# Install spec-snake
npm install spec-snake
# or
pnpm add spec-snake
# or
yarn add spec-snake
```

## Docker Examples

The `docker/` directory contains a complete Docker setup for running spec-snake in a container.

### Files

- `Dockerfile` - Container image definition
- `docker-compose.yml` - Docker Compose configuration
- `package.json` - Dependencies
- `spec-snake.config.ts` - Configuration file
- `.env` - Environment variables (create this file)
- `.dockerignore` - Files to exclude from the build

### Usage

1. Navigate to the docker directory:

```bash
cd examples/docker
```

2. Create a `.env` file with your API key:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

3. Start with Docker Compose:

```bash
docker compose up --build
```

4. Access the application at http://localhost:3000

### Customization

To customize the scenario, edit `spec-snake.config.ts` in the docker directory and rebuild the container.
