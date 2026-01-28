-- Supabase Schema for ClaudeJob
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New query)

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_company TEXT NOT NULL,
  job_location TEXT NOT NULL,
  job_url TEXT NOT NULL,
  job_description TEXT,
  status TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL,
  response_at TIMESTAMPTZ,
  response_message TEXT,
  interview_date TIMESTAMPTZ,
  cover_letter TEXT,
  resume TEXT,
  job_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovered jobs table
CREATE TABLE IF NOT EXISTS discovered_jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  salary TEXT,
  requirements JSONB,
  platform TEXT,
  posted_at TIMESTAMPTZ,
  discovered_at TIMESTAMPTZ NOT NULL,
  job_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent state table
CREATE TABLE IF NOT EXISTS agent_state (
  agent_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  last_active TIMESTAMPTZ NOT NULL,
  current_task TEXT,
  state_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_agent_id ON applications(agent_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_agent_id ON activity_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_discovered_jobs_url ON discovered_jobs(url);
CREATE INDEX IF NOT EXISTS idx_discovered_jobs_discovered_at ON discovered_jobs(discovered_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_state ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on applications" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on activity_logs" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on discovered_jobs" ON discovered_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on agent_state" ON agent_state FOR ALL USING (true) WITH CHECK (true);

-- Insert default agent state
INSERT INTO agent_state (agent_id, status, last_active, state_data)
VALUES ('default', 'idle', NOW(), '{"status": "idle"}')
ON CONFLICT (agent_id) DO NOTHING;

-- Insert some sample activity logs to show the system is working
INSERT INTO activity_logs (id, agent_id, type, message, timestamp, metadata)
VALUES 
  ('log-init-1', 'clawdjob-agent-001', 'status_update', '🎉 Система ClaudeJob успешно подключена к Supabase!', NOW(), '{"source": "system"}'),
  ('log-init-2', 'clawdjob-agent-001', 'thinking', '🔄 Готов к поиску вакансий...', NOW() - INTERVAL '1 minute', '{"source": "system"}')
ON CONFLICT (id) DO NOTHING;

