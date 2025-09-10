import supabase from '@/utils/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
const iconSrc = `${import.meta.env.BASE_URL}Icon.ico`;

const Navbar = () => {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-brand flex justify-between items-center p-5 shadow-md">
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="outline">
            <img src={iconSrc} alt="Meu Bolso" className="h-14 w-14" />
          </Button>
        </Link>
        <Link to="/personal">
          <Button variant="outline">Conta Pessoal</Button>
        </Link>
        <Link to="/couple">
          <Button variant="outline">Conta Casal</Button>
        </Link>
        <Link to="/goals">
          <Button variant="outline">Objetivos</Button>
        </Link>
      </div>
      <Button onClick={handleLogout} variant="destructive" className="text-white hover:bg-red-900">
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
