import { useState } from 'react';
import { Calendar, Clock, User, Mic2, ShieldCheck, UserPlus, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { mockData } from './data';
import './App.css';

function App() {
  const [activeDay, setActiveDay] = useState('dia1');
  const [activeSession, setActiveSession] = useState('manha');
  const [activeCategory, setActiveCategory] = useState('oracao');
  
  // Clonando os dados mock para permitir edição na memória
  const [data, setData] = useState(mockData.assignments);

  const categories = [
    { id: 'oracao', label: 'Oração', icon: User },
    { id: 'presidentes', label: 'Presidente', icon: ShieldCheck },
    { id: 'oradores', label: 'Discursos', icon: Mic2 },
    { id: 'substitutos', label: 'Substitutos', icon: UserPlus },
  ];

  const handlePresenceChange = (day, session, category, personId, field) => {
    setData(prevData => {
      const newData = { ...prevData };
      newData[day] = { ...newData[day] };
      newData[day][session] = { ...newData[day][session] };
      newData[day][session][category] = newData[day][session][category].map(p => {
        if (p.id === personId) {
          return {
            ...p,
            presences: {
              ...p.presences,
              [field]: !p.presences[field]
            }
          };
        }
        return p;
      });
      return newData;
    });
  };

  const handleNotesChange = (day, session, category, personId, value) => {
    setData(prevData => {
      const newData = { ...prevData };
      newData[day] = { ...newData[day] };
      newData[day][session] = { ...newData[day][session] };
      newData[day][session][category] = newData[day][session][category].map(p => {
        if (p.id === personId) {
          return { ...p, notes: value };
        }
        return p;
      });
      return newData;
    });
  };

  const currentData = data[activeDay]?.[activeSession];
  const activeCategoryData = currentData ? currentData[activeCategory] : [];
  const ActiveIcon = categories.find(c => c.id === activeCategory)?.icon || User;
  const activeTitle = categories.find(c => c.id === activeCategory)?.label || '';

  const getStatusColor = (presences) => {
    if (presences.min30) return 'var(--success-color)'; // Verde
    if (presences.today) return '#3a86ff'; // Azul
    if (presences.day1) return 'var(--warning-color)'; // Laranja
    return 'var(--danger-color)'; // Vermelho padrão
  };

  const PersonCard = ({ person, category }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const statusColor = getStatusColor(person.presences);

    return (
      <div className="person-card" style={{ borderLeft: `4px solid ${statusColor}` }}>
        <div 
          className="person-header" 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <div className="person-info" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>{person.name}</h3>
            <p style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.theme || person.role}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="person-details" style={{ borderTop: '1px solid var(--border-color)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
              <label className="checkbox-label" style={{ fontSize: '0.85rem', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={person.presences.day1}
                  onChange={() => handlePresenceChange(activeDay, activeSession, category, person.id, 'day1')}
                />
                1º Dia
              </label>
              <label className="checkbox-label" style={{ fontSize: '0.85rem', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={person.presences.today}
                  onChange={() => handlePresenceChange(activeDay, activeSession, category, person.id, 'today')}
                />
                Hoje
              </label>
              <label className="checkbox-label" style={{ fontSize: '0.85rem', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={person.presences.min30}
                  onChange={() => handlePresenceChange(activeDay, activeSession, category, person.id, 'min30')}
                />
                30 Min
              </label>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Obs:</span>
              <input 
                type="text"
                className="notes-input"
                placeholder="Notas..."
                value={person.notes}
                onChange={(e) => handleNotesChange(activeDay, activeSession, category, person.id, e.target.value)}
                style={{ minHeight: 'auto', padding: '0.4rem 0.75rem', flex: 1, fontSize: '0.85rem' }}
              />
            </div>

            <a 
              href={`https://wa.me/${person.phone}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="wa-button"
              style={{ padding: '0.5rem', borderRadius: '50%', flexShrink: 0 }}
              title="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            
          </div>
        )}
      </div>
    );
  };

  const Section = ({ title, icon: Icon, items, category }) => {
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
            <PersonCard key={person.id} person={person} category={category} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="top-nav-header">
          <h1><Calendar size={28} /> Gestão do Congresso</h1>
        </div>
        
        {/* Day Tabs */}
        <div className="tabs-container">
          {mockData.days.map(day => (
            <button
              key={day.id}
              className={`tab-button ${activeDay === day.id ? 'active' : ''}`}
              onClick={() => setActiveDay(day.id)}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Session Tabs */}
        <div className="tabs-container" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          {mockData.sessions.map(session => (
            <button
              key={session.id}
              className={`tab-button ${activeSession === session.id ? 'active' : ''}`}
              onClick={() => setActiveSession(session.id)}
            >
              <Clock size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
              {session.label}
            </button>
          ))}
        </div>
        
        {/* Category Tabs */}
        <div className="tabs-container" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          {categories.map(cat => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                className={`tab-button ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <IconComponent size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="main-content">
        {currentData ? (
          <Section 
            title={activeTitle} 
            icon={ActiveIcon} 
            items={activeCategoryData} 
            category={activeCategory} 
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>Selecione um dia e sessão válidos.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
