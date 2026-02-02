import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export const useObligations = () => {
    const [obligations, setObligations] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const fetchObligations = async () => {
        if (!user) return
        setLoading(true)
        const { data, error } = await supabase
            .from('financial_obligations')
            .select('*')
            .order('due_day', { ascending: true })

        if (error) {
            console.error('Error fetching obligations:', error)
        } else {
            setObligations(data)
        }
        setLoading(false)
    }

    const addObligation = async (obligation) => {
        const { data, error } = await supabase
            .from('financial_obligations')
            .insert([{ ...obligation, user_id: user.id }])
            .select()

        if (error) {
            throw error
        }
        setObligations([...obligations, data[0]])
        return data[0]
    }

    useEffect(() => {
        fetchObligations()
    }, [user])

    return {
        obligations,
        loading,
        addObligation,
        refreshObligations: fetchObligations
    }
}
