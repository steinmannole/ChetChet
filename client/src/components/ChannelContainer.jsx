import React from 'react';
import { Channel, useChatContext, MessageTeam, MessageSimple } from 'stream-chat-react';

import { ChannelInner, CreateChannel, EditChannel } from './';

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType}) => {
  const { channel } = useChatContext();

  if(isCreating) {
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    )
  }

  if(isEditing) {
    return (
      <div className="channel__container">
        <EditChannel setIsCreating={setIsEditing} />
      </div>
    )
  }

  const EmptyState = () => (
    <div className="channel-empty__container">
        <p className="channel-empty__first">Dies ist der Beginn Ihres Chat-Verlaufs.</p>
        <p className="channel-empty__second">Senden Sie Nachrichten, Anhänge, Links, Emojis und mehr!</p>
    </div>
  )

  return (
    <div className="channel__container">
        <Channel
            EmptyStateIndicator={EmptyState}
            Message={(messageProps, i) => <MessageSimple key={i} {...messageProps} />}
        >
            <ChannelInner setIsEditing={setIsEditing}/>
        </Channel>
    </div>
  );
}

export default ChannelContainer