import { useEffect, useState, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from "@/utils/supabase";

export default function AuthGate({ children }: { children: JSX.Element }) {
  const [uid, setUid] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUid(session?.user?.id ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile && profile.name === '') {
          setNeedsOnboarding(true);
        }
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_e, s) => {
        setUid(s?.user?.id ?? null);
      });

      setReady(true);
      return () => subscription.unsubscribe();
    })();
  }, []);

  if (!ready) return null;
  if (!uid) return <Navigate to="/login" replace />;
  if (needsOnboarding) return <Navigate to="/onboarding" replace />;
  return children;
}
