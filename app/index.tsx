import { router, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import CheckLoginCondition from '@/components/checkLoginCondition';

function Index() {
  const router = useRouter();

  useEffect(() => {
    const condition = CheckLoginCondition();
    setTimeout(() => {
      if (condition == true) {
        router.push('/mainScreen');
      } else {
        router.push('/mainScreen');
      }
    }, 100);
  }, []); 
}

export default Index;