import React, { useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';

import { ChannelInfo } from '../assets';

// Erstellung des GiphyContext-Objekts mit createContext()
export const GiphyContext = React.createContext({});

// Die ChannelInner-Komponente
const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext(); // Zugriff auf die sendMessage-Funktion des Chat-Kontexts

  // Überschreiben des Submit-Handlers für Nachrichten
  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    // Wenn giphyState true ist, wird "/giphy" vor den Text der Nachricht gesetzt
    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }

    // Nachricht mit der aktualisierten Nachrichtenstruktur senden
    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    // Der GiphyContext.Provider wird um den Bereich der Komponente gelegt
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} /> {/* Die TeamChannelHeader-Komponente */}
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} /> {/* Die MessageInput-Komponente */}
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

// Die TeamChannelHeader-Komponente
const TeamChannelHeader = ({ setIsEditing }) => {
  const { channel, watcher_count } = useChannelStateContext(); // Zugriff auf den Kanalzustand und die Anzahl der Beobachter
  const { client } = useChatContext(); // Zugriff auf den Chat-Kontext

  // Komponente für die Anzeige des Messaging-Kopfbereichs
  const MessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
    const additionalMembers = members.length - 3;

    if (channel.type === 'messaging') {
      return (
        <div className='team-channel-header__name-wrapper'>
          {members.map(({ user }, i) => (
            <div key={i} className='team-channel-header__name-multi'>
              <Avatar image={user.image} name={user.fullName || user.id} size={32} />
              <p className='team-channel-header__name user'>{user.fullName || user.id}</p>
            </div>
          ))}

          {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
        </div>
      );
    }

    return (
      <div className='team-channel-header__channel-wrapper'>
        <p className='team-channel-header__name'># {channel.data.name}</p>
        <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
          <ChannelInfo />
        </span>
      </div>
    );
  };

  // Funktion zum Anzeigen des Texts für die Anzahl der Beobachter
  const getWatcherText = (watchers) => {
    if (!watchers) return 'Kein Nutzer online';
    if (watchers === 1) return '1 Nutzer online';
    return `${watchers} Nutzer online`;
  };

  return (
    <div className='team-channel-header__container'>
      <MessagingHeader /> {/* Die MessagingHeader-Komponente */}
      <div className='team-channel-header__right'>
        <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
      </div>
    </div>
  );
};

export default ChannelInner;
