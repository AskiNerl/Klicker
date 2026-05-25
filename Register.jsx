import { useState } from 'react'

function Register({ onAuth }) {
    const [isLoginMode, setIsLoginMode] = useState(true) 
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!username || !password) {
            setMessage('Пожалуйста, заполните все поля. ❌')
            return
        }

        
        const users = JSON.parse(localStorage.getItem('registered_users') || '{}')

        if (isLoginMode) {
           
            if (users[username] && users[username] === password) {
                setMessage(`Рады видеть снова, ${username}!`)
                localStorage.setItem('basket_player', username) 
                setTimeout(() => onAuth(username), 1200)
            } else {
                setMessage('Неверное имя пользователя или пароль! ❌')
            }
        } else {
         
            if (users[username]) {
                setMessage('Этот человек уже зарегистрирован! 😮')
            } else {
                users[username] = password 
                localStorage.setItem('registered_users', JSON.stringify(users))
                localStorage.setItem('basket_player', username)
                setMessage(`Профиль ${username} успешно создан! `)
                setTimeout(() => onAuth(username), 1500)
            }
        }
    }
    
    return (
        <div className="game-container">
            <h1>{isLoginMode ? 'Войти в профиль' : 'Создай профиль'}</h1>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <button type="submit" className="throw-btn" style={{ marginTop: '10px' }}>
                    {isLoginMode ? 'Войти ' : 'Зарегистрироваться'}
                </button>
            </form>
            
          
            <p 
                onClick={() => { setIsLoginMode(!isLoginMode); setMessage(''); }} 
                style={{ color: '#ff9f43', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline', fontSize: '14px' }}
            >
                {isLoginMode ? 'Ещё нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </p>

            {message && <p className="message-text" style={{ marginTop: '20px' }}>{message}</p>}
        </div>
    )
}     

export default Register