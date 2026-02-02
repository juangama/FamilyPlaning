import { formatCurrency } from '../lib/utils'

const TypeGroup = ({ title, items, colorClass }) => {
    if (items.length === 0) return null
    return (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h3 className="text-gradient" style={{ marginBottom: 'var(--spacing-md)' }}>{title} ({items.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {items.map(item => (
                    <div key={item.id} className="card" style={{ padding: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.name}</span>
                            <span className={`badge ${colorClass}`}>Día {item.due_day}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))' }}>
                            {item.type === 'credit_card' && (
                                <>
                                    <div>Saldo: <span style={{ color: 'hsl(var(--color-text-primary))' }}>{formatCurrency(item.current_balance)}</span></div>
                                    {item.cut_off_day && <div>Corte: Día {item.cut_off_day}</div>}
                                </>
                            )}
                            {item.type === 'loan' && (
                                <>
                                    <div>Restante: <span style={{ color: 'hsl(var(--color-text-primary))' }}>{formatCurrency(item.current_balance)}</span></div>
                                    <div>Cuota: <span style={{ color: 'hsl(var(--color-text-primary))' }}>{formatCurrency(item.fixed_payment_amount)}</span></div>
                                </>
                            )}
                            {item.type === 'recurring_expense' && (
                                <div>Valor: <span style={{ color: 'hsl(var(--color-text-primary))' }}>{formatCurrency(item.fixed_payment_amount)}</span></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ObligationList({ obligations }) {
    const cards = obligations.filter(o => o.type === 'credit_card')
    const loans = obligations.filter(o => o.type === 'loan')
    const recurring = obligations.filter(o => o.type === 'recurring_expense')

    if (obligations.length === 0) {
        return <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>No hay obligaciones registradas aún.</div>
    }

    return (
        <div>
            <TypeGroup title="Tarjetas de Crédito" items={cards} colorClass="badge-red" />
            <TypeGroup title="Créditos / Préstamos" items={loans} colorClass="badge-blue" />
            <TypeGroup title="Gastos Recurrentes" items={recurring} colorClass="badge-green" />
        </div>
    )
}
