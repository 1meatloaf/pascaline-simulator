import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentValue, setCurrentValue] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0]);
  const [guesses, setGuesses] = useState([]); 
  const [multiplier, setMultiplier] = useState(3.0);
  const [timeleft, setTimeLeft] = useState(180);
  const [level, setLevel] = useState(1);


  const currentHex  = () => {
    const hex = Math.abs(currentValue).toString(16).padStart(6, '0').slice9(0, 6);
    return `#${hex}`.toUpperCase();
  };

  const updateWheel = (index, delta) => {
    const newWheels = [...wheels];
    newWheels[index] = (newWheels[index] + delta + 10) % 10;
    setWheels(newWheels);
 

    const value = newWheels.reduce((acc, val, idx) => 
      acc + val * Math.pow(10, 3 - idx), 0);
    setCurrentValue(value);
  };
  
  const calculateAccuracy = (guessHex) => {
    const extractRGB = hex => 
      hex.match(/\w\w/g).map(x => parseInt(x, 16));
    
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
      setGuesses([...guesses, {
        hex: currentHex(),
        accuracy,
        value: currentValue
      }]);

      setMultiplier(prev => prev > 0 ? Math.max(0, prev - 0.1) : -0.5);
    };

    useEffect(() => {
      const timer = level <= 10 && timeleft > 0 && setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      if(timeLeft === 0) handleLevelEnd();
      return () => clearInterval(timer);
    }, [timeLeft]);

    const handleLevelEnd = () => {
      setLevel(level + 1);
      setTimeLeft(180);
      setTargetColor(generateRandomColor());
      setGuesses([]); 
      setMultiplier(3.0);
      setWheels([0, 0, 0, 0]);
    };

  };

  return (
    <div className="App">
      <h1>Pascaline Calculator</h1>

      <div className='switches'>
        <label>
          <input 
            type="checkbox"
            checked={autoCalculate}
            onChange={(e) => setAutoCalculate(e.target.checked)}
          />
          Auto-Calculation
        </label>
      </div>

      <div className="wheels">
        {wheels.map((value, index) => (
          <div key={index}className='wheel'>
            <button onClick={() => updateWheel(index, 1)}>+</button>
            <span>{value}</span>
            <button onClick={() => updateWheel(index, -1)}>-</button>
          </div>
        ))}
      </div>

      <div className='display'>
        Decimal: {accumulator}
      </div>

      <div className='color-preview' style={{ backgroundColor: `#${hexValue}` }}>
        Hex: #{hexValue}
      </div>

      <div className='operations'>
        <button onClick={() => performOperation('add')}>+</button>
        <button onClick={() => performOperation('subtract')}>-</button>
        <button onClick={() => performOperation('multiply')}>x</button>
        <button onClick={() => performOperation('divide')}>÷</button>
        <button onClick={resetMachine}>Reset</button>
      </div>
    </div>
  );
};
const base = 10; // Base for the calculator
export default App;
