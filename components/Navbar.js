import React from 'react'
import Link from 'next/link'

const Navbar = () => {
return (
    <nav style={{ backgroundColor: '#333', padding: '1rem' }}>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, gap: '2rem' }}>
            <li><Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
            <li><Link href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About</Link></li>
            <li><Link href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</Link></li>
        </ul>
    </nav>
)
}

export default Navbar
