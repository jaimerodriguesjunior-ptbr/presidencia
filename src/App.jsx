import { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, Clock, User, Mic2, ShieldCheck, UserPlus, MessageCircle, ChevronDown, ChevronUp, Pencil, Check, HelpCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getStatusColor = (person) => {
  if (person.check_min30) return 'var(--success-color)';
  if (person.check_today) return '#3a86ff';
  if (person.check_day1) return 'var(--warning-color)';
  return 'var(--danger-color)';
};

const PersonCard = ({ person, onPresenceChange, onNotesChange, onWaChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingWa, setIsEditingWa] = useState(false);
  const [waValue, setWaValue] = useState(person.wa || '');
  
  const statusColor = getStatusColor(person);

  useEffect(() => {
    setWaValue(person.wa || '');
  }, [person.wa]);

  const saveWa = () => {
    setIsEditingWa(false);
    if (waValue !== person.wa) {
      onWaChange(person.id, waValue);
    }
  };

  return (
    <div className="person-card" style={{ borderLeft: `4px solid ${statusColor}` }}>
      <div 
        className="person-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <div className="person-info" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {person.numero && (
            <span style={{ background: 'var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              #{person.numero}
            </span>
          )}
          <h3 style={{ margin: 0, minWidth: '150px' }}>{person.orador || 'A definir'}</h3>
          <p className="person-theme" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{person.tema || ''}</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
          {person.hora && (
            <span className="mobile-hidden" style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{person.hora}</span>
          )}

          <div onClick={(e) => e.stopPropagation()}>
            {isEditingWa ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="text"
                  value={waValue}
                  onChange={(e) => setWaValue(e.target.value)}
                  placeholder="55119..."
                  className="notes-input"
                  style={{ width: '120px', minHeight: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem', background: 'var(--bg-color)' }}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && saveWa()}
                />
                <button 
                  onClick={saveWa}
                  style={{ padding: '0.4rem', background: 'var(--success-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {person.wa ? (
                  <a 
                    href={`https://wa.me/${person.wa.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="wa-button"
                    style={{ padding: '0.5rem', borderRadius: '50%', flexShrink: 0 }}
                    title="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                ) : (
                  <span className="mobile-hidden" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>S/ WA</span>
                )}
                
                <button 
                  onClick={() => setIsEditingWa(true)}
                  className="mobile-hidden"
                  style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Editar WhatsApp"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="mobile-hidden" style={{ color: 'var(--text-secondary)' }}>
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="person-details mobile-hidden" style={{ borderTop: '1px solid var(--border-color)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
          
          <div className="mobile-hidden" style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
            <label className="checkbox-label" style={{ fontSize: '0.85rem', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={person.check_day1 || false}
                onChange={() => onPresenceChange(person.id, 'check_day1', person.check_day1)}
              />
              1º Dia
            </label>
            <label className="checkbox-label" style={{ fontSize: '0.85rem', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={person.check_today || false}
                onChange={() => onPresenceChange(person.id, 'check_today', person.check_today)}
              />
              Hoje
            </label>
            <label className="checkbox-label" style={{ fontSize: '0.85rem', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={person.check_min30 || false}
                onChange={() => onPresenceChange(person.id, 'check_min30', person.check_min30)}
              />
              30 Min
            </label>
          </div>

          <div className="mobile-hidden" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Obs:</span>
            <input 
              type="text"
              className="notes-input"
              placeholder="Notas..."
              value={person.notes || ''}
              onChange={(e) => onNotesChange(person.id, e.target.value)}
              style={{ minHeight: 'auto', padding: '0.4rem 0.75rem', flex: 1, fontSize: '0.85rem' }}
            />
          </div>
          
        </div>
      )}
    </div>
  );
};

const Section = ({ title, icon: Icon, items, loading, onPresenceChange, onNotesChange, onWaChange }) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando dados...</div>;
  }

  if (!items || items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        <p>Nenhuma designação de {title.toLowerCase()} para esta sessão.</p>
      </div>
    );
  }
  
  return (
    <div className="section-container">
      <h2 className="section-header">
        <Icon size={24} className="accent-icon" color="var(--accent-color)" />
        {title}
      </h2>
      <div className="section-list">
        {items.map(person => (
          <PersonCard 
            key={person.id} 
            person={person} 
            onPresenceChange={onPresenceChange}
            onNotesChange={onNotesChange}
            onWaChange={onWaChange}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [activeDay, setActiveDay] = useState('dia1');
  const [activeSession, setActiveSession] = useState('manha');
  const [activeCategory, setActiveCategory] = useState('oradores');
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'designacoes' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setData((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item));
          } else if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: records, error } = await supabase
      .from('designacoes')
      .select('*')
      .order('numero', { ascending: true });
      
    if (error) {
      console.error('Erro ao buscar dados:', error);
    } else {
      setData(records || []);
    }
    setLoading(false);
  };

  const days = [
    { id: 'dia1', desktopLabel: 'Sexta-feira', mobileLabel: 'Sex.' },
    { id: 'dia2', desktopLabel: 'Sábado', mobileLabel: 'Sáb.' },
    { id: 'dia3', desktopLabel: 'Domingo', mobileLabel: 'Dom.' }
  ];

  const sessions = [
    { id: 'manha', desktopLabel: 'Manhã', mobileLabel: 'Manhã' },
    { id: 'tarde', desktopLabel: 'Tarde', mobileLabel: 'Tarde' }
  ];

  const categories = [
    { id: 'presidentes', desktopLabel: 'Presidente', mobileLabel: 'Pres', icon: ShieldCheck },
    { id: 'oracao', desktopLabel: 'Oração', mobileLabel: 'Oração', icon: User },
    { id: 'oradores', desktopLabel: 'Discursos', mobileLabel: 'Disc', icon: Mic2 },
    { id: 'substitutos', desktopLabel: 'Substitutos', mobileLabel: 'Subst', icon: UserPlus },
  ];

  const handlePresenceChange = async (personId, field, currentValue) => {
    setData(prev => prev.map(p => p.id === personId ? { ...p, [field]: !currentValue } : p));
    
    const { error } = await supabase
      .from('designacoes')
      .update({ [field]: !currentValue })
      .eq('id', personId);
      
    if (error) {
      console.error('Erro ao atualizar presença:', error);
      setData(prev => prev.map(p => p.id === personId ? { ...p, [field]: currentValue } : p));
    }
  };

  const notesDebounceRef = useRef({});

  const handleNotesChange = useCallback((personId, value) => {
    // Atualiza o estado local imediatamente para o campo responder na hora
    setData(prev => prev.map(p => p.id === personId ? { ...p, notes: value } : p));

    // Cancela o timer anterior desse item e agenda um novo salvamento
    if (notesDebounceRef.current[personId]) {
      clearTimeout(notesDebounceRef.current[personId]);
    }
    notesDebounceRef.current[personId] = setTimeout(async () => {
      await supabase
        .from('designacoes')
        .update({ notes: value })
        .eq('id', personId);
    }, 600);
  }, []);

  const handleWaChange = async (personId, value) => {
    setData(prev => prev.map(p => p.id === personId ? { ...p, wa: value } : p));
    
    await supabase
      .from('designacoes')
      .update({ wa: value })
      .eq('id', personId);
  };

  const activeCategoryData = data.filter(d => 
    d.dia === activeDay && 
    d.periodo === activeSession && 
    d.categoria === activeCategory
  );
  
  const ActiveIcon = categories.find(c => c.id === activeCategory)?.icon || User;
  const activeTitle = categories.find(c => c.id === activeCategory)?.desktopLabel || '';

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="top-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1rem' }}>
          <h1><Calendar size={28} /> Congresso "Felicidade Eterna" - Presidência</h1>
          <a 
            href="https://notebooklm.google.com/notebook/086734d2-8ddf-4701-9973-8223c7f19edc" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '0.5rem', 
              borderRadius: '50%', 
              background: 'var(--accent-color)', 
              color: 'var(--bg-color)',
              textDecoration: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            title="Dúvidas? Pergunte ao NotebookLM"
          >
            <HelpCircle size={24} />
          </a>
        </div>
        
        <div className="tabs-container">
          {days.map(day => (
            <button
              key={day.id}
              className={`tab-button ${activeDay === day.id ? 'active' : ''}`}
              onClick={() => setActiveDay(day.id)}
            >
              <span className="desktop-text">{day.desktopLabel}</span>
              <span className="mobile-text">{day.mobileLabel}</span>
            </button>
          ))}
        </div>

        <div className="tabs-container" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          {sessions.map(session => (
            <button
              key={session.id}
              className={`tab-button ${activeSession === session.id ? 'active' : ''}`}
              onClick={() => setActiveSession(session.id)}
            >
              <Clock size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
              <span className="desktop-text">{session.desktopLabel}</span>
              <span className="mobile-text">{session.mobileLabel}</span>
            </button>
          ))}
        </div>
        
        <div className="tabs-container" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          {categories.map(cat => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                className={`tab-button category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <IconComponent size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                <span className="desktop-text">{cat.desktopLabel}</span>
                <span className="mobile-text">{cat.mobileLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="main-content">
        <Section 
          title={activeTitle} 
          icon={ActiveIcon} 
          items={activeCategoryData} 
          loading={loading}
          onPresenceChange={handlePresenceChange}
          onNotesChange={handleNotesChange}
          onWaChange={handleWaChange}
        />
      </main>
    </div>
  );
}

export default App;
