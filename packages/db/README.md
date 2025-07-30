# Database Package

This package manages database containers for the Osano Clone project.

## Setup

1. Copy `.env.example` to `.env` and adjust values if needed
2. Choose your database:
   - **Development (MongoDB)**: `pnpm run dev` or `pnpm run mongo`
   - **Production (PostgreSQL)**: `pnpm run prod` or `pnpm run postgres`

## Available Commands

- `pnpm run dev` - Start MongoDB for development
- `pnpm run prod` - Start PostgreSQL for production
- `pnpm run stop` - Stop all containers
- `pnpm run clean` - Stop and remove all data
- `pnpm run logs` - View container logs

## Connection URLs

- **MongoDB**: `mongodb://admin:password@localhost:27017/osano-clone?authSource=admin`
- **PostgreSQL**: `postgresql://admin:password@localhost:5432/osano-clone`

## Docker Compose Profiles

The setup uses Docker Compose profiles to separate environments:
- `mongo` profile for development
- `postgres` profile for production