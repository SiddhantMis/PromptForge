// Switch to admin database to authenticate
db = db.getSiblingDB('admin');

// Create application user for promptforge_db
db = db.getSiblingDB('promptforge_db');

db.createUser({
  user: 'promptforge',
  pwd: 'dev_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'promptforge_db'
    }
  ]
});

// Create collections
db.createCollection('prompt_versions');
db.createCollection('test_results');
db.createCollection('analytics_events');

// Create indexes
db.prompt_versions.createIndex({ "promptId": 1, "version": 1 }, { unique: true });
db.prompt_versions.createIndex({ "promptId": 1, "createdAt": -1 });
db.test_results.createIndex({ "promptId": 1, "createdAt": -1 });
db.analytics_events.createIndex({ "eventType": 1, "timestamp": -1 });

print('MongoDB initialization completed successfully');