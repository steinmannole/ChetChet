import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
  const handleChange = (event) => {
    event.preventDefault();

    setChannelName(event.target.value);
  };

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p> {/* Anzeige des Texts "Name" */}
      <input value={channelName} onChange={handleChange} placeholder="kanal-name" /> {/* Eingabefeld für den Kanalnamen */}
      <p>Mitglieder hinzufügen</p> {/* Anzeige des Texts "Mitglieder hinzufügen" */}
    </div>
  );
};

const EditChannel = ({ setIsEditing }) => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name); // Zustand für den Kanalnamen
  const [selectedUsers, setSelectedUsers] = useState([]); // Zustand für ausgewählte Benutzer

  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id); // Überprüfen, ob der Kanalname geändert wurde

    if (nameChanged) {
      await channel.update({ name: channelName }, { text: `Kanal-Name geändert zu ${channelName}` }); // Kanalnamen aktualisieren
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers); // Mitglieder zum Kanal hinzufügen
    }

    setIsEditing(false); // Bearbeitungsmodus beenden
  };

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Kanal bearbeiten</p> {/* Anzeige des Texts "Kanal bearbeiten" */}
        <CloseCreateChannel setIsEditing={setIsEditing} /> {/* Schließen-Schaltfläche für die Kanalbearbeitung */}
      </div>
      <ChannelNameInput channelName={channelName} setChannelName={setChannelName} /> {/* Eingabefeld für den Kanalnamen */}
      <UserList setSelectedUsers={setSelectedUsers} /> {/* Benutzerliste zum Hinzufügen von Mitgliedern */}
      <div className="edit-channel__button-wrapper" onClick={updateChannel}>
        <p>Speichern</p> {/* Anzeige des Texts "Speichern" */}
      </div>
    </div>
  );
};

export default EditChannel;
