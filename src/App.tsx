import { useEffect, useState } from 'react';
import { Loader, Text } from '@vibe/core';

import { monday } from './lib/monday';
import { useContext } from './store/context';

interface MondayContext {
  data: {
    boardId: number;
    theme: string;
  };
}

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext();

  async function getPortalContext() {
    setIsLoading(true);

    const response = (await monday.get('context')) as MondayContext;

    context.setTheme(response.data.theme);
    context.setBoardId(response.data.boardId);

    setIsLoading(false);
  }

  useEffect(() => {
    getPortalContext();
  }, []);

  return !isLoading ? (
    <div className={`min-h-screen w-full ${context.theme}-app-theme`}>
      <Text>This is a cool board view template!</Text>
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
