-- Create separate databases for each service
CREATE DATABASE user_service_db;
CREATE DATABASE prompt_service_db;
CREATE DATABASE test_service_db;
CREATE DATABASE marketplace_service_db;
CREATE DATABASE analytics_service_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE user_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE prompt_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE test_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE marketplace_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE analytics_service_db TO promptforge;
