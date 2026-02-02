import { formatCurrency } from '../lib/utils'
import { CalendarDays, AlertCircle } from 'lucide-react'

export default function PayableList({ items }) {
    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--color-text-muted))' }}>
                No hay pagos pendientes para esta quincena.
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map(item => {
                // Determine amount to display based on type
                let amount = 0
                if (item.type === 'credit_card' || item.type === 'loan') {
                    // For dashboard, we might want the fixed quota or minimum payment. 
                    // Requirements say: "Cash Flow Required (Sum of recurring expenses + loan quotas + card payments)"
                    // For Cards: The requirement didn't specify distinct "Minimum Payment" vs "Total Balance" in Schema for Quota.
                    // Yet, typically cash flow needs "Pago Mínimo" or "Estimated Payment".
                    // In Module A, we captured:
                    // - Card: Current Balance (Deuda Total) - but not monthly quota? 
                    //   Actually, Module 2 Summary Cards says "card payments due in this period". 
                    //   But we only have `current_balance`.
                    //   Let's assume for now `current_balance` is what needs to be paid if no other info, 
                    //   OR we should have added a 'monthly_payment' field for cards too.
                    //   Re-reading Module A: "If Type = Tarjeta de Crédito: Ask for Name, Due Day, Cut-off Day, Current Balance."
                    //   It doesn't ask for "Minimum Payment".
                    //   HOWEVER, Module B says "Cash Flow Required... + card payments".
                    //   I'll use `current_balance` as the "To Pay" amount for now, 
                    //   but noting this might be "Total Debt" vs "Monthly Payment". 
                    //   For Loans/Recurring, we have `fixed_payment_amount`.

                    amount = item.type === 'credit_card' ? item.current_balance : item.fixed_payment_amount
                } else {
                    amount = item.fixed_payment_amount
                }

                return (
                    <div key={item.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                backgroundColor: 'hsl(var(--color-bg-primary))',
                                borderRadius: '50%',
                                width: '40px', height: '40px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'hsl(var(--color-accent-primary))'
                            }}>
                                <CalendarDays size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-secondary))' }}>
                                    Vence el día {item.due_day}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: amount > 0 ? 'hsl(var(--color-text-primary))' : 'hsl(var(--color-success))' }}>
                                {formatCurrency(amount)}
                            </div>
                            {item.type === 'credit_card' && (
                                <div className="badge badge-red" style={{ fontSize: '0.6rem', marginTop: '0.2rem', display: 'inline-block' }}>Tarjeta</div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
