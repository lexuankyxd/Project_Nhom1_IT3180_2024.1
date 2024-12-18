import CheckIfUserTokenExist from '@/components/systemComponents/checkIfUserTokenExist';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

function Index() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(async () => {
      if (await CheckIfUserTokenExist()) {
        router.push('/loginScreen/adreadyLoginScreen');
      } else {
        router.push('/loginScreen/notLoginScreen');
      }
    }, 100);
  }, []); 
}

export default Index;