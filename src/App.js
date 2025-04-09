import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentValue, setCurrentValue] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0, 0, 0]);
  const [decimalWheels, setDecimalWheels] = useState([0, 0, 0, 0, 0, 0]);
  const [decimalValue, setDecimalValue] = useState(0);
  const [guesses, setGuesses] = useState([]); 
  const [multiplier, setMultiplier] = useState(1.0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [hint, setHint] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [bestGuesses, setBestGuesses] = useState([]);
  const [operation, setOperation] = useState(null);
  const [operand, setOperand] = useState(null);
  const [notification, setNotification] = useState('');
  

  const [gameHistory,setGameHistory] = useState(
    JSON.parse(localStorage.getItem('gameHistory')) || []
  );

  const currentHex  = () => {
    const hex = Math.abs(currentValue).toString(16).padStart(6, '0').slice(0, 6);
    return `#${hex}`.toUpperCase();
  };

  const updateWheel = (index, delta) => {
    const newWheels = [...wheels];
    newWheels[index] = (newWheels[index] + delta + 16) % 16;
    setWheels(newWheels);
 

    const value = newWheels.reduce((acc, val, idx) => 
      acc + val * Math.pow(16, 5 - idx), 0);
    setCurrentValue(value);
    setShowPreview(false);
  };
  
  const calculateAccuracy = (guessHex) => {
    const extractRGB = hex => 
      hex.replace('#','').match(/\w{2}/g).map(x => parseInt(x, 16));
    
    const [tr, tg, tb] = extractRGB(targetColor);
    const [gr, gg, gb] = extractRGB(guessHex);

    const distance = Math.sqrt(
      Math.pow(tr - gr, 2) +
      Math.pow(tg - gg, 2) +
      Math.pow(tb - gb, 2)
    );

  return Math.max(0,100 - (distance / 441.67 * 100)).toFixed(1);
    };

    const handleCompare = () => {
      const accuracy = calculateAccuracy(currentHex());
      const newGuess = {
        hex: currentHex(),
        accuracy,
        value: currentValue,
        timestamp: Date.now()
      };

      const points = Math.round(100 * (accuracy/100) * multiplier);
      setScore((prev) => Math.max(0, prev + points));

      setGuesses([...guesses, newGuess]);
      setMultiplier((prev) => (prev > 0 ? Math.max(0, prev - 0.1) : -0.5));
      setShowPreview(true);

      if(accuracy < 70 ) {
        const difference = parseInt(targetColor.replace('#',''), 16) - currentValue;
        setHint(getHint(difference, guesses.length));
      }
    };

    const getHint = (difference, attemptCount) => {
        if (multiplier > 0.7) return 'keep Trying';
        const targetSrt = targetColor.replace('#','').toLowerCase().padStart(6, '0');
        const revealedDigits = Math.min(6, Math.floor((0.7 - multiplier) * 10));

        return `Target starts with ${targetSrt.slice(0, revealedDigits)}${'_'.repeat(6 - revealedDigits)}`;
    };

    const handleLevelEnd = ( auto = false ) => {
      let finalGuesses = [...guesses];

      if(auto && guesses.length === 0) {
        const accuracy = calculateAccuracy(currentHex());
        finalGuesses =[{
          hex: currentHex(),
          accuracy,
          value: currentValue,
          timestamp: Date.now(),
          auto: true,
        }];
      }

      const bestGuess = finalGuesses.reduce((best, curr) => 
      (curr.accuracy > best.accuracy ? curr : best),
      { accuracy: 0}
);
    setBestGuesses(prev => [...prev, bestGuess]);

    if (level >= 10) {
      localStorage.setItem('gameHistory',
        JSON.stringify([...gameHistory, {score, date: new Date()}])
      );
      setGameEnded(true);
      return;
    }

    setLevel((prev) => prev + 1);
    setTimeLeft(45);
    setTargetColor(generateRandomColor());
    setGuesses([]);
    setMultiplier(1.0);
    setWheels([0, 0, 0, 0, 0, 0]);
    setShowPreview(false);
    setHint('');
    setNotification('');
  };

  const resetLevel = () => {
    setTimeLeft(45);
    setTargetColor(generateRandomColor());
    setGuesses([]);
    setMultiplier(1.0);
    setWheels([0, 0, 0, 0, 0, 0]);
    setShowPreview(false);
    setHint('');
    setNotification('');
  };

  const handleOperation = (op) => {
    setOperand(currentValue);
    setOperation(op);
    setWheels([0, 0, 0, 0, 0, 0]);
  };

  const handleEquals = () => {
    if (operation === '/' && currentValue === 0) {
      setNotification('Invalid: Division by zero is not allowed!');
      return;
    }

      let result;
      switch (operation) {
        case '+':
          result = operand + currentValue;
          break;
        case '-':
          result = operand - currentValue;
          break;
        case '*':
          result = operand * currentValue;
          break;  
        case '/':
          result = currentValue !== 0 ? Math.trunc(operand / currentValue) : 0;
          break;
        default:
          return;
      }

      const clampedResult = result % 0x1000000;
      const absValue = Math.abs(clampedResult);
      const hexStr = absValue.toString(16).padStart(6, '0').slice(-6);
      const newWheels = hexStr.split('').map((char) => parseInt(char, 16));

      setCurrentValue(clampedResult);
      setWheels(newWheels);
      setOperation(null);
      setOperand(null);
  };

  const toggleSign = () => {
    setCurrentValue((prev) => {
      const newValue = -prev;
      const clampedValue = newValue % 0x1000000;
      const absValue = Math.abs(clampedValue);
      const hexStr = absValue.toString(16).padStart(6, '0').slice(-6);
      const newWheels = hexStr.split('').map((char) => parseInt(char, 16));
      setWheels(newWheels);
      return clampedValue;
  }); 
  };

    useEffect(() => {
      let timer;

      if(!gameEnded && timeLeft > 0 ){
        timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        handleLevelEnd(true)
      }
      return () => clearInterval(timer);
    }, [timeLeft, gameEnded]);

    if(gameEnded) return <EndScreen score={score} bestGuesses={bestGuesses} />;

  return (
    <div className="game-container">
      {/* header */}
      <div className='game-header'>
        <h2>level {level}/10</h2>
      <div className={`multiplier ${multiplier <= 0 ? 'negatif' : ''}`}>
        Multiplier: {multiplier.toFixed(1)}x
      </div>
      <div className='score'>Score: {score}</div>
      <div className='timer'>{timeLeft}s remaining</div>
      </div>

      {/* Color Comparison Area */}
      <div className='color-comparison'>
      <span>TARGET:</span>
        <div className='target-color' style={{ backgroundColor: targetColor }}>
          <span style={{ color: '#94a3b8'}}>-</span>
        </div>
        <span>YOUR COLOR:</span>
        <div className='player-color' 
        style={{ backgroundColor: showPreview ? currentHex() : 'transparent'}}>
          <span style={{ color: '#94a3b8'}}>-</span>
          
          
        </div>
        <div className='hex-value'>Hexadecimal: {currentValue < 0 ? '-' : ''}{showPreview && currentHex()}</div>
      </div>

      <div className='reps-hex'>
        <br></br>
        <tr style={{ textAlign: 'center'}}>
          <tr style={{ textAlign: 'left', verticalAlign: "middle" }}>0-9: These represent the values zero through nine</tr>
          <tr style={{ textAlign: 'left', verticalAlign: "middle" }}>A: Represents the value 10.</tr>
          <tr style={{ textAlign: 'left', verticalAlign: "middle" }}>B: Represents the value 11.</tr>
          <tr style={{ textAlign: 'left', verticalAlign: "middle" }}>C: Represents the value 12.</tr>
          <tr style={{ textAlign: 'left', verticalAlign: "middle" }}>D: Represents the value 13.</tr>
          <tr style={{ textAlign: 'left', verticalAlign: "middle" }}>E: Represents the value 14.</tr>
          <tr style={{ textAlign: 'left', verticalAlign: "middle" }}>F: Represents the value 15.</tr>
        </tr>
      </div>

      {notification && <div className='notification'>{notification}</div>}
      <div className='pascaline-interface'>
      <h3 style={{ textAlign: 'center'}}>Hex Wheels</h3>
        <div className='wheels'>
          {wheels.map((value, index) => (
            <Wheel 
              key={index} 
              value={value}
              onIncrement={() => updateWheel(index, 1)}
              onDecrement={() => updateWheel(index, -1)}
            />
          ))}
        </div>



        <div className='game-controls'>
          <button className='compare-button' onClick={handleCompare}>
            COMPARE
          </button>
          <button className='skip-button' onClick={() => handleLevelEnd()}>
            SKIP LEVEL
          </button>
          <button className='skip-button' onClick={() => resetLevel()}>
            RESET LEVEL
          </button>
          <div className='calculator-controls'>
            <button onClick={() => handleOperation('+')}>+</button>
            <button onClick={() => handleOperation('-')}>-</button>
            <button onClick={() => handleOperation('*')}>*</button>
            <button onClick={() => handleOperation('/')}>/</button>
            <button onClick={handleEquals}>=</button>
            <button onClick={toggleSign}>+/-</button>
            
          </div>
        </div>
      </div>

      <div className='hint-container'>
        {hint && <div className='hint'>💡 hint: {hint}</div>}
      </div>

      <GuessHistory
        guesses={guesses}
        bestGuesses={bestGuesses}
        onSelect={guess => {
          setCurrentValue(guess.value);
          setShowPreview(true);
        }}
      /> 
    </div>
    );
  };

  const Wheel = ({ value, onIncrement, onDecrement}) => (
    
    <div className='wheel'>
      
      <button onClick={onIncrement}>▲</button>
      <div className='wheel-value'>{value}</div>
      <button onClick={onDecrement}>▼</button>
    </div>
  );

  const GuessHistory = ({ guesses, bestGuesses, onSelect }) => {
    const bestAccuracy = guesses.length > 0 ? Math.max(...guesses.map(g => g.accuracy)) : 0;

    return (
      <div className='guess-history'>
        <h3>Previous Guesses:</h3>
            {guesses.map((guess, index) => (
              <div 
                key={index} 
                className={`guess-item ${guess.accuracy == bestAccuracy ? 'best-guess' : ''}`}
                onClick={() => onSelect(guess)}
              >
                <div className='color-swatch' style={{ backgroundColor: guess.hex }}/>
                <div className='guess-details'>
                  <div className='hex-code'>{guess.hex}</div>
                  <div className='accuracy-bar'>
                    <div
                      className='bar-fill' 
                      style={{
                        width: `${guess.accuracy}%`,
                        backgroundColor: getAccuracyColor(guess.accuracy)
                      }}
                    >
                      <span className='accuracy-text'>{guess.accuracy}%</span>
                    </div>
                  </div>
                      {guess.auto && <div className='auto-tag'>AUTO</div>}
                </div>
              </div>
            ))}
        </div>
    );
  };



  const EndScreen = ({ score, bestGuesses }) => (
    <div className='end-screen'>
      <h2>Game Complete!</h2>
      <div className='total-score'>Final Score: {score}</div>

      <div className='heatmap'>
        {bestGuesses.map((guess, index) => (
          <div 
            key={index}
            className='heatmap-item'
            style={{
              backgroundColor: guess.hex,
              opacity: guess.accuracy / 100
            }}>
              <span>L{index + 1}</span>
          </div>
        ))}
      </div>

      <button
        className='play-again'
        onClick={() => window.location.reload()}>
          Play Again
        </button>
    </div>
  );

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function getAccuracyColor(accuracy) {
  if(accuracy >= 70) return '#4CAF50';
  if(accuracy >= 30) return '#FF9800';
  return '#F44336';
}

export default Game;