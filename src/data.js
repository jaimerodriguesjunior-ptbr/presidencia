export const mockData = {
  days: [
    { id: 'dia1', label: 'Sexta-feira' },
    { id: 'dia2', label: 'Sábado' },
    { id: 'dia3', label: 'Domingo' }
  ],
  sessions: [
    { id: 'manha', label: 'Manhã' },
    { id: 'tarde', label: 'Tarde' }
  ],
  // Estrutura: data[dia][sessao][categoria] = array de pessoas
  assignments: {
    dia1: {
      manha: {
        presidentes: [
          { id: 'p1', name: 'João Silva', role: 'Presidente', phone: '5511999999999', notes: '', presences: { day1: false, today: false, min30: false, presented: false } }
        ],
        oradores: [
          { id: 'o1', name: 'Carlos Oliveira', theme: 'Discurso 1: O Início', phone: '5511988888888', notes: '', presences: { day1: false, today: false, min30: false, presented: false } },
          { id: 'o2', name: 'Marcos Paulo', theme: 'Discurso 2: A Continuação', phone: '5511977777777', notes: '', presences: { day1: false, today: false, min30: false, presented: false } }
        ],
        oracao: [
          { id: 'or1', name: 'Antônio Costa', theme: 'Oração Inicial', phone: '5511966666666', notes: '', presences: { day1: false, today: false, min30: false, presented: false } }
        ],
        substitutos: [
          { id: 's1', name: 'Pedro Henrique', role: 'Orador Substituto', phone: '5511955555555', notes: '', presences: { day1: false, today: false, min30: false, presented: false } }
        ]
      },
      tarde: {
        presidentes: [
          { id: 'p2', name: 'Lucas Fernandes', role: 'Presidente', phone: '5511944444444', notes: '', presences: { day1: false, today: false, min30: false, presented: false } }
        ],
        oradores: [
          { id: 'o3', name: 'Thiago Martins', theme: 'Discurso 3: A Esperança', phone: '5511933333333', notes: '', presences: { day1: false, today: false, min30: false, presented: false } }
        ],
        oracao: [],
        substitutos: []
      }
    },
    dia2: {
      manha: {
        presidentes: [],
        oradores: [],
        oracao: [],
        substitutos: []
      },
      tarde: {
        presidentes: [],
        oradores: [],
        oracao: [],
        substitutos: []
      }
    },
    dia3: {
      manha: {
        presidentes: [],
        oradores: [],
        oracao: [],
        substitutos: []
      },
      tarde: {
        presidentes: [],
        oradores: [],
        oracao: [],
        substitutos: []
      }
    }
  }
};
