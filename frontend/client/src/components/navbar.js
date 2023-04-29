import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
    return (
        <nav>
            <Link to='/Createcase' state={{ state: this.state }}>createcase</Link>
            <Link to='/Getcase' state={{ state: this.state }}>getcase</Link>
        </nav>
    )
}