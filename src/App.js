import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [accumulator, setAccumulator] = useState(0);
  const [wheels, setWheels] = useState([0, 0, 0, 0]);
  const [autoCalculate, setAutoCalculate] = useState(false);


  const updateWheel = (index, delta) => {
    const newWheels = [...wheels];
    newWheels[index] = (newWheels[index] + delta + 10) % base;
    setWheels(newWheels);
 

    if (autoCalculate) {
      const currentNumber = newWheels.reduce(
        (acc, val, idx) => acc + val * Math.pow(10, 3 - idx), 
        0
      );
      setAccumulator(currentNumber);
    }
  };

  const performOperation = (operation) => {
    const currentNumber = wheels.reduce(
      (acc, val, idx) => acc + val * Math.pow(10, 3 - idx), 
      0
    );
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

  // Reset Calculator
  const resetMachine = () => {
    setWheels([0, 0, 0, 0]);
    setAccumulator(0);
  };

  const hexValue = Math.abs(accumulator).toString(16).padStart(6, '0').slice(0, 6);

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
