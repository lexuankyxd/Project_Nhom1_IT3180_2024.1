import loadInitialState from '@/components/apiComponents/loadInitialState';
import CheckIfUserTokenExist from '@/components/systemComponents/checkIfUserTokenExist';
import { store } from '@/reduxFolder/store';
import { useRouter, ExpoRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';


function Index() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      if (await CheckIfUserTokenExist()) {
        router.push('/loginScreen/adreadyLoginScreen');
      } else {
        router.push('/loginScreen/notLoginScreen');
      }
    })();
  }, []); 
}

export default Index;