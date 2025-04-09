import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentValue, setCurrentValue] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0]);
  const [guesses, setGuesses] = useState([]); 
  const [multiplier, setMultiplier] = useState(3.0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [level, setLevel] = useState(1);


  const currentHex  = () => {
    const hex = Math.abs(currentValue).toString(16).padStart(6, '0').slice(0, 6);
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
      const timer = level <= 10 && timeLeft > 0 && setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      if(timeLeft === 0) handleLevelEnd();
      return () => clearInterval(timer);
    }, [timeLeft]);

    const handleLevelEnd = () => {
      setLevel(level + 1);
      setTimeLeft(10);
      setTargetColor(generateRandomColor());
      setGuesses([]); 
      setMultiplier(3.0);
      setWheels([0, 0, 0, 0]);
    };

  return (
    <div className="game-container">
      {/* header */}
      <div className='game-header'>
        <h2>level {level}/10</h2>
      <div className="multiplier-badge">
        Multiplier: {multiplier.toFixed(1)}x
      </div>
      <div className='timer'>{timeLeft}s remaining</div>
      </div>

      {/* Color Comparison Area */}
      <div className='color-comparison'>
        <div className='target-color' style={{ backgroundColor: targetColor }}>
          <span>TARGET</span>
        </div>
        <div className='player-color' style={{ backgroundColor: currentHex() }}>
          <span>YOUR COLOR</span>
          <div className='hex-value'>{currentHex()}</div>
        </div>
      </div>

      <div className='pascaline-interface'>
        <div className='wheels'>
          {wheels.map((value, index) => (
            <div key={index} className='wheel'>
              <button onClick={() => updateWheel(index, 1)}>▲</button>
              <div className='wheel-value'>{value}</div>
              <button onClick={() => updateWheel(index, -1)}>▼</button>
            </div>
          ))}
        </div>

        <div className='game-controls'>
          <button className='compare-button' onClick={handleCompare}>
            COMPARE
          </button>
          <button className='skip-button' onClick={handleLevelEnd}>
            SKIP LEVEL
          </button>
        </div>
      </div>

      {/* Guesses History */}
      <div className='guess-history'>
        <h3>Previous Guesses:</h3>
        {guesses.map((guess, index) => (
          <div key={index} className='guess-item'>
            <div className='color-swatch' 
                 style={{ backgroundColor: guess.hex }}/>
            <div className='guess-details'>
              <div>{guess.hex}</div>
              <div>{guess.accuracy}% match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export default Game;
