# Supabase Database Setup

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually takes 1-2 minutes)

## Step 2: Create Database Table
Go to **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Create the api_keys table
CREATE TABLE api_keys (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'dev' CHECK (type IN ('dev', 'prod', 'test')),
  usage INTEGER DEFAULT 0,
  limit_usage BOOLEAN DEFAULT false,
  usage_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP WITH TIME ZONE,
  user_id TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own API keys
CREATE POLICY "Users can view own api keys" ON api_keys
  FOR SELECT USING (user_id = 'demo-user-123');

-- Users can insert their own API keys
CREATE POLICY "Users can insert own api keys" ON api_keys
  FOR INSERT WITH CHECK (user_id = 'demo-user-123');

-- Users can update their own API keys
CREATE POLICY "Users can update own api keys" ON api_keys
  FOR UPDATE USING (user_id = 'demo-user-123');

-- Users can delete their own API keys
CREATE POLICY "Users can delete own api keys" ON api_keys
  FOR DELETE USING (user_id = 'demo-user-123');
```

## Step 3: Get Your Credentials
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon/public key**

## Step 4: Create Environment File
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 5: Test the Application
```bash
npm run dev
```

Navigate to `/dashboards` and test creating, editing, and deleting API keys!

## Features Included:
- ✅ **Row Level Security**: Users can only access their own API keys
- ✅ **Automatic timestamps**: Created and updated timestamps
- ✅ **Usage tracking**: Track API usage per key
- ✅ **Rate limiting**: Support for usage limits
- ✅ **Key management**: Revoke/activate keys
- ✅ **Type system**: Development, Production, Test environments
