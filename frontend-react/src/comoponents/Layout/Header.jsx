import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../utils/auth";
import "./Header.css";

function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const updateUser = () => {
      const userData = authService.getUser();
      // Forzar actualización creando un nuevo objeto
      setUser(userData ? { ...userData } : null);
    };

    const handleLogout = () => {
      authService.logout();
      setUser(null);
      navigate('/');
    };


    useEffect(() => {
      // Cargar usuario
      updateUser();
      // Escuchar eventos de login/logout
      window.addEventListener('userChanged', updateUser);

      return () => {
        window.removeEventListener('userChanged', updateUser);
      };
    }, []);

    // Actualizar cuando cambia la ruta
    useEffect(() => {
      updateUser();
    }, [location]);

    // Obtener usuario directamente (como fallback)
    const currentUser = user || authService.getUser();

    const handleNavClick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
       <header className="header">
      <div className="header__inner container">
        <div className="header__brand">
          <NavLink to="/"><img src="/img/logo-tabac.png" alt="Caffé Tabac" className="header__logo" /></NavLink>
        </div>

        <nav className="nav">
          <NavLink to="/" end className="nav__link" onClick={handleNavClick}>
            Inicio
          </NavLink>
          <NavLink to="/carta" className="nav__link" onClick={handleNavClick}>
            Carta
          </NavLink>
          
          <NavLink to="/contacto" className="nav__link" onClick={handleNavClick}>
            Contacto
          </NavLink>
          
          {currentUser && (
            <div className="user-menu">
              <span className="user-greeting">Hola, {currentUser.nombre}</span>
              <button onClick={handleLogout} className="nav__link logout-button">
                Cerrar Sesión
              </button>
            </div>
          )}
        </nav>
      </div>

    </header>
    );
}

export default Header;