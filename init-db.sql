-- PromptForge Database Initialization
-- Creates all required databases

CREATE DATABASE IF NOT EXISTS user_service_db;
CREATE DATABASE IF NOT EXISTS prompt_service_db;
CREATE DATABASE IF NOT EXISTS test_service_db;
CREATE DATABASE IF NOT EXISTS marketplace_service_db;
CREATE DATABASE IF NOT EXISTS analytics_service_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE user_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE prompt_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE test_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE marketplace_service_db TO promptforge;
GRANT ALL PRIVILEGES ON DATABASE analytics_service_db TO promptforge;