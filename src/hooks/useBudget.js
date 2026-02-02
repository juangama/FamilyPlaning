import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export const useBudget = () => {
    const { user } = useAuth()
    const [budgetItems, setBudgetItems] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    const currentDate = new Date()
    const currentPeriod = format(currentDate, 'yyyy-MMM') // e.g. 2024-Feb

    const fetchData = async () => {
        if (!user) return
        setLoading(true)

        // 1. Fetch Budget Plan
        const { data: budgetData } = await supabase
            .from('budget_items')
            .select('*')
        // .eq('period', currentPeriod) // In a real app we'd filter by period

        if (budgetData) {
            setBudgetItems(budgetData)
        }

        // 2. Fetch Transactions for this month
        const start = startOfMonth(currentDate).toISOString()
        const end = endOfMonth(currentDate).toISOString()

        const { data: transData } = await supabase
            .from('transactions')
            .select('*')
            .gte('date', start)
            .lte('date', end)

        if (transData) {
            setTransactions(transData)
        }

        setLoading(false)
    }

    // Realtime Subscription
    useEffect(() => {
        if (!user) return

        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'transactions',
                },
                (payload) => {
                    console.log('New transaction received!', payload)
                    setTransactions(prev => [...prev, payload.new])
                }
            )
            .subscribe()

        fetchData()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    const addBudgetItem = async (category, amount) => {
        const { data, error } = await supabase
            .from('budget_items')
            .insert([{
                user_id: user.id,
                category_name: category,
                projected_amount: parseFloat(amount),
                period: currentPeriod
            }])
            .select()

        if (data) {
            setBudgetItems([...budgetItems, data[0]])
        }
        return { error }
    }

    // Merge Data
    const budget = useMemo(() => {
        return budgetItems.map(item => {
            // Sum transactions with matching category
            // Note: Category matching by string is fragile but specified in schema comments
            const spent = transactions
                .filter(t => t.category && t.category.toLowerCase() === item.category_name.toLowerCase())
                .reduce((sum, t) => sum + Number(t.amount), 0)

            return {
                ...item,
                executed_amount: spent
            }
        })
    }, [budgetItems, transactions])

    return {
        budget,
        loading,
        addBudgetItem,
        transactions // Exposed for debugging or other views if needed
    }
}
