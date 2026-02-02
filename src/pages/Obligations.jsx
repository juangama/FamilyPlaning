import { useState } from 'react'
import { useObligations } from '../hooks/useObligations'
import ObligationList from '../components/ObligationList'
import ObligationForm from '../components/ObligationForm'
import { Plus } from 'lucide-react'

export default function Obligations() {
    const { obligations, loading, addObligation } = useObligations()
    const [showForm, setShowForm] = useState(false)

    const handleSave = async (data) => {
        await addObligation(data)
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ marginBottom: 0 }}>Obligaciones</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary"
                    style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
                >
                    <Plus size={24} />
                </button>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando...</div>
            ) : (
                <ObligationList obligations={obligations} />
            )}

            {showForm && (
                <ObligationForm
                    onClose={() => setShowForm(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}
