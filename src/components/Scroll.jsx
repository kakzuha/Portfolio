import React, { useRef } from 'react';

function App() {
  const nextSectionRef = useRef(null);

  // Function untuk handle scroll halus
  const scrollToNext = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button onClick={scrollToNext}>
      Scroll ke Next Section
    </button>
  );
}

export default ScrollAnimation