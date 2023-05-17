import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer,  Auth } from './components';

import 'stream-chat-react/dist/css/v2/index.css';
//import 'stream-chat-react/dist/css/index.css'
import './style.css';

const cookies = new Cookies();

const apiKey = 'pyd4qmcyb8sc'; // !!!
const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

if(authToken) {
  client.connectUser({
    language: 'de',
    id: cookies.get('userId'),
    name: cookies.get('username'),
    fullName: cookies.get('fullName'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    phoneNumber: cookies.get('phoneNumber'),
  }, authToken)
}

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if(!authToken) return <Auth />

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
}

export default App
