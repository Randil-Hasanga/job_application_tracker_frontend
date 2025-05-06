import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/check`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          navigate('/login');
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);
}
