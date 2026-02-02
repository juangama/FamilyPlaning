import { useState, useMemo } from 'react'
import { useObligations } from '../hooks/useObligations'
import PayableList from '../components/PayableList'
import { formatCurrency } from '../lib/utils'
import { ArrowRightLeft } from 'lucide-react'

export default function Dashboard() {
    const { obligations, loading } = useObligations()
    const [quincena, setQuincena] = useState(1) // 1 or 2

    const { filteredItems, totalAmount } = useMemo(() => {
        if (!obligations) return { filteredItems: [], totalAmount: 0 }

        const items = obligations.filter(item => {
            if (quincena === 1) {
                return item.due_day >= 1 && item.due_day <= 15
            } else {
                return item.due_day >= 16 && item.due_day <= 31
            }
        })

        const total = items.reduce((sum, item) => {
            let val = 0
            if (item.type === 'credit_card') {
                val = Number(item.current_balance) || 0
            } else {
                val = Number(item.fixed_payment_amount) || 0
            }
            return sum + val
        }, 0)

        return { filteredItems: items, totalAmount: total }
    }, [obligations, quincena])

    return (
        <div style={{ paddingBottom: '80px' }}>
            <header style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h1 className="text-gradient">Resumen</h1>
                <p>Flujo de caja requerido</p>
            </header>

            {/* Quincena Selector */}
            <div style={{
                display: 'flex',
                backgroundColor: 'hsl(var(--color-bg-tertiary))',
                padding: '0.25rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <button
                    onClick={() => setQuincena(1)}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        backgroundColor: quincena === 1 ? 'hsl(var(--color-bg-secondary))' : 'transparent',
                        color: quincena === 1 ? 'hsl(var(--color-accent-primary))' : 'hsl(var(--color-text-secondary))',
                        fontWeight: 600,
                        boxShadow: quincena === 1 ? 'var(--shadow-sm)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    1ª Quincena
                </button>
                <button
                    onClick={() => setQuincena(2)}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        backgroundColor: quincena === 2 ? 'hsl(var(--color-bg-secondary))' : 'transparent',
                        color: quincena === 2 ? 'hsl(var(--color-accent-primary))' : 'hsl(var(--color-text-secondary))',
                        fontWeight: 600,
                        boxShadow: quincena === 2 ? 'var(--shadow-sm)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    2ª Quincena
                </button>
            </div>

            {/* Summary Card */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, hsl(var(--color-bg-secondary)), hsl(var(--color-bg-tertiary)))',
                marginBottom: 'var(--spacing-xl)',
                textAlign: 'center',
                padding: '2rem 1rem'
            }}>
                <div style={{ color: 'hsl(var(--color-text-secondary))', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Total a Pagar
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'hsl(var(--color-text-primary))' }}>
                    {formatCurrency(totalAmount)}
                </div>
            </div>

            {/* List */}
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Detalle de Pagos</h3>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>Cargando...</div>
                ) : (
                    <PayableList items={filteredItems} />
                )}
            </div>

        </div>
    )
}
