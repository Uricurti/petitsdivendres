-- Schema definition for Petits Divendres Web App

-- 1. Create the sessions table
CREATE TABLE public.sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  is_open boolean DEFAULT false NOT NULL,
  current_count integer DEFAULT 0 NOT NULL,
  max_capacity integer DEFAULT 20 NOT NULL,
  opened_at timestamptz,
  closed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- 2. Establish RLS (Row Level Security) - allow public read for Realtime
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to sessions" ON public.sessions FOR SELECT USING (true);
-- Write access is done via server API, bypasses RLS using service_role key.

-- 3. Turn on Realtime for sessions (Insforge standard via PostgreSQL replication)
-- En Insforge, per encendre Realtime ho has de fer des de l'interfície web (Settings -> Database -> Realtime -> Sessions)
-- o executar ALTER PUBLICATION insforge_realtime ADD TABLE sessions; (segons la documentació).
-- Ho deixem comentat perquè l'script no falli d'aquest pas en endavant.
-- ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

-- 4. Create the capacity_log table to track events
CREATE TABLE public.capacity_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.sessions(id) NOT NULL,
  event_type text NOT NULL, -- 'family_in', 'family_out', 'session_open', 'session_close', 'count_correction'
  count_before integer NOT NULL,
  count_after integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Log table is private by default since it only tracks admin changes
ALTER TABLE public.capacity_log ENABLE ROW LEVEL SECURITY;
