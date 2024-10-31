import { useEffect, useState } from 'react';
import { Loader, Text } from 'monday-ui-react-core';

import { monday } from './lib/monday';
import { useContext } from './store/context';

import DocumentUpload from './DocumentUpload';

interface MondayContext {
  data: {
    boardId: number;
    theme: string;
    itemIds?: string[];
  };
}

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const context = useContext();

  async function getPortalContext() {
    setIsLoading(true);

    const response = await monday.get('context');
    console.log(response);
    await context.setTheme(response.data.theme);
    await context.setBoardId(response.data.boardId);

    if (response.data.boardId) {
      await fetchItemsData(response.data.itemIds);
    } else {
      monday.execute('notice', 'Error');
    }
    //monday.listen('itemIds', fetchItemsData as any);
  }

  async function fetchItemsData() {
    try {
      console.log('✨', context.boardId);

      const query = `query {
      boards(ids: 7751362097) {
        description
        name
        items_page(limit:500) {
          items {
            id
            name
            column_values {
              id
              value
              type
              text
            }
            subitems {
              id
              name
              column_values {
                id
                value
                type
                text
              }
            }
          }
        }
      }
      }`;
      console.log('✨✨', query);
      const response: any = await monday.api(query);
      //setItems(response.data.boards[0].items_page.items);
      context.setBoardData({
        name: response.data.boards[0].name,
        description: response.data.boards[0].description,
      });
      context.setItemData(response.data.boards[0].items_page.items);

      console.log(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  useEffect(() => {
    getPortalContext();
  }, []);

  return !isLoading ? (
    <div className={`min-h-screen w-full ${context.theme}-app-theme`}>
      <DocumentUpload />
    </div>
  ) : (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-center gap-2 ${context.theme}-app-theme`}
    >
      <Loader size={Loader.sizes.MEDIUM} color={Loader.colors.DARK} />
      <Text>Loading board data...</Text>
    </div>
  );
}
