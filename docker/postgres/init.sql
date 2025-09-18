-- VibeCaaS UI Database Initialization
-- This file is executed when the PostgreSQL container starts for the first time

-- Create the main database (already created by POSTGRES_DB)
-- Additional initialization can be added here

-- Set timezone
SET timezone = 'UTC';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create any additional schemas or tables as needed
-- The application will handle its own table creation through migrations