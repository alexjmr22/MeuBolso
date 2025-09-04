import Navbar from '@/components/Navbar';
import React from 'react';

const Goals = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-6 bg-brand text-black">
        <h1 className="text-2xl font-semibold mb-4">Objetivos</h1>
        <p>Personal goal and our goals for the future</p>
      </main>
    </>
  );
};

export default Goals;
