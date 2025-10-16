// Switch to promptforge database
db = db.getSiblingDB('promptforge_db');

// Create collections
db.createCollection('prompt_versions');
db.createCollection('prompt_contents');
db.createCollection('test_results');

// Create indexes
db.prompt_versions.createIndex({ "promptId": 1, "version": 1 }, { unique: true });
db.prompt_versions.createIndex({ "createdAt": -1 });
db.prompt_contents.createIndex({ "versionId": 1 });
db.test_results.createIndex({ "promptId": 1, "timestamp": -1 });

print('MongoDB initialization complete');
