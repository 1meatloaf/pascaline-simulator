import React, { useState, useEffect } from 'react';
import './Game.css';

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
}

function getAccuracyColor(accuracy) {
  if (accuracy >= 70) return '#4CAF50';
  if (accuracy >= 30) return '#FF9800';
  return '#F44336';
}

const Game = () => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentValue, setCurrentValue] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0, 0, 0]);
  const [guesses, setGuesses] = useState([]);
  const [multiplier, setMultiplier] = useState(1.0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [hint, setHint] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [bestGuesses, setBestGuesses] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [storedValue, setStoredValue] = useState(0);
  const [operation, setOperation] = useState(null);   

  const [gameHistory, setGameHistory] = useState(
    JSON.parse(localStorage.getItem('gameHistory')) || []
  );

  const currentHex = () => {
    const value = Math.abs((currentValue % 0x1000000) + 0x1000000) % 0x1000000;
    return `#${value.toString(16).padStart(6, '0')  .slice(0,6).toUpperCase()}`;
  };  

  const updateWheel = (index, delta) => {
    const newWheels = [...wheels];
    newWheels[index] = (newWheels[index] + delta + 10) % 10;
    setWheels(newWheels);

    const value = newWheels.reduce(
      (acc, val, idx) => acc + val * Math.pow(10, 5 - idx),
      0
    );
    setCurrentValue(value);
    setShowPreview(false);
  };

  const calculateAccuracy = (guessHex) => {
    const extractRGB = (hex) =>
      hex
        .replace('#', '')
        .match(/\w{2}/g)
        .map((x) => parseInt(x, 16));

    const [tr, tg, tb] = extractRGB(targetColor);
    const [gr, gg, gb] = extractRGB(guessHex);

    const distance = Math.sqrt(
      Math.pow(tr - gr, 2) +
        Math.pow(tg - gg, 2) +
        Math.pow(tb - gb, 2)
    );

    return Math.max(0, 100 - (distance / 441.67) * 100).toFixed(1);
  };

  const handleCompare = () => {
    const accuracy = calculateAccuracy(currentHex());
    const newGuess = {
      hex: currentHex(),
      accuracy,
      value: currentValue,
      timestamp: Date.now(),
    };

    const points = Math.round(100 * (accuracy / 100) * multiplier);
    setScore((prev) => Math.max(0, prev + points));

    setGuesses([...guesses, newGuess]);
    setMultiplier((prev) => (prev > 0 ? Math.max(0, prev - 0.1) : -0.5));
    setShowPreview(true);

    if (accuracy < 70) {
      const difference =
        parseInt(targetColor.replace('#', ''), 16) - currentValue;
      setHint(getHint(difference, guesses.length));
    }
  };

  const getHint = (difference, attemptCount) => {
    if (multiplier > 0.4) return 'Keep trying';
    const targetStr = targetColor.replace('#', '').toLowerCase().padStart(6, '0');
    const revealedDigits = Math.min(6, Math.floor((0.4 - multiplier) * 10));

    return `Target starts with: ${targetStr.slice(
      0,
      revealedDigits
    )}${'_'.repeat(6 - revealedDigits)}`;
  };

  const handleLevelEnd = (auto = false) => {
    let finalGuesses = [...guesses];

    if (auto && guesses.length === 0) {
      const accuracy = calculateAccuracy(currentHex());
      finalGuesses = [
        {
          hex: currentHex(),
          accuracy,
          value: currentValue,
          timestamp: Date.now(),
          auto: true,
        },
      ];
    }

    const bestGuess = finalGuesses.reduce((best, curr) =>
      curr.accuracy > best.accuracy ? curr : best
    );
    setBestGuesses((prev) => [...prev, bestGuess]);

    if (level >= 10) {
      setTotalTime(Math.floor((Date.now() - startTime) / 1000));
      localStorage.setItem(
        'gameHistory',
        JSON.stringify([...gameHistory, { score, date: new Date() }])
      );
      setGameEnded(true);
      return;
    }

    setLevel((prev) => prev + 1);
    setTimeLeft(30);
    setTargetColor(generateRandomColor());
    setGuesses([]);
    setMultiplier(1.0);
    setWheels([0, 0, 0, 0]);
    setShowPreview(false);
    setHint('');
  };

  const handleOperation = (op) => {
  
    const validOp = op === '×' ? '*' : op === '÷' ? '/' : op;
    setStoredValue(currentValue);
    setOperation(validOp);
    setWheels([0, 0, 0, 0]);
    setCurrentValue(0);
  };

  const handleCalculate = () => {
    if (!operation || storedValue === null) return;

    let result;
    switch (operation) {
      case '+':
        result = storedValue + currentValue;
        break;
      case '-':
        result = storedValue - currentValue;
        break;
      case '*':
        result = storedValue * currentValue;
        break;
      case '/':
        result = currentValue !== 0 ? Math.trunc(storedValue / currentValue) : 0;
        break;
      default:
        return;
    }

    result = ((result % 0x1000000) + 0x1000000) % 0x1000000;
    setCurrentValue(result);

    const newWheels = [];
    let val = result;
    for (let i=5; i>=0; i--) {
      const divisor = Math.pow(10, i);
      newWheels.unshift(Math.floor(val / divisor) % 10);
      val %= divisor;
    }
    setWheels(newWheels); 

    setOperation(null);
    setStoredValue(null);
  };

  useEffect(() => {
    let timer;
    if (!gameEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameEnded]);

  if (gameEnded)
    return (
      <EndScreen
        score={score}
        bestGuesses={bestGuesses}
        totalTime={totalTime}
      />
    );

  return (
    <div className="game-container">
      {/* Header */}
      <div className="game-header">
        <h2>Level {level}/10</h2>
        <div className={`multiplier ${multiplier <= 0 ? 'negative' : ''}`}>
          Multiplier: {multiplier.toFixed(1)}x
        </div>
        <div className="score">Score: {score}</div>
        <div className="timer">{timeLeft}s remaining</div>
      </div>

      {/* Color Comparison Area */}
      <div className="color-comparison">
        <div
          className="target-color"
          style={{ backgroundColor: targetColor }}
        >
          <span>TARGET</span>
        </div>
        <div
          className="player-color"
          style={{
            backgroundColor: showPreview ? currentHex() : 'transparent',
          }}
        >
          <span>YOUR COLOR</span>
          <div className="hex-value">
            {showPreview && currentHex()}
          </div>
        </div>
      </div>

      <div className="pascaline-interface">
        <div className="wheels">
          {wheels.map((value, index) => (
            <Wheel
              key={index}
              value={value}
              onIncrement={() => updateWheel(index, 1)}
              onDecrement={() => updateWheel(index, -1)}
            />
          ))}
        </div>

        <div className="game-controls">
          <button className="compare-button" onClick={handleCompare}>
            COMPARE
          </button>
          <button className="skip-button" onClick={() => handleLevelEnd()}>
            SKIP LEVEL
          </button>
        </div>
      </div>

      {/* Calculator Operations */}
      <div className="calculator-operations">
        {['+', '-', '×', '÷'].map((op) => (
          <button key={op} onClick={() => handleOperation(op)}>
            {op}
          </button>
        ))}
        <button onClick={handleCalculate}>=</button>
      </div>

      <div className="hint-container">
        {hint && <div className="hint">💡 hint: {hint}</div>}
      </div>

      <GuessHistory
        guesses={guesses}
        bestGuesses={bestGuesses}
        onSelect={(guess) => {
          setCurrentValue(guess.value);
          setShowPreview(true);
        }}
      />
    </div>
  );
};

const Wheel = ({ value, onIncrement, onDecrement }) => (
  <div className="wheel">
    <button onClick={onIncrement}>▲</button>
    <div className="wheel-value">{value}</div>
    <button onClick={onDecrement}>▼</button>
  </div>
);

const GuessHistory = ({ guesses, bestGuesses, onSelect }) => {
  const bestAccuracy =
    guesses.length > 0
      ? Math.max(...guesses.map((g) => g.accuracy))
      : 0;

  return (
    <div className="guess-history">
      <h3>Previous Guesses:</h3>
      {guesses.map((guess, index) => (
        <div
          key={index}
          className={`guess-item ${
            guess.accuracy === bestAccuracy ? 'best-guess' : ''
          }`}
          onClick={() => onSelect(guess)}
        >
          <div
            className="color-swatch"
            style={{ backgroundColor: guess.hex }}
            title={`${guess.hex}`}
          />
        </div>
      ))}
    </div>
  );
};

const EndScreen = ({ score, bestGuesses, totalTime }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="end-screen">
      <h2>Game Complete! 🎉</h2>
      <div className="stats">
        <div>⏱ Total Time: {formatTime(totalTime)}</div>
        <div>🏆 Total Score: {score}</div>
      </div>

      <div className="accuracy-breakdown">
        <h3>Best Accuracy per Level:</h3>
        {bestGuesses.map((guess, index) => (
          <div key={index} className="level-accuracy">
            <span>
              Level {index + 1}: {guess.accuracy}%
            </span>
            <div className="accuracy-bar">
              <div
                className="bar-fill"
                style={{
                  width: `${guess.accuracy}%`,
                  backgroundColor: getAccuracyColor(guess.accuracy),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="play-again"
        onClick={() => window.location.reload()}
      >
        Play Again
      </button>
    </div>
  );
};

export default Game;
