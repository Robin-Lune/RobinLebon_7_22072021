import React from 'react';
import { NavLink } from 'react-router-dom';
const Header = () => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = "/login";
    };
     
    return (
        <div className='headerContainer'>
            <img src="./ressources/icon-left-font.png" alt="Logo de Groupomania" />
            <div className="searchInput">
                <input type="search" placeholder='Rechercher' />
                <div className="search-icon"><i className="fas fa-search "></i></div>

            </div>
         
                <nav className="nav-right">
                    <ul className='nav-list'>
                        <li><NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")} ><i className="fas fa-home"></i></NavLink></li>
                        <li><NavLink to="/messages" className={(nav) => (nav.isActive ? "nav-active" : "")} ><i className="far fa-comments"></i></NavLink></li>
                        <li><i className="fas fa-bell"></i></li>
                        <li><NavLink to="/account" className={(nav) => (nav.isActive ? "nav-active" : "")}><i className="fas fa-user-edit"></i></NavLink></li>
                        <li onClick={handleLogout}><i className="fas fa-sign-out-alt" ></i></li>
                    </ul>
                </nav>
            
        </div>
    );
};

export default Header;