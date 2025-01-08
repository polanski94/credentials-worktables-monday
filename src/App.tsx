import { useState } from 'react';
import { Loader, Text } from '@vibe/core';

import { useContext } from './store/context';
import { Credentials } from './components/credentials';

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext();

  return !isLoading ? (
    <div className={`min-h-screen w-full ${context.theme}-app-theme`}>
      <Credentials />
    </div>
  ) : (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-center gap-2 ${context.theme}-app-theme`}
    >
      <Loader size={Loader.sizes.MEDIUM} color={Loader.colors.DARK} />
      <Text>Loading...</Text>
    </div>
  );
}
