import React, { useState } from 'react';
import DigitWheel from './Digitwheel';
import './Pascaline.css';

const Pascaline = () => {
  const [digits, setDigits] = useState([0, 0, 0, 0]); // State untuk menyimpan digit


  const updateDigit = (index, newValue) => {
    const newDigits = [...digits];
    newDigits[index] = newValue;
    setDigits(newDigits);
  };


  // const addNumber = (number) => {
  //   let carry = 0;
  //   const newDigits = [...digits];
  //   for (let i = newDigits.length - 1; i >= 0; i--) {
  //     let sum = newDigits[i] + (number % 10) + carry;
  //     if (sum >= 10) {
  //       carry = 1;
  //       sum -= 10;
  //     } else {
  //       carry = 0;
  //     }
  //     newDigits[i] = sum;
  //     number = Math.floor(number / 10);
  //   }
  //   setDigits(newDigits);
  // };


  // const subtractNumber = (number) => {
  //   let borrow = 0;
  //   const newDigits = [...digits];
  //   for (let i = newDigits.length - 1; i >= 0; i--) {
  //     let diff = newDigits[i] - (number % 10) - borrow;
  //     if (diff < 0) {
  //       borrow = 1;
  //       diff += 10;
  //     } else {
  //       borrow = 0;
  //     }
  //     newDigits[i] = diff;
  //     number = Math.floor(number / 10);
  //   }
  //   setDigits(newDigits);
  // };


  // const reset = () => {
  //   setDigits([0, 0, 0, 0]);
  // };

  return (
    <div className="pascaline-container">
      <h1>Pascaline Simulator</h1>
      <div className="digit-number"> </div>
      
      <div className="display">
         {digits.map((digit, index) => (
           <DigitWheel
             key={index}
             value={digit}
             onChange={(newValue) => updateDigit(index, newValue)}
           />
        ))}
      </div>
    </div>
  );
};

  //     <div className="controls">
  //       <input
  //         type="number"
  //         id="inputNumber"
  //         placeholder="Masukkan angka"
  //         min="0"
  //       />
  //       <button onClick={() => addNumber(parseInt(document.getElementById('inputNumber').value, 10))}>
  //         Tambah
  //       </button>
  //       <button onClick={() => subtractNumber(parseInt(document.getElementById('inputNumber').value, 10))}>
  //         Kurangi
  //       </button>
  //       <button onClick={reset}>Reset</button>
  //     </div>
  //   </div>
  // );


export default Pascaline;