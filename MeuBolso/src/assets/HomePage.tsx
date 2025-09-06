import Navbar from '@/components/Navbar';
import Category from '@/pages/Categories';

import money from '@/assets/money.png';
import couple from '@/assets/couple.png';
import graph  from '@/assets/graph.png';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <h1 className="text-gray-500 bg-brand text-center text-4xl">MeuBolso</h1>
      <div className="min-h-screen flex items-center justify-center gap-40 bg-brand">
        <Category
          label="Conta Pessoal"
          image={money}
          imgClass="-top-10 -left-10 w-24 h-24"
          to="/personal"
        />
        <Category
          label="Conta Casal"
          image={couple}
          imgClass="-bottom-12 left-1/2 -translate-x-1/2 w-28 h-28"
          to="/couple"
        />
        <Category
          label="Objetivos"
          image={graph}
          imgClass="-bottom-10 -right-10 w-24 h-24"
          to="/goals"
        />
      </div>
    </>
  );
}
