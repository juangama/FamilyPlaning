import { Plus } from 'lucide-react'

export default function FAB({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '90px', // Above bottom nav
                right: '20px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--color-accent-primary))',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
                cursor: 'pointer',
                zIndex: 100
            }}
        >
            <Plus size={28} />
        </button>
    )
}
