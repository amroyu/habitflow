-- Temporary Admin User
INSERT INTO public.profiles (username, email, created_at, updated_at)
VALUES ('temp_admin', 'temp_admin@example.com', timezone('utc'::text, now()), timezone('utc'::text, now()));
