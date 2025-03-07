import React, { useState } from 'react';
import Wheel from './components/Wheel';
import DisplayBar from './components/DisplayBar';
import Switch from './components/Switch';
import ColorPreview from './components/ColorPreview';
// import logo from './logo.svg';
import './App.css';

const App = () => {
  const [accumulator, setAccumulator] = useState(0);
  const [isDecimal, setIsDecimal] = useState(true);
  const [isComplement, setIsComplement] = useState(false); 
  const [wheels, setWheels] = useState([0, 0, 0, 0]);

  const toggleMode = () => setIsDecimal(!isDecimal);

  const updateWheel = (index, delta) => {
    const newWheels = [...wheels];
    newWheels[index] = (newWheels[index] + delta +  (isDecimal ? 10 : 16)) %(isDecimal ? 10 : 16);
    setWheels(newWheels);
    updateAccumulator(newWheels);
  };

  const updateAccumulator = (wheels) => {
    const base = isDecimal ? 10 : 16;
    const value = wheels.reduce((acc, val, idx) => acc + val * Math.pow(base, wheels.length - idx - 1), 0);
    setAccumulator(value);
  };

  const getComplement = (value) => {
    const base = isDecimal ? 10 : 16;
    const max = Math.pow(base, wheels.length) - 1;
    return max - value;
  };

  const resetMachine = () => {
    setWheels([9, 9, 9, 9]);
    setAccumulator(0);
  };

  return (
    <div className='App'>
      <h1>Pascaline Calculator</h1>
      <Switch isDecimal={isDecimal} toggleMode={toggleMode} /> 
      <div className='wheels'>
        {wheels.map((value, index) => (
          <Wheel key={index} value={value} onChange={(delta) => updateWheel(index, delta)} />
        ))}
      </div>
      <DisplayBar value={isComplement ? getComplement(accumulator) : accumulator} isComplement={isComplement} />
      <button onClick={() => setIsComplement(!isComplement)}>Toggle Complement</button>
      <button onClick={resetMachine}>Reset</button>
      {!isDecimal && <ColorPreview hexValue={accumulator.toString(16).padStart(6, '0')} />}
    </div>
  );

};

export default App;
