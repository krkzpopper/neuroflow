import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://pkiiqfhewsejacgvkpbd.supabase.co';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBraWlxZmhld3NlamFjZ3ZrcGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjM1NjksImV4cCI6MjEwNDE5OTU2OX0.54dDgmaqtN5yq8ID1-XwmbVsZlBq_DzLxxEcNF-K3kg';

export const supabase = createClient(supabaseUrl, supabaseKey);
