import { useState } from 'react'
import { useBudget } from '../hooks/useBudget'
import { formatCurrency } from '../lib/utils'
import { Plus } from 'lucide-react'

export default function Budget() {
    const { budget, loading, addBudgetItem } = useBudget()
    const [showAdd, setShowAdd] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [newAmount, setNewAmount] = useState('')

    const handleAdd = async (e) => {
        e.preventDefault()
        await addBudgetItem(newCategory, newAmount)
        setNewCategory('')
        setNewAmount('')
        setShowAdd(false)
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 className="text-gradient" style={{ marginBottom: 0 }}>Presupuesto</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="btn btn-primary"
                    style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
                >
                    <Plus size={24} />
                </button>
            </header>

            {showAdd && (
                <form onSubmit={handleAdd} className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <h3>Nueva Categoría</h3>
                    <input
                        placeholder="Nombre (ej. Comida)"
                        className="input"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Presupuesto ($)"
                        className="input"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" onClick={() => setShowAdd(false)} className="btn" style={{ flex: 1, border: '1px solid hsl(var(--color-card-border))' }}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Agregar</button>
                    </div>
                </form>
            )}

            {loading ? (
                <div style={{ textAlign: 'center' }}>Cargando...</div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'hsl(var(--color-bg-tertiary))', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Categoría</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Plan</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Real</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budget.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', opacity: 0.5 }}>
                                        No hay presupuesto definido.
                                    </td>
                                </tr>
                            ) : (
                                budget.map(item => {
                                    const isOverBudget = item.executed_amount > item.projected_amount
                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid hsl(var(--color-card-border))' }}>
                                            <td style={{ padding: '1rem' }}>{item.category_name}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>{formatCurrency(item.projected_amount)}</td>
                                            <td style={{
                                                padding: '1rem',
                                                textAlign: 'right',
                                                fontWeight: 600,
                                                color: isOverBudget ? 'hsl(var(--color-danger))' : 'hsl(var(--color-success))'
                                            }}>
                                                {formatCurrency(item.executed_amount)}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
