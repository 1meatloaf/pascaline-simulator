import React, { useActionState, useState } from 'react';
import Wheel from './components/Wheel';
import Display from './components/Display';
import ModeSwitch from './components/ModeSwitch';
import ColorPreview from './components/ColorPreview';
import OperationsPanel from './components/OperationsPanel';
import './App.css';

const App = () => {
  const [mode, setMode] = useState('decimal');
  const [accumulator, setAccumulator] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0]);
  const [activeWheel, setActiveWheel] = useState(null);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'decimal' ? 'hex' : 'decimal'));
    setAccumulator(0);
    setWheels([0, 0, 0, 0]);
  };

  const updateWheel = (index, delta) => {
    const newWheels = [...wheels];
    const base = mode === 'decimal' ? 10 : 16;
    newWheels[index] = (newWheels[index] + delta + base) % base;
    setWheels(newWheels);
    setActiveWheel(index);
  };

  const performOperation = (operation) => {
    const currentNumber = wheels.reduce((acc, val, idx) => acc + val * Math.pow(mode === 'decimal' ? 10 : 16, wheels.length - idx - 1), 0);
    let result = accumulator;

    switch (operation) {
      case 'add':
        result += currentNumber;
        break;
      case 'subtract':
        result -= currentNumber;
        break;
      case 'multiply':
        result *= currentNumber;
        break;
      case 'divide':
        if (currentNumber !== 0) {
          result /= currentNumber;
        } else {
          alert("Cannot divide by zero!");
          return;
        }
        break;
      default:
        break;
    }

    setAccumulator(result);
    setWheels([0, 0, 0, 0]);
  };

  return (
    <div className="App">
      <h1>Pascaline Calculator</h1>
      <ModeSwitch mode={mode} toggleMode={toggleMode} />
      <div className="wheels">
        {wheels.map((value, index) => (
          <Wheel
            key={index}
            value={value}
            onChange={(delta) => updateWheel(index, delta)}
            isActive={activeWheel === index}
          />
        ))}
      </div>
      <Display value={accumulator} mode={mode} />
      <OperationsPanel onOperation={performOperation} />
      {mode === 'hex' && <ColorPreview hexValue={accumulator.toString(16).padStart(6, '0')} />}
    </div>
  );
};

export default App;
