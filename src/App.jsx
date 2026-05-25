import { useState, useEffect } from 'react'

function App({ username, onLogout }) {
  const scoreKey = `clicker_score_${username}`
  const multKey = `clicker_mult_${username}`
  const autoKey = `clicker_auto_${username}`

  const [count, setCount] = useState(() => {
    const savedScore = localStorage.getItem(scoreKey)
    return savedScore ? parseInt(savedScore, 10) : 0
  })

  const [multiplier, setMultiplier] = useState(() => {
    const savedMult = localStorage.getItem(multKey)
    return savedMult ? parseInt(savedMult, 10) : 1
  })

  const [autoClicker, setAutoClicker] = useState(() => {
    const savedAuto = localStorage.getItem(autoKey)
    return savedAuto ? parseInt(savedAuto, 10) : 0
  })

  const [clicks, setClicks] = useState([])

  const upgradeCost = Math.floor(50 * Math.pow(1.6, multiplier - 1))
  const autoClickerCost = Math.floor(100 * Math.pow(1.4, autoClicker))

  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem(scoreKey, count)
      localStorage.setItem(multKey, multiplier)
      localStorage.setItem(autoKey, autoClicker)
    }, 2000)
    return () => clearInterval(saveInterval)
  }, [count, multiplier, autoClicker, scoreKey, multKey, autoKey])

  useEffect(() => {
    if (autoClicker === 0) return
    const passiveIncome = setInterval(() => {
      setCount(prev => prev + autoClicker)
    }, 1000)
    return () => clearInterval(passiveIncome)
  }, [autoClicker])

  const handlePointerDown = (e) => {
    setCount(prev => prev + multiplier)

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newClick = { id: Date.now() + Math.random(), x, y, val: multiplier }
    
    setClicks(prev => [...prev, newClick])

    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== newClick.id))
    }, 800)
  }

  const buyUpgrade = () => {
    if (count >= upgradeCost) {
      setCount(prev => prev - upgradeCost) 
      setMultiplier(prev => prev + 1)     
    }
  }

  const buyAutoClicker = () => {
    if (count >= autoClickerCost) {
      setCount(prev => prev - autoClickerCost)
      setAutoClicker(prev => prev + 1)
    }
  }

  return (
    <div className="game-container" style={{
      width: '100%',
      maxWidth: '450px',
      margin: '0 auto',
      padding: '25px 20px',
      boxSizing: 'border-box'
    }}>
   
      <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', wordBreak: 'break-word', margin: '0 0 15px 0' }}>
        Добро пожаловать, {username}!
      </h1>
      
      <p className="stat-text" style={{ fontSize: '26px', margin: '15px 0' }}>
        Очки: <strong style={{ color: '#ff9f43' }}>{count}</strong>
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
        <p className="stat-text" style={{ color: '#a4b0be', margin: 0 }}>
          Сила: <strong style={{ color: '#fff' }}>+{multiplier}</strong>
        </p>
        <p className="stat-text" style={{ color: '#a4b0be', margin: 0 }}>
          Авто: <strong style={{ color: '#fff' }}>+{autoClicker}/сек</strong>
        </p>
      </div>
      
      <div style={{ position: 'relative', display: 'inline-block', width: '100%', marginBottom: '20px' }}>
        <button 
          onPointerDown={handlePointerDown} 
          className="throw-btn"
          style={{ width: '100%', padding: '20px 0', fontSize: '22px', margin: '0' }}
        >
          Кликни меня!
        </button>
        
        {clicks.map(click => (
          <span 
            key={click.id} 
            className="floating-number"
            style={{ left: click.x, top: click.y }}
          >
            +{click.val}
          </span>
        ))}
      </div>

      <div style={{ 
        padding: '20px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#ff9f43', fontSize: '18px' }}>Магазин 🛒</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#c8d6e5' }}>
            💪 Прокачка клика (+1)
          </p>
          <button 
            onClick={buyUpgrade} 
            className="throw-btn" 
            disabled={count < upgradeCost} 
            style={{ 
              margin: '0', padding: '12px', width: '100%', fontSize: '16px',
              background: count < upgradeCost ? '#485460' : 'linear-gradient(90deg, #ff9f43, #ff7675)',
              cursor: count < upgradeCost ? 'not-allowed' : 'pointer'
            }}
          >
            {count < upgradeCost ? `Нужно ${upgradeCost}` : `Купить за ${upgradeCost}`}
          </button>
        </div>

        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#c8d6e5' }}>
          Авто кликер (+1/сек)
          </p>
          <button 
            onClick={buyAutoClicker} 
            className="throw-btn" 
            disabled={count < autoClickerCost} 
            style={{ 
              margin: '0', padding: '12px', width: '100%', fontSize: '16px',
              background: count < autoClickerCost ? '#485460' : 'linear-gradient(90deg, #20bf6b, #0fb9b1)',
              cursor: count < autoClickerCost ? 'not-allowed' : 'pointer'
            }}
          >
            {count < autoClickerCost ? `Нужно ${autoClickerCost}` : `Купить за ${autoClickerCost}`}
          </button>
        </div>
      </div>

      <button onClick={onLogout} className="reset-btn" style={{ marginTop: '25px', width: '100%', marginLeft: '0' }} >
        Выйти
      </button>
    </div>
  )
}

export default App