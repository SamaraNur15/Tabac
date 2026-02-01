// src/comoponents/Home/RegistroCTA.jsx
import { Link } from 'react-router-dom';
import './RegistroCTA.css';

const RegistroCTA = () => {
  return (
    <section className="registro-cta" aria-label="Sección de registro destacada">
      <div className="registro-contenido">
        <p className="registro-texto">
          ¿Te gustaría trabajar con nosotros?<br />
          <strong>Unente a Tabac</strong>
        </p>
        <Link to="/contacto" className="btn-registro">
          Contactanos
        </Link>
      </div>
    </section>
  );
};

export default RegistroCTA;
