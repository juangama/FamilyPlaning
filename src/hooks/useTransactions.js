import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export const useTransactions = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const addTransaction = async (data) => {
        if (!user) return
        setLoading(true)

        try {
            // 1. Prepare Transaction Data
            const transactionPayload = {
                user_id: user.id,
                amount: parseFloat(data.amount),
                description: data.description,
                payment_method: data.payment_method, // 'cash', 'debit', or obligation_id
                category: data.category, // Optional, can be added later or inferred
                date: new Date().toISOString()
            }

            // Append installments info to description if present
            if (data.installments) {
                transactionPayload.description += ` (${data.installments} cuotas)`
            }

            // 2. Insert Transaction
            const { error: transError } = await supabase
                .from('transactions')
                .insert([transactionPayload])

            if (transError) throw transError

            // 3. Update Credit Card Balance if applicable
            if (data.isCreditCard && data.obligation_id) {
                // Fetch current obligation to be safe or just increment
                // Supabase doesn't support atomic increment easily without RPC, 
                // so we read-then-write or use a clean RPC. 
                // For now: read-then-write (optimized for MVP). 

                const { data: obligation, error: fetchError } = await supabase
                    .from('financial_obligations')
                    .select('current_balance')
                    .eq('id', data.obligation_id)
                    .single()

                if (fetchError) throw fetchError

                const newBalance = (Number(obligation.current_balance) || 0) + parseFloat(data.amount)

                const { error: updateError } = await supabase
                    .from('financial_obligations')
                    .update({ current_balance: newBalance })
                    .eq('id', data.obligation_id)

                if (updateError) throw updateError
            }

            return { success: true }
        } catch (error) {
            console.error('Error adding transaction:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        addTransaction,
        loading
    }
}
