import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import FAB from './FAB'
import TransactionForm from './TransactionForm'
import { useAuth } from '../contexts/AuthContext'
import { useTransactions } from '../hooks/useTransactions'

export default function Layout() {
    const { user } = useAuth()
    const [showTransactionForm, setShowTransactionForm] = useState(false)
    const { addTransaction } = useTransactions()

    const handleSaveTransaction = async (data) => {
        await addTransaction(data)
    }

    return (
        <div style={{ paddingBottom: '70px' }}>
            <main className="container">
                <Outlet />
            </main>

            {user && (
                <>
                    <FAB onClick={() => setShowTransactionForm(true)} />
                    <BottomNav />
                    {showTransactionForm && (
                        <TransactionForm
                            onClose={() => setShowTransactionForm(false)}
                            onSave={handleSaveTransaction}
                        />
                    )}
                </>
            )}
        </div>
    )
}
