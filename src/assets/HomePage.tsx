import Category from '@/pages/Categories';

import money from '@/assets/money.png';
import couple from '@/assets/couple.png';
import graph from '@/assets/graph.png';
const iconSrc = `${import.meta.env.BASE_URL}Icon.ico`;

export default function HomePage() {
  return (
    <div className="bg-brand min-h-screen flex flex-col">
      <div className="flex justify-center py-10">
        <div className="w-1/3">
          <h1 className="flex items-center justify-center gap-3 p-3 rounded-xl bg-amber-100 shadow text-3xl font-semibold text-black">
            <img src={iconSrc} alt="Meu Bolso" className="h-14 w-14" />
            <span>MeuBolso</span>
          </h1>
        </div>
      </div>
      <main className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center gap-40">
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
      </main>
    </div>
  );
}
