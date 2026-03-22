-- Petits Divendres: Fase 2 (Nens i Assistència)

-- 1. Taula 'children' per registre d'infants
CREATE TABLE public.children (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Lògica simple de seguretat
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- 2. Taula 'attendances' (entrades i sortides vinculades al nen i a la sessió)
CREATE TABLE public.attendances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.sessions(id) NOT NULL,
  child_id uuid REFERENCES public.children(id) NOT NULL,
  check_in_time timestamptz DEFAULT now() NOT NULL,
  check_out_time timestamptz
);

ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Nota: Recorda executar aquest script al teu panell web d'Insforge.
