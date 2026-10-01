import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(1);

  const countInc = () => {
    if (count < 10) {
      setCount(count + 1);
    }
  };

  const countDec = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div className="counter">
      <button onClick={countDec}>-</button>

      <span className="disp">{count}</span>

      <button onClick={countInc}>+</button>
    </div>
  );
};

export default Counter;