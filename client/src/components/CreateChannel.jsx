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
      <input value={channelName} onChange={handleChange} placeholder="channel-name" /> {/* Eingabefeld für den Kanalnamen */}
      <p>Mitglieder hinzufügen</p> {/* Anzeige des Texts "Mitglieder hinzufügen" */}
    </div>
  );
};

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']); // Zustand für ausgewählte Benutzer
  const [channelName, setChannelName] = useState(''); // Zustand für den Kanalnamen

  const createChannel = async (e) => {
    e.preventDefault();

    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
      });

      await newChannel.watch();

      setChannelName(''); // Setze den Kanalnamen zurück
      setIsCreating(false); // Beende den Erstellungsprozess
      setSelectedUsers([client.userID]); // Setze die ausgewählten Benutzer zurück
      setActiveChannel(newChannel); // Aktiviere den neu erstellten Kanal
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        <p>{createType === 'team' ? 'Eine Gruppe erstellen' : 'Direkt Nachricht schicken'}</p> {/* Dynamische Anzeige des Texts basierend auf dem Kanaltyp */}
        <CloseCreateChannel setIsCreating={setIsCreating} /> {/* Schließen-Schaltfläche für die Kanalerstellung */}
      </div>
      {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />} {/* Eingabefeld für den Kanalnamen nur für Teamkanäle anzeigen */}
      <UserList setSelectedUsers={setSelectedUsers} /> {/* Benutzerliste zum Hinzufügen von Mitgliedern anzeigen */}
      <div className="create-channel__button-wrapper" onClick={createChannel}>
        <p>{createType === 'team' ? 'Gruppe erstellen' : 'Direkt erstellen'}</p> {/* Dynamische Anzeige des Texts basierend auf dem Kanaltyp */}
      </div>
    </div>
  );
};

export default CreateChannel;
