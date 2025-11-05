import React, { useState, useEffect } from 'react';
import './App.css'; // ✅ on importe le CSS externe

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; }

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) clearInterval(timer);
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const API_ENDPOINT = 'https://api.monlapin.com/api/newsletter/inscription';
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, timestamp: new Date().toISOString(), source: 'site_vitrine'}),
      });
      if (!response.ok) throw new Error(`Erreur du serveur: ${response.status}`);
      setEmail('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content-card">
        {/* Logo Lapin */}
        <div className="icon-wrapper">
          <div className="icon-circle">
            <span style={{ color: 'var(--primary-color)' }}>🐰</span>
          </div>
        </div>

        {/* Titre */}
        <h1 className="title-text">
          <span className="title-gradient">Bientôt Disponible</span>
        </h1>
        <p className="subtitle-text">
          Notre vitrine est en construction ! Entrez votre e-mail pour être le premier informé de notre lancement.
        </p>

        {/* Contact */}
        <div className="contact-info">
          <p>Contactez-nous :</p>
          <div className="contact-links">
            <a href="mailto:monlapinci2025@gmail.com" className="contact-item">📧 monlapinci2025@gmail.com</a>
            <a href="https://wa.me/225545735108" target="_blank" rel="noopener noreferrer" className="contact-item" style={{ color: 'var(--whatsapp-color)' }}>
              💬 WhatsApp +225 0545735108
            </a>
          </div>
        </div>

        {/* Compte à rebours */}
        <div className="countdown-grid">
          {[{ label: 'Jours', value: timeLeft.days },
          { label: 'Heures', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Secondes', value: timeLeft.seconds }]
            .map((item, i) => (
              <div key={i} className="countdown-item">
                <div className="countdown-value">{String(item.value).padStart(2, '0')}</div>
                <div className="countdown-label">{item.label}</div>
              </div>
            ))}
        </div>

        {/* Formulaire */}
        <div className="form-wrapper">
          {submitted ? (
            <div className="success-message"><p>Merci ! Nous vous contacterons dès que possible.</p></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-layout">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre e-mail"
                  required
                  className="email-input"
                  disabled={loading}
                />
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? <div className="spinner"></div> : 'Avertissez-moi'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;










        
      