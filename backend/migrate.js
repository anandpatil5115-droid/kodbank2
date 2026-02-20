import supabase from './db.js';

async function migrate() {
    console.log('🚀 Running Kodbank migrations...\n');

    // Create KodUser table
    const { error: userTableErr } = await supabase.rpc('exec_sql', {
        query: `
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('customer', 'manager', 'admin');
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS koduser (
        uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(12,2) DEFAULT 100000.00,
        phone VARCHAR(20),
        role user_role DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
    });

    if (userTableErr) {
        // Fallback: use direct table creation via Supabase REST
        console.log('RPC not available, creating tables via REST API...');

        // Try creating via Supabase's built-in methods
        const { error: checkErr } = await supabase.from('koduser').select('uid').limit(1);

        if (checkErr && checkErr.code === '42P01') {
            console.log('⚠️  Tables do not exist. Please run the following SQL in Supabase Dashboard → SQL Editor:\n');
            console.log(`
-- Run this in Supabase SQL Editor --

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'manager', 'admin');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS koduser (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(12,2) DEFAULT 100000.00,
  phone VARCHAR(20),
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usertoken (
  tid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL,
  uid UUID NOT NULL REFERENCES koduser(uid) ON DELETE CASCADE,
  expiry TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE koduser ENABLE ROW LEVEL SECURITY;
ALTER TABLE usertoken ENABLE ROW LEVEL SECURITY;

-- Allow all operations via service role (our backend uses anon key with policies)
CREATE POLICY "Allow all for koduser" ON koduser FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for usertoken" ON usertoken FOR ALL USING (true) WITH CHECK (true);
      `);
        } else if (!checkErr) {
            console.log('✅ koduser table already exists');
        }
    } else {
        console.log('✅ koduser table created/verified');
    }

    // Check usertoken table
    const { error: tokenCheckErr } = await supabase.from('usertoken').select('tid').limit(1);
    if (tokenCheckErr && tokenCheckErr.code === '42P01') {
        console.log('⚠️  usertoken table does not exist — see SQL above');
    } else if (!tokenCheckErr) {
        console.log('✅ usertoken table already exists');
    }

    console.log('\n✨ Migration check complete!');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
