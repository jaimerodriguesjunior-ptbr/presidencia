import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('g:/projetos/presidencia/.env.local', 'utf-8');
const lines = env.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('VITE_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  
  // Try to query a common table name to see what happens
  const tables = ['designacoes', 'discursos', 'oradores'];
  
  for (const table of tables) {
    console.log(`Trying to select from ${table}...`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Error querying ${table}: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`Success querying ${table}! Found ${data.length} records.`);
      if (data.length > 0) {
        console.log('Sample data:', data[0]);
      }
    }
  }
}

testConnection();
