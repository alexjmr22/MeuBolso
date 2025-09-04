import type { CategoryProps } from '@/types';
import { Link } from 'react-router-dom';

export default function Category({ label, image, imgClass, to }: CategoryProps) {
  return (
    <Link to={to} className="group block focus:outline-none">
      <div className="relative cursor-pointer">
        <div
          className="circle bg-white shadow-lg flex items-center justify-center
                        transition-transform duration-300 group-hover:scale-105"
        >
          <p className="text-black text-center">{label}</p>
        </div>
        <img src={image} alt={label} className={`absolute ${imgClass}`} />
      </div>
    </Link>
  );
}
