import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await signIn({ email, password })
        if (error) {
            setError(error.message)
        } else {
            navigate('/')
        }
        setLoading(false)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 'var(--spacing-lg)' }}>
            <h1 className="text-gradient">FamilyFlow</h1>
            <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <h2>Iniciar Sesión</h2>
                {error && <div style={{ color: 'hsl(var(--color-danger))', fontSize: '0.9rem' }}>{error}</div>}
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Cargando...' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}
