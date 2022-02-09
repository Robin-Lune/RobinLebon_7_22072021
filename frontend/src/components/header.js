import React from 'react';
import { useNavigate } from 'react-router-dom';

import { NavLink } from 'react-router-dom';
const Header = (searchQuery,setSearchQuery) => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = "/login";
    };
    
    const history = useNavigate();
    const onSubmit = (e) => {
        history.push(`/search/${searchQuery}`);
        e.preventDefault();
    };
     
    return (
        <div className='headerContainer'>
            <img src="./ressources/icon-left-font.png" alt="Logo de Groupomania" />
            <form action="" className="searchInput" autoComplete='off' onSubmit={onSubmit}>
                <input type="text" placeholder='Rechercher'   onInput={e => setSearchQuery(e.target.value)} name="s"/>
                <div className="search-icon"><i className="fas fa-search "></i></div>
            </form>
           
         
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