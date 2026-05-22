-- ============================================================
--  RoundsPro — Default Stock Seed
--  Run AFTER 01_schema.sql
--  Run AFTER you have created your first user account
--
--  IMPORTANT: Replace the UUID below with YOUR user's id.
--  Find it in: Supabase → Authentication → Users → copy your id
-- ============================================================

-- Set your user ID here:
DO $$
DECLARE
  v_user_id UUID := 'PASTE-YOUR-USER-UUID-HERE';
BEGIN

-- ── MON-FRI NEWSPAPERS ──────────────────────────────────────
INSERT INTO public.stock (user_id, title, type, freq, delivery_days, cost_price, sell_price, stock, gst_applicable) VALUES
  (v_user_id, 'The Sun',                'paper', 'daily', '[1,2,3,4,5]', 0, 1.70, 0, false),
  (v_user_id, 'Daily Mirror',           'paper', 'daily', '[1,2,3,4,5]', 0, 2.10, 0, false),
  (v_user_id, 'Daily Mail',             'paper', 'daily', '[1,2,3,4,5]', 0, 1.80, 0, false),
  (v_user_id, 'The Times',              'paper', 'daily', '[1,2,3,4,5]', 0, 3.40, 0, false),
  (v_user_id, 'Racing Post',            'paper', 'daily', '[1,2,3,4,5]', 0, 5.70, 0, false),
  (v_user_id, 'The i',                  'paper', 'daily', '[1,2,3,4,5]', 0, 1.30, 0, false),

-- ── SATURDAY NEWSPAPERS ─────────────────────────────────────
  (v_user_id, 'The Sun Saturday',       'paper', 'daily', '[6]', 0, 2.60, 0, false),
  (v_user_id, 'Daily Mirror Saturday',  'paper', 'daily', '[6]', 0, 2.10, 0, false),
  (v_user_id, 'Daily Mail Saturday',    'paper', 'daily', '[6]', 0, 2.20, 0, false),
  (v_user_id, 'The Times Saturday',     'paper', 'daily', '[6]', 0, 4.50, 0, false),
  (v_user_id, 'Racing Post Saturday',   'paper', 'daily', '[6]', 0, 5.90, 0, false),
  (v_user_id, 'Daily Express Saturday', 'paper', 'daily', '[6]', 0, 3.20, 0, false),
  (v_user_id, 'Daily Star Saturday',    'paper', 'daily', '[6]', 0, 2.20, 0, false),

-- ── SUNDAY NEWSPAPERS ───────────────────────────────────────
  (v_user_id, 'Mail on Sunday',         'paper', 'daily', '[0]', 0, 2.80, 0, false),
  (v_user_id, 'Sunday People',          'paper', 'daily', '[0]', 0, 3.60, 0, false),
  (v_user_id, 'Sunday Mirror',          'paper', 'daily', '[0]', 0, 3.60, 0, false),
  (v_user_id, 'Sun on Sunday',          'paper', 'daily', '[0]', 0, 3.20, 0, false),
  (v_user_id, 'Sunday Express',         'paper', 'daily', '[0]', 0, 3.60, 0, false),
  (v_user_id, 'Sunday Times',           'paper', 'daily', '[0]', 0, 5.00, 0, false),
  (v_user_id, 'Daily Star Sunday',      'paper', 'daily', '[0]', 0, 2.50, 0, false),
  (v_user_id, 'The i Sunday',           'paper', 'daily', '[0]', 0, 2.20, 0, false),

-- ── WEEKLY MAGAZINES ────────────────────────────────────────
  (v_user_id, 'Best',                        'magazine', 'weekly', '[3]', 0, 2.99,  0, true),
  (v_user_id, 'Closer',                      'magazine', 'weekly', '[3]', 0, 3.20,  0, true),
  (v_user_id, 'Hello Magazine',              'magazine', 'weekly', '[3]', 0, 4.25,  0, true),
  (v_user_id, 'Inside Soap',                 'magazine', 'weekly', '[3]', 0, 4.50,  0, true),
  (v_user_id, 'My Weekly',                   'magazine', 'weekly', '[3]', 0, 2.35,  0, true),
  (v_user_id, 'Peoples Friend',              'magazine', 'weekly', '[3]', 0, 2.70,  0, true),
  (v_user_id, 'Radio Times',                 'magazine', 'weekly', '[3]', 0, 5.50,  0, true),
  (v_user_id, 'TV & Streaming Week',         'magazine', 'weekly', '[3]', 0, 3.80,  0, true),
  (v_user_id, 'TV Choice',                   'magazine', 'weekly', '[3]', 0, 0.85,  0, true),
  (v_user_id, 'Whats on TV Weekly',          'magazine', 'weekly', '[3]', 0, 0.88,  0, true),
  (v_user_id, 'Woman',                       'magazine', 'weekly', '[3]', 0, 1.90,  0, true),
  (v_user_id, 'Womans Own',                  'magazine', 'weekly', '[3]', 0, 2.45,  0, true),
  (v_user_id, 'Womans Weekly',               'magazine', 'weekly', '[3]', 0, 1.99,  0, true),

-- ── MONTHLY MAGAZINES ───────────────────────────────────────
  (v_user_id, 'Build the Lancaster Bomber',  'magazine', 'monthly', '[]', 0, 10.99, 0, true),
  (v_user_id, 'Peoples Friend Special',      'magazine', 'monthly', '[]', 0, 4.20,  0, true);

END $$;
