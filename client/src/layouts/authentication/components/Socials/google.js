import { GoogleLogin } from '@react-oauth/google';
import AuthApi from 'api/auth';
import { useAuth } from 'auth-context/auth.context';
import { useNavigate } from 'react-router-dom';

const GoogleSocial = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async ({ credential: token }) => {
        const userProfile = await AuthApi.loginWithGoogle(token);
        setUser(userProfile);
        navigate('/dashboard');
      }}
      onError={(error) => {
        console.log('Login Failed', error);
      }}
      useOneTap
      hosted_domain='elangel.edu.ve' // Optimize which gmails to display (must be an organization)
      shape='pill'
    />
  )
}

export default GoogleSocial;