import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function Login() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const redirectTo = window.location.origin; // tem de estar nas Redirect URLs do Supabase

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate('/', { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function sendOTP() {
    if (!email) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setSending(false);
    if (error) return alert(error.message);
    alert('Verifica o teu e-mail e clica no link');
  }

  return (
    <div className="min-h-screen bg-brand grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>

        <div className="flex w-full items-center gap-2">
          <Input
            type="email"
            placeholder="o.teu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={sendOTP}
            disabled={!email || sending}
            className= "button-hover"
          >
            {sending ? 'A enviar…' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
