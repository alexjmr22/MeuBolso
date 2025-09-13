import supabase from '@/utils/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const iconSrc = `${import.meta.env.BASE_URL}Icon.ico`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  }

  const navBtn = 'h-12 rounded-xl px-5'; 

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  const activeClasses = 'bg-brand-light border border-black/10 text-black shadow-inner';
  const inactiveClasses = 'border-black/10';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-brand/95 backdrop-blur flex justify-between items-center py-3 px-4 shadow-md">
      <div className="flex gap-3">
        <Link to="/">
          <Button
            variant="outline"
            className={cn(
              'h-12 w-12 p-0 rounded-xl',
              isActive('/') ? activeClasses : inactiveClasses
            )}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            <img src={iconSrc} alt="Meu Bolso" className="h-7 w-7" />
          </Button>
        </Link>

        <Link to="/personal">
          <Button
            variant="outline"
            className={cn(navBtn, isActive('/personal') ? activeClasses : inactiveClasses)}
            aria-current={isActive('/personal') ? 'page' : undefined}
          >
            Conta Pessoal
          </Button>
        </Link>

        <Link to="/couple">
          <Button
            variant="outline"
            className={cn(navBtn, isActive('/couple') ? activeClasses : inactiveClasses)}
            aria-current={isActive('/couple') ? 'page' : undefined}
          >
            Conta Casal
          </Button>
        </Link>

        <Link to="/goals">
          <Button
            variant="outline"
            className={cn(navBtn, isActive('/goals') ? activeClasses : inactiveClasses)}
            aria-current={isActive('/goals') ? 'page' : undefined}
          >
            Objetivos
          </Button>
        </Link>
      </div>

      <Button
        onClick={handleLogout}
        variant="destructive"
        className="h-12 rounded-xl px-5 text-white hover:bg-red-900"
      >
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
