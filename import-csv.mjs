import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const env = fs.readFileSync('g:/projetos/presidencia/.env.local', 'utf-8');
const lines = env.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('VITE_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

const csvData = fs.readFileSync('g:/projetos/presidencia/oradores e discursos.csv', 'utf-8');
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true
});

const mapDia = {
  'SEXTA': 'dia1',
  'SÁBADO': 'dia2',
  'DOMINGO': 'dia3'
};

const mapPeriodo = {
  'manhã': 'manha',
  'tarde': 'tarde'
};

const inserts = records.map(r => ({
  dia: mapDia[r.dia.trim().toUpperCase()] || r.dia,
  periodo: mapPeriodo[r.periodo.trim().toLowerCase()] || r.periodo,
  numero: parseInt(r.numero, 10) || null,
  hora: '',
  tema: r.tema ? r.tema.trim() : '',
  orador: r.orador ? r.orador.trim() : '',
  wa: r.wa ? r.wa.trim() : '',
  categoria: 'oradores'
}));

async function run() {
  console.log(`Inserindo ${inserts.length} registros no Supabase...`);
  const { data, error } = await supabase.from('designacoes').insert(inserts);
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Concluído com sucesso!');
  }
}
run();
