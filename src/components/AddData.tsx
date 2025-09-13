import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from "@/utils/supabase";
import { Input } from './ui/input';
import { Button } from './ui/button';

const AddData = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').update({ name }).eq('id', user.id);

    if (error) return alert(error.message);

    navigate('/', { replace: true });
  }
  return (
    <div className="min-h-screen bg-brand grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold">Completa o teu perfil</h1>
        <Input
          type="text"
          placeholder="O teu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={saveProfile} disabled={!name.trim()}>
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default AddData;
