// supabase-client.js
// RoundsPro — Supabase client initialisation
//
// ── SETUP INSTRUCTIONS ────────────────────────────────────────
// 1. Go to: Supabase Dashboard → Settings → API
// 2. Copy your Project URL and anon/public key
// 3. Replace the two values below
// 4. Add these as Netlify environment variables too (see README)
// ─────────────────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,           // Keeps user logged in across page reloads
    autoRefreshToken: true,
    detectSessionInUrl: true,       // Handles magic-link / OAuth redirects
  },
});

// ── Auth helpers ─────────────────────────────────────────────

/** Sign in with email + password */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Sign up a new user */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

/** Sign out */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get the current logged-in user (null if not logged in) */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Listen for auth state changes (login/logout) */
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

// ── Profile helpers ──────────────────────────────────────────

/** Fetch this user's profile (settings) */
export async function fetchProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/** Update profile / settings */
export async function saveProfile(updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', (await getUser()).id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
