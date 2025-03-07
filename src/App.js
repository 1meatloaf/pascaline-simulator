import React, { useActionState, useState } from 'react';
import Wheel from './components/Wheel';
import DisplayBar from './components/DisplayBar';
import ModeSwitch from './components/Switch';
import ColorPreview from './components/ColorPreview';
import OperationsPanel from './components/OperationsPanel';
import './App.css';

const App = () => {
  const [mode, setMode] = useState('decimal');
  const [accumulator, setAccumulator] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'decimal' ? 'hex' : 'decimal'));
    setAccumulator(0)
    setWheels([0, 0, 0, 0]);
  };

const updateWheels = (index, delta) => {
  const newWheels = [...wheels];
  const base = mode === 'decimal' ? 10 : 16;
  newWheels[index] = (newWheels[index] + delta + base) % base;
  setWheels(newWheels);
  updateAccumulator(newWheels);
};

  const updateAccumulator = (wheels) => {
    const base = mode === 'decimal' ? 10 : 16;
    const value = wheels.reduce((acc, val, idx) => acc + val * Math.pow(base, wheels.length - idx - 1), 0);
    setAccumulator(value);
  };

  const performOperation = (operation) => {
    const base = mode === 'deeimal' ? 10 : 16;
    let result = accumulator;

    const currentNumber = wheels.reduce((acc, val, idx) => acc + val * Math.pow(base, wheels.length - idx - 1), 0);

    switch (operation) {
      case 'add':
          result += currentNumber;
        break;
      case 'subtract':
        const complement = (Math.pow(base, wheels.length) - 1 - currentNumber);
          result += complement + 1;
        break;
      case 'multiply':
          result *= currentNumber;
        break;
      case 'divide':
        if (currentNumber !== 0) {
          result /= currentNumber;
        } else {
          alert("Cannot divide by zero");
          return;
    }
      break;
      default:
      break;
  };

  result = result % Math.pow(base, wheels.length);

  setAccumulator(result);
  setWheels(Array(wheels.length).fill(0));
  };

  const resetMachine = () => {
    setWheels(mode === 'decimal' ? [9, 9, 9, 9] : [15, 15, 15, 15]);
    setAccumulator(0);
  };

  return (
    <div className='App'>
      <h1>Pascaline Calculator</h1>
      <ModeSwitch mode = {mode} toggleMode={toggleMode} /> 
      <div className='wheels'>
        {wheels.map((value, index) => (
          <Wheel key={index} value={value} onChange={(delta) => updateWheels(index, delta)} />
        ))}
      </div>
      {mode === 'decimal' ? (
        <div className='decimal-mode'>
          <div>Decimal Result: {accumulator}</div>
          <div>Hexadecimal Result: {accumulator.toString(16).toUpperCase()}</div>
          <ColorPreview hexValue={accumulator.toString(16).padStart(6, '0')} />
      </div>
      ) : (
        <div className='hex-mode'>
          <div>Hexadecimal Result: {accumulator.toString(16).toUpperCase()}</div>
          <ColorPreview hexValue={accumulator.toString(16).padStart(6, '0')} />
        </div>
      )}
      <OperationsPanel onOperation={performOperation} onReset = {resetMachine} />
    </div>
  );

};

export default App;
