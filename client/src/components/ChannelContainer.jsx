import React from 'react';
import { Channel, useChatContext, MessageTeam, MessageSimple } from 'stream-chat-react';

import { ChannelInner, CreateChannel, EditChannel } from './';

// Die ChannelContainer-Komponente
const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
  const { channel } = useChatContext(); // Zugriff auf den Chat-Kontext

  // Wenn ein Kanal erstellt wird, wird die CreateChannel-Komponente gerendert
  if (isCreating) {
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    );
  }

  // Wenn ein Kanal bearbeitet wird, wird die EditChannel-Komponente gerendert
  if (isEditing) {
    return (
      <div className="channel__container">
        <EditChannel setIsCreating={setIsEditing} />
      </div>
    );
  }

  // Komponente für den leeren Zustand des Kanals
  const EmptyState = () => (
    <div className="channel-empty__container">
      <p className="channel-empty__first">Dies ist der Beginn Ihres Chat-Verlaufs.</p>
      <p className="channel-empty__second">Senden Sie Nachrichten, Anhänge, Links, Emojis und mehr!</p>
    </div>
  );

  return (
    <div className="channel__container">
      <Channel
        EmptyStateIndicator={EmptyState} // Leerer Zustand des Kanals anzeigen
        Message={(messageProps, i) => <MessageSimple key={i} {...messageProps} />} // Einfache Nachrichtenkomponente
      >
        <ChannelInner setIsEditing={setIsEditing} /> {/* Die ChannelInner-Komponente */}
      </Channel>
    </div>
  );
};

export default ChannelContainer;
