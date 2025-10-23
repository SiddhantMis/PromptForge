# PromptForge - Database Schema

##  Database Overview

Total Databases: **6**
- 5 PostgreSQL databases (one per service)
- 1 MongoDB database (versioning)

---

## 1 User Service Database (PostgreSQL)

### Table: users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (bcrypt hashed) |
| first_name | VARCHAR(50) | |
| last_name | VARCHAR(50) | |
| role | VARCHAR(20) | DEFAULT 'USER' |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | |

**Indexes:**
- username (UNIQUE)
- email (UNIQUE)

---

### Table: user_follows
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| follower_id | UUID | NOT NULL |
| following_id | UUID | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

**Unique Constraint:** (follower_id, following_id)
**Indexes:**
- follower_id
- following_id

**Relationships:**
- follower_id  users(id)
- following_id  users(id)

---

## 2 Prompt Service Database (PostgreSQL)

### Table: prompts
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| title | VARCHAR(200) | NOT NULL |
| content | TEXT | NOT NULL |
| description | TEXT | |
| category | VARCHAR(50) | |
| user_id | UUID | NOT NULL |
| is_public | BOOLEAN | DEFAULT true |
| version | INTEGER | DEFAULT 1 |
| likes_count | INTEGER | DEFAULT 0 |
| comments_count | INTEGER | DEFAULT 0 |
| rating_avg | DECIMAL(3,2) | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | |

**Indexes:**
- user_id
- category
- is_public
- created_at (DESC)

---

### Table: prompt_likes
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| prompt_id | UUID | NOT NULL |
| user_id | UUID | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

**Unique Constraint:** (prompt_id, user_id)
**Indexes:**
- prompt_id
- user_id

---

### Table: prompt_ratings
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| prompt_id | UUID | NOT NULL |
| user_id | UUID | NOT NULL |
| rating | INTEGER | CHECK (rating >= 1 AND rating <= 5) |
| review | TEXT | |
| created_at | TIMESTAMP | NOT NULL |

**Unique Constraint:** (prompt_id, user_id)
**Indexes:**
- prompt_id
- user_id
- rating

---

### Table: prompt_comments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| prompt_id | UUID | NOT NULL |
| user_id | UUID | NOT NULL |
| username | VARCHAR(50) | NOT NULL |
| content | TEXT | NOT NULL, CHECK (LENGTH(content) <= 5000) |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | |

**Indexes:**
- prompt_id
- user_id
- created_at (DESC)

---

## 3 Test Service Database (PostgreSQL)

### Table: prompt_tests
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| prompt_id | UUID | NOT NULL |
| user_id | UUID | NOT NULL |
| prompt_content | TEXT | NOT NULL |
| model_provider | VARCHAR(50) | NOT NULL |
| model_name | VARCHAR(50) | NOT NULL |
| temperature | DECIMAL(3,2) | |
| max_tokens | INTEGER | |
| status | VARCHAR(20) | NOT NULL |
| response | TEXT | |
| token_count | INTEGER | |
| response_time_ms | BIGINT | |
| cost | DECIMAL(10,4) | |
| error_message | TEXT | |
| created_at | TIMESTAMP | NOT NULL |
| completed_at | TIMESTAMP | |

**Indexes:**
- prompt_id
- user_id
- status
- created_at (DESC)

**Enums:**
- Status: PENDING, RUNNING, COMPLETED, FAILED

---

### Table: test_comparisons
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| prompt_id | UUID | NOT NULL |
| user_id | UUID | NOT NULL |
| notes | TEXT | |
| created_at | TIMESTAMP | NOT NULL |

---

### Table: comparison_test_ids
| Column | Type | Constraints |
|--------|------|-------------|
| comparison_id | UUID | NOT NULL |
| test_id | UUID | NOT NULL |

---

## 4 Marketplace Service Database (PostgreSQL)

### Table: prompt_listings
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| prompt_id | UUID | NOT NULL |
| seller_id | UUID | NOT NULL |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| price | DECIMAL(10,2) | NOT NULL |
| status | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | |

**Indexes:**
- prompt_id
- seller_id
- status
- created_at (DESC)

**Enums:**
- Status: ACTIVE, SOLD, REMOVED

---

### Table: transactions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| listing_id | UUID | NOT NULL |
| buyer_id | UUID | NOT NULL |
| seller_id | UUID | NOT NULL |
| amount | DECIMAL(10,2) | NOT NULL |
| status | VARCHAR(20) | NOT NULL |
| payment_method | VARCHAR(50) | |
| created_at | TIMESTAMP | NOT NULL |
| completed_at | TIMESTAMP | |

**Indexes:**
- listing_id
- buyer_id
- seller_id
- status
- created_at (DESC)

**Enums:**
- Status: PENDING, COMPLETED, FAILED

---

### Table: licenses
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| transaction_id | UUID | UNIQUE, NOT NULL |
| prompt_id | UUID | NOT NULL |
| buyer_id | UUID | NOT NULL |
| license_type | VARCHAR(20) | NOT NULL |
| expires_at | TIMESTAMP | |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | NOT NULL |

**Indexes:**
- transaction_id (UNIQUE)
- prompt_id
- buyer_id
- is_active

**Enums:**
- License Type: PERSONAL, COMMERCIAL

---

## 5 Analytics Service Database (PostgreSQL)

### Table: user_activity_events
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| event_id | UUID | UNIQUE, NOT NULL |
| user_id | UUID | NOT NULL |
| username | VARCHAR(50) | |
| email | VARCHAR(100) | |
| event_type | VARCHAR(50) | NOT NULL |
| event_time | TIMESTAMP | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

**Indexes:**
- user_id
- event_type
- event_time (DESC)
- created_at (DESC)

---

### Table: prompt_activity_events
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| event_id | UUID | UNIQUE, NOT NULL |
| prompt_id | UUID | NOT NULL |
| title | VARCHAR(200) | |
| user_id | UUID | |
| username | VARCHAR(50) | |
| category | VARCHAR(50) | |
| event_type | VARCHAR(50) | NOT NULL |
| event_time | TIMESTAMP | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

**Indexes:**
- prompt_id
- user_id
- event_type
- event_time (DESC)
- created_at (DESC)

---

## 6 PromptForge Database (MongoDB)

### Collection: prompt_versions
\\\json
{
  "_id": ObjectId,
  "promptId": UUID,
  "version": Integer,
  "title": String,
  "content": String,
  "description": String,
  "category": String,
  "userId": UUID,
  "changes": String,
  "createdAt": ISODate
}
\\\

**Indexes:**
- promptId + version (compound, unique)
- promptId (for querying all versions)
- createdAt (DESC)

---

##  Database Relationships

### Cross-Service Relationships (Logical, not enforced):

\\\
users.id  prompts.user_id
users.id  prompt_tests.user_id
users.id  prompt_listings.seller_id
users.id  transactions.buyer_id
prompts.id  prompt_listings.prompt_id
prompts.id  prompt_tests.prompt_id
prompts.id  licenses.prompt_id
\\\

**Note:** These are logical relationships only. No foreign key constraints across databases (microservices principle).

---

##  Storage Estimates

### Small Scale (10K users):
- Users: ~10MB
- Prompts: ~100MB
- Social Data: ~50MB
- Tests: ~200MB
- Marketplace: ~50MB
- Analytics: ~500MB
- **Total:** ~1GB

### Medium Scale (100K users):
- Users: ~100MB
- Prompts: ~1GB
- Social Data: ~500MB
- Tests: ~2GB
- Marketplace: ~500MB
- Analytics: ~5GB
- **Total:** ~10GB

### Large Scale (1M users):
- Users: ~1GB
- Prompts: ~10GB
- Social Data: ~5GB
- Tests: ~20GB
- Marketplace: ~5GB
- Analytics: ~50GB
- **Total:** ~100GB

---

##  Database Optimization

### Indexes Created:
- Primary keys on all tables
- Foreign key columns
- Frequently queried columns
- Timestamp columns for sorting

### Partitioning Strategy (Future):
- Analytics tables by month
- User tables by region
- Prompt tables by category

### Backup Strategy:
- Daily full backups
- Hourly incremental backups
- 30-day retention
- Off-site backup storage

---

**All schemas auto-created by Hibernate DDL!** 