import { GoogleLogin } from '@react-oauth/google';
import AuthApi from 'api/auth.api';
import { useAuth } from 'context/auth.context';
import { useNavigate } from 'react-router-dom';

const GoogleSocial = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async ({ credential: googleToken }) => {
        const { data: user } = await AuthApi.loginWithGoogle(googleToken);
        setUser(user);
        navigate('/dashboard');
      }}
      onError={(error) => {
        console.log('Login Failed', error);
      }}
      useOneTap
      cancel_on_tap_outside={false}
      hosted_domain='elangel.edu.ve' // Optimize which gmails to display (must be an organization)
      shape='pill'
    />
  )
}

export default GoogleSocial;