import Navbar from '@/components/Navbar';
import React from 'react';
import Calendario from './Calendario';

const Personal = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-6 bg-brand text-black">
        <h1 className="text-2xl font-semibold mb-4">Conta Pessoal</h1>
        <p>Conteúdo da conta pessoal aqui...</p>
        <Calendario />
      </main>
    </>
  );
};


export default Personal;
