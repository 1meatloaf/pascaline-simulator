import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentValue, setCurrentValue] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0]);
  const [guesses, setGuesses] = useState([]); 
  const [multiplier, setMultiplier] = useState(1.0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [hint, setHint] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [bestGuesses, setBestGuesses] = useState([]);

  const [gameHistory,setGameHistory] = useState(
    JSON.parse(localStorage.getItem('gameHistory')) || []
  );

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
      setScore(prev => Math.max(0, prev + points));

      setGuesses([...guesses, newGuess]);
      setMultiplier(prev => prev > 0 ? Math.max(0, prev - 0.1) : -0.5);
      setShowPreview(true);

      if(accuracy < 70 ) {
        const difference = parseInt(targetColor.replace('#',''), 16) - currentValue;
        setHint(getHint(difference, guesses.length));
      }
    };

    const getHint = (difference, attemptCount) => {
      const absDiff = Math.abs(difference);
      const direction = difference > 0 ? 'higher' : 'lower';

      const hints = [
        { attempts: 3, text: `Try a ${direction} value`},
        { attempts: 5, text: `Focus on ${absDiff > 65535 ? 'red' : absDiff > 255 ? 'green' : 'blue'} chanell`},
        { attempts: 7, text: `Adjust by ~${Math.round(absDiff/1000)} k`}
      ];

      return hints.find(h => attemptCount >= h.attempts)?.text || '';
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
          auto: true
        }];
      }

      const bestGuess = finalGuesses.reduce((best, curr) => 
      curr.accuracy > best.accuracy ? curr : best 
    ); 
    setBestGuesses(prev => [...prev, bestGuess]);

    if (level >= 10) {
      localStorage.setItem('colorPuzzleHistory',
        JSON.stringify([...gameHistory, {score, date: new Data()}])
      );
      setGameEnded(true);
      return;
    }

    setLevel(prev => prev + 1);
    setTimeLeft(45);
    setTargetColor(generateRandomColor());
    setGuesses([]);
    setMultiplier(1.0);
    setWheels([0, 0, 0, 0]);
    setShowPreview(false);
    setHint('');
  };

    useEffect(() => {
      if(timeLeft === 0) handleLevelEnd(true);
    }, [timeLeft]);

    if(gameEnded) return <EndScreen score={score} bestGuesses={bestGuesses} />;
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
