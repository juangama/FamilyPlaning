import { useState, useEffect } from 'react'
import { useObligations } from '../hooks/useObligations'
import { useBudget } from '../hooks/useBudget'

export default function TransactionForm({ onClose, onSave }) {
    const { obligations } = useObligations()
    const { budget } = useBudget() // Fetch budget to get categories
    const [loading, setLoading] = useState(false)

    // Filter only credit cards from obligations
    const creditCards = obligations.filter(o => o.type === 'credit_card')

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: '', // Added category
        payment_method: 'cash',
        installments: '',
    })

    const isCreditCardSelected = formData.payment_method !== 'cash' && formData.payment_method !== 'debit'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSave({
                ...formData,
                isCreditCard: isCreditCardSelected,
                obligation_id: isCreditCardSelected ? formData.payment_method : null
            })
            onClose()
        } catch (error) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 110,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Registrar Gasto
                    <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: '1.5rem', padding: 0 }}>&times;</button>
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <input
                        type="number"
                        placeholder="Monto ($)"
                        className="input"
                        required
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        autoFocus
                    />

                    <input
                        type="text"
                        placeholder="Descripción (ej. Almuerzo)"
                        className="input"
                        required
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />

                    {/* Category Selector */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--color-text-secondary))' }}>Categoría (del Presupuesto)</label>
                        <select
                            className="input"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Categoría</option>
                            {budget.map(b => (
                                <option key={b.id} value={b.category_name}>{b.category_name}</option>
                            ))}
                            <option value="Otros">Otros</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--color-text-secondary))' }}>Método de Pago</label>
                        <select
                            className="input"
                            value={formData.payment_method}
                            onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                        >
                            <option value="cash">Efectivo</option>
                            <option value="debit">Tarjeta Débito</option>
                            {creditCards.length > 0 && <optgroup label="Tarjetas de Crédito">
                                {creditCards.map(cc => (
                                    <option key={cc.id} value={cc.id}>{cc.name}</option>
                                ))}
                            </optgroup>}
                        </select>
                    </div>

                    {isCreditCardSelected && (
                        <input
                            type="number"
                            placeholder="Número de Cuotas"
                            className="input"
                            value={formData.installments}
                            onChange={e => setFormData({ ...formData, installments: e.target.value })}
                            required
                        />
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Gasto'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
