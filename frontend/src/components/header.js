import React from 'react';
import { NavLink } from 'react-router-dom';
const Header = () => {
    return (
        <div className='headerContainer'>
            <img src="./ressources/icon-left-font.png" alt="Logo de Groupomania" />
            <div className="searchInput">
                <input type="search" placeholder='Rechercher' />
                <div className="search-icon"><i class="fas fa-search "></i></div>

            </div>
         
                <nav className="nav-right">
                    <ul className='nav-list'>
                        <li><NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")} ><i class="fas fa-home"></i></NavLink></li>
                        <li><NavLink to="/messages" className={(nav) => (nav.isActive ? "nav-active" : "")} ><i class="far fa-comments"></i></NavLink></li>
                        <li><i class="fas fa-bell"></i></li>
                        <li><NavLink to="/account" className={(nav) => (nav.isActive ? "nav-active" : "")}><i class="fas fa-user-edit"></i></NavLink></li>
                    </ul>
                </nav>
            
        </div>
    );
};

export default Header;