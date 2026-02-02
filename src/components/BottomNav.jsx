import { LayoutDashboard, ListTodo, PieChart } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function BottomNav() {
    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Inicio' },
        { to: '/obligations', icon: ListTodo, label: 'Obligaciones' },
        { to: '/budget', icon: PieChart, label: 'Presupuesto' },
    ]

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'hsl(var(--color-bg-secondary))',
            borderTop: '1px solid hsl(var(--color-card-border))',
            display: 'flex',
            justifyContent: 'space-around',
            padding: 'var(--spacing-sm) 0',
            zIndex: 50
        }}>
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: isActive ? 'hsl(var(--color-accent-primary))' : 'hsl(var(--color-text-muted))',
                        fontSize: '0.75rem',
                        gap: '0.25rem'
                    })}
                >
                    <Icon size={24} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    )
}
