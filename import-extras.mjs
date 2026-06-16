import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const env = fs.readFileSync('g:/projetos/presidencia/.env.local', 'utf-8');
const lines = env.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('VITE_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

const csvData = fs.readFileSync('g:/projetos/presidencia/oracao presidentes substitutos.csv', 'utf-8');
const records = parse(csvData, {
  skip_empty_lines: true
});

const mapDia = {
  'SEXTA': 'dia1',
  'SÁBADO': 'dia2',
  'DOMINGO': 'dia3'
};

const mapPeriodo = {
  'manhã': 'manha',
  'tarde': 'tarde',
  'incial': 'manha', // Tratando erros de digitação comuns
  'inicial': 'manha',
  'final': 'tarde'
};

const inserts = [];

// Pula a linha 1 (cabeçalho principal)
for (let i = 1; i < records.length; i++) {
  const r = records[i];

  // Bloco 1: ORAÇÃO (Colunas 0, 1, 2, 3)
  if (r[0] && r[2]) {
    const diaRaw = r[0].trim().toUpperCase();
    const periodoRaw = r[1].trim().toLowerCase();
    
    inserts.push({
      dia: mapDia[diaRaw] || diaRaw,
      periodo: mapPeriodo[periodoRaw] || periodoRaw,
      categoria: 'oracao',
      tema: `Oração ${r[1].trim()}`,
      orador: r[2].trim(),
      wa: r[3] ? r[3].trim() : ''
    });
  }

  // Bloco 2: PRESIDENTES (Colunas 5, 6, 7, 8)
  if (r[5] && r[7]) {
    const diaRaw = r[5].trim().toUpperCase();
    const periodoRaw = r[6].trim().toLowerCase();
    
    inserts.push({
      dia: mapDia[diaRaw] || diaRaw,
      periodo: mapPeriodo[periodoRaw] || periodoRaw,
      categoria: 'presidentes',
      tema: `Presidente da Sessão`,
      orador: r[7].trim(),
      wa: r[8] ? r[8].trim() : ''
    });
  }

  // Bloco 3: SUBSTITUTOS (Colunas 10, 11, 12, 13)
  if (r[10] && r[12]) {
    const diaRaw = r[10].trim().toUpperCase();
    const periodoRaw = r[11].trim().toLowerCase();
    
    inserts.push({
      dia: mapDia[diaRaw] || diaRaw,
      periodo: mapPeriodo[periodoRaw] || periodoRaw,
      categoria: 'substitutos',
      tema: `Acompanhar Discursos`,
      orador: r[12].trim(),
      wa: r[13] ? r[13].trim() : ''
    });
  }
}

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
