import React, { useEffect, useState } from 'react';
import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu from '@components/Menu';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';
import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';

import { initaliseModelData, modelOptions, defaultModel } from '@constants/chat';
import { FontSize } from '@type/font-size';

function App()
{
  const [isInitialized, setIsInitialized] = useState(false);

  const initialiseNewChat = useInitialiseNewChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setFontSize = useStore((state) => state.setFontSize);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  if (!isInitialized)
  {
    (async () =>
    {
      var fixDefaultModels = true;

      const initalizeModelDataResult = await initaliseModelData();
      if (!initalizeModelDataResult)
      {
        fixDefaultModels = confirm("Failed getting model data from OpenRouterAI API.\nTry restarting or refreshing.\n\n(Currently default models will be shown that may include deprecated model or invalid information.)\n\nIf you proceed to continue, chats with the model that is not in the current list will be changed to the default model.");
      }

      if (fixDefaultModels)
      {
        const localChats = useStore.getState().chats;
        if (localChats && localChats.length > 0)
        {
          for (var i = 0; i < localChats.length; i++)
          {
            const chat: ChatInterface = localChats[i];
            if (!modelOptions.includes(chat.config.model))
            {
              chat.config.model = defaultModel;
            }
          }
        }
      }      

      setIsInitialized(true);
    })();  
  }

  useEffect(() =>
  {
    document.documentElement.lang = i18n.language;
    i18n.on('languageChanged', (lng) =>
    {
      document.documentElement.lang = lng;
    });
  }, []);

  useEffect(() =>
  {
    // legacy local storage
    const oldChats = localStorage.getItem('chats');
    const apiKey = localStorage.getItem('apiKey');
    const theme = localStorage.getItem('theme');
    const fontSize = localStorage.getItem('fontSize');

    if (apiKey)
    {
      // legacy local storage
      setApiKey(apiKey);
      localStorage.removeItem('apiKey');
    }

    if (theme)
    {
      // legacy local storage
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }

    if (fontSize)
    {
      // legacy local storage
      setFontSize(fontSize as FontSize);
      localStorage.removeItem('fontSize');
    }

    if (oldChats)
    {
      // legacy local storage
      try
      {
        const chats: ChatInterface[] = JSON.parse(oldChats);
        if (chats.length > 0)
        {
          setChats(chats);
          setCurrentChatIndex(0);
        }
        else
        {
          initialiseNewChat();
        }
      } catch (e: unknown)
      {
        console.log(e);
        initialiseNewChat();
      }
      localStorage.removeItem('chats');
    }
    else
    {
      // existing local storage
      const chats = useStore.getState().chats;
      const currentChatIndex = useStore.getState().currentChatIndex;
      if (!chats || chats.length === 0)
      {
        initialiseNewChat();
      }
      if (
        chats &&
        !(currentChatIndex >= 0 && currentChatIndex < chats.length)
      )
      {
        setCurrentChatIndex(0);
      }
    }
  }, []);

  if (!isInitialized)
  {
    return <div>Please wait while the models are being loaded.</div>;
  }

  return (
    <div className='overflow-hidden w-full h-full relative'>
      <Menu />
      <Chat />
      <ApiPopup />
      <Toast />
    </div>
  );
}

export default App;
