import React, { useState } from 'react';
import Digit from './Digit';
import './Pascaline.css';

const Pascaline = () => {
  const [digits, setDigits] = useState([0, 0, 0, 0, 0]); // State untuk menyimpan digit

    // Fungsi konversi angka menjadi array digit
    const convertToDigits = (number) => {
        const digits = [0, 0, 0, 0, 0];
        let temp = number;
        for (let i = digits.length - 1; i >= 0; i--) {
            digits[i] = temp % 10;
            temp = Math.floor(temp / 10);
        }
        return digits;
      };    

  // Fungsi untuk menambahkan angka
  const addNumber = (number) => {
    let carry = 0;
    const newDigits = [...digits];
    for (let i = newDigits.length - 1; i >= 0; i--) {
      let sum = newDigits[i] + (number % 10) + carry;
      if (sum >= 10) {
        carry = 1;
        sum -= 10;
      } else {
        carry = 0;
      }
      newDigits[i] = sum;
      number = Math.floor(number / 10);
    }
    setDigits(newDigits);
  };

  // Fungsi untuk mengurangi angka
  const subtractNumber = (number) => {
    let borrow = 0;
    const newDigits = [...digits];
    for (let i = newDigits.length - 1; i >= 0; i--) {
      let diff = newDigits[i] - (number % 10) - borrow;
      if (diff < 0) {
        borrow = 1;
        diff += 10;
      } else {
        borrow = 0;
      }
      newDigits[i] = diff;
      number = Math.floor(number / 10);
    }
    setDigits(newDigits);
  };

  // Fungsi mengalikan angka 
  const multiplyNumber = () => {
    const multiplier = parseInt(document.getElementById('inputNumber').value, 10);
    if (isNaN(multiplier) || multiplier < 0) return;

    const currentNumber = parseInt(digits.join(''),10);
    const result = Math.floor(currentNumber / multiplier);

    setDigits(convertToDigits(result));
  };

  // Fungsi untuk membagi angka
  const divideNumber = () => {
    const divisor = parseInt(document.getElementById('inputNumber').value, 10);
    if (isNaN(divisor) || divisor <= 0) return;

    const currentNumber = parseInt(digits.join(''), 10);
    const result = Math.floor(currentNumber / divisor);

    setDigits(convertToDigits(result));
  };

  // Fungsi untuk mereset semua digit ke 0
  const reset = () => {
    setDigits([0, 0, 0, 0, 0]);
  };

  return (
    <div className="pascaline-container">
      <h1>Pascaline Simulator</h1>
      <div className="display">
        {digits.map((digit, index) => (
          <Digit key={index} value={digit} />
        ))}
      </div>
      <div className="controls">
        <input
          type="number"
          id="inputNumber"
          placeholder="Masukkan angka"
          min="0"
        />
        <button onClick={() => addNumber(parseInt(document.getElementById('inputNumber').value, 10))}>
          Tambah
        </button>
        <button onClick={() => subtractNumber(parseInt(document.getElementById('inputNumber').value, 10))}>
          Kurangi
        </button>
        <button onClick={() => multiplyNumber(parseInt(document.getElementById('inputNumber').value, 10))}>
          Kali
        </button>
        <button onClick={() => divideNumber(parseInt(document.getElementById('inputNumber').value, 10))}>
          Bagi  
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default Pascaline;