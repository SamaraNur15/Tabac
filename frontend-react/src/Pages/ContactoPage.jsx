// src/Pages/ContactoPage.jsx
import { useState } from 'react';
import './ContactoPage.css';

function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setEnviado(false), 5000);
    }, 1500);
  };

  return (
    <div className="contacto-page">
      <div className="contacto-hero">
        <h1 className="contacto-hero__title">Contacto</h1>
        <p className="contacto-hero__subtitle">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte
        </p>
      </div>

      <div className="contacto-container">
        <div className="contacto-grid">
          {/* Información de contacto */}
          <div className="contacto-info">
            <div className="info-card">
              <div className="info-card__icon">📍</div>
              <h3 className="info-card__title">Dirección</h3>
              <p className="info-card__text">
                Gral. San Martín 270, Y4600<br />
                San Salvador de Jujuy, Jujuy<br />
                Argentina
              </p>
            </div>

            <div className="info-card">
              <div className="info-card__icon">📞</div>
              <h3 className="info-card__title">Teléfono</h3>
              <p className="info-card__text">
                <a href="tel:+543884243819">+54 388 4243819</a>
              </p>
            </div>

            <div className="info-card">
              <div className="info-card__icon">✉️</div>
              <h3 className="info-card__title">Email</h3>
              <p className="info-card__text">
                <a href="mailto:caffetabac@gmail.com">caffetabac@gmail.com</a>
              </p>
            </div>

            <div className="info-card">
              <div className="info-card__icon">🕐</div>
              <h3 className="info-card__title">Horarios</h3>
              <p className="info-card__text">
                Lunes a Viernes: 7:00 - 22:00<br />
                Sábados: 9:00 - 23:00<br />
                Domingos: cerrado
              </p>
            </div>

            {/* Redes sociales */}
            <div className="social-links">
              <h3 className="social-links__title">Síguenos</h3>
              <div className="social-links__icons">
                <a href="https://www.facebook.com/tabacjujuy" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/tabac_jujuy" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="contacto-form-wrapper">
            <h2 className="form-title">Envíanos un mensaje</h2>
            
            {enviado && (
              <div className="alert alert--success">
                ✓ ¡Mensaje enviado con éxito! Te responderemos pronto.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="asunto" className="form-label">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje" className="form-label">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="form-submit"
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>

        {/* Mapa (opcional) */}
        <div className="contacto-map">
          <h2 className="map-title">Encuéntranos</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3639.5828021776906!2d-65.30182992144991!3d-24.186360029070947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941b0f5cb1d29eed%3A0x4e050082af9e760!2sCaff%C3%A9%20Tabac!5e0!3m2!1ses-419!2sar!4v1762822095111!5m2!1ses-419!2sar"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Caffé Tabac"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactoPage;
