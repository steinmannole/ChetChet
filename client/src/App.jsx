import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from './components';

import 'stream-chat-react/dist/css/v2/index.css';
//import 'stream-chat-react/dist/css/index.css' altes v1 Theme von StreamChat
import './style.css';

const cookies = new Cookies();

const apiKey = 'pyd4qmcyb8sc'; // !!! API-Schlüssel für die Stream-Chat-API
const authToken = cookies.get('token'); // Authentifizierungs-Token aus den Cookies

const client = StreamChat.getInstance(apiKey);

// Wenn ein Authentifizierungs-Token vorhanden ist, wird der Benutzer mit dem Stream-Chat-Client verbunden
if (authToken) {
  client.connectUser({
    language: 'de',
    id: cookies.get('userId'),
    name: cookies.get('username'),
    fullName: cookies.get('fullName'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    phoneNumber: cookies.get('phoneNumber'),
  }, authToken);
}

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Wenn kein Authentifizierungs-Token vorhanden ist, wird die Auth-Komponente gerendert
  if (!authToken) return <Auth />;

  const defaultLanguage = 'de';
  // team dark (v1) || str-chat__theme-dark (v2)
  return (
    <div className="app__wrapper">
      <Chat client={client} defaultLanguage={defaultLanguage} theme='str-chat__theme-dark'>
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
        />
      </Chat>
    </div>
  );
};

export default App;