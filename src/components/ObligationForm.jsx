import { useState } from 'react'

const OBLIGATION_TYPES = [
    { value: 'credit_card', label: 'Tarjeta de Crédito' },
    { value: 'loan', label: 'Crédito / Préstamo' },
    { value: 'recurring_expense', label: 'Gasto Recurrente' },
]

export default function ObligationForm({ onClose, onSave }) {
    const [type, setType] = useState('credit_card')
    const [formData, setFormData] = useState({
        name: '',
        due_day: '',
        cut_off_day: '',
        current_balance: '',
        fixed_payment_amount: '',
        credit_limit: '',
        months_to_pay: '1',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                name: formData.name,
                type,
                due_day: parseInt(formData.due_day),
                months_to_pay: formData.months_to_pay ? parseInt(formData.months_to_pay) : 1,
            }

            if (type === 'credit_card') {
                payload.cut_off_day = formData.cut_off_day ? parseInt(formData.cut_off_day) : null
                payload.current_balance = formData.current_balance ? parseFloat(formData.current_balance) : 0
                payload.credit_limit = formData.credit_limit ? parseFloat(formData.credit_limit) : 0
            } else if (type === 'loan') {
                payload.current_balance = formData.current_balance ? parseFloat(formData.current_balance) : 0
                payload.fixed_payment_amount = formData.fixed_payment_amount ? parseFloat(formData.fixed_payment_amount) : 0
            } else if (type === 'recurring_expense') {
                payload.fixed_payment_amount = formData.fixed_payment_amount ? parseFloat(formData.fixed_payment_amount) : 0 // "Estimated Amount" maps to fixed_payment_amount
            }

            await onSave(payload)
            onClose()
        } catch (error) {
            console.error(error)
            alert('Error al guardar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Nueva Obligación
                    <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: '1.5rem', padding: 0 }}>&times;</button>
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Type Selector */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--color-text-secondary))' }}>Tipo</label>
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {OBLIGATION_TYPES.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setType(t.value)}
                                    className={`btn ${type === t.value ? 'btn-primary' : ''}`}
                                    style={{
                                        border: type === t.value ? 'none' : '1px solid hsl(var(--color-card-border))',
                                        backgroundColor: type === t.value ? '' : 'transparent',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <input
                        name="name"
                        placeholder="Nombre (ej. Visa, Moto, Arriendo)"
                        className="input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            name="due_day"
                            type="number"
                            min="1" max="31"
                            placeholder="Día de Pago (1-31)"
                            className="input"
                            value={formData.due_day}
                            onChange={handleChange}
                            required
                        />
                        {type === 'credit_card' && (
                            <input
                                name="cut_off_day"
                                type="number"
                                min="1" max="31"
                                placeholder="Día de Corte"
                                className="input"
                                value={formData.cut_off_day}
                                onChange={handleChange}
                            />
                        )}
                    </div>

                    {type === 'credit_card' && (
                        <>
                            <input
                                name="current_balance"
                                type="number"
                                placeholder="Saldo Actual (Deuda Total)"
                                className="input"
                                value={formData.current_balance}
                                onChange={handleChange}
                            />
                            <input
                                name="credit_limit"
                                type="number"
                                placeholder="Cupo Total (Opcional)"
                                className="input"
                                value={formData.credit_limit}
                                onChange={handleChange}
                            />
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>
                                    Meses a diferir (Proyección)
                                </label>
                                <input
                                    name="months_to_pay"
                                    type="number"
                                    min="1"
                                    className="input"
                                    value={formData.months_to_pay}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {type === 'loan' && (
                        <>
                            <input
                                name="current_balance"
                                type="number"
                                placeholder="Deuda Total Restante"
                                className="input"
                                value={formData.current_balance}
                                onChange={handleChange}
                            />
                            <input
                                name="fixed_payment_amount"
                                type="number"
                                placeholder="Cuota Mensual"
                                className="input"
                                value={formData.fixed_payment_amount}
                                onChange={handleChange}
                                required
                            />
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>
                                    Meses a Pagar (Plazo)
                                </label>
                                <input
                                    name="months_to_pay"
                                    type="number"
                                    min="1"
                                    className="input"
                                    value={formData.months_to_pay}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {type === 'recurring_expense' && (
                        <input
                            name="fixed_payment_amount"
                            type="number"
                            placeholder="Valor Estimado"
                            className="input"
                            value={formData.fixed_payment_amount}
                            onChange={handleChange}
                            required
                        />
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ flex: 1, border: '1px solid hsl(var(--color-card-border))', color: 'hsl(var(--color-text-primary))' }}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
