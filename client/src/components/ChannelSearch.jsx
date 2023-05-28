import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';

import { ResultsDropdown } from './';
import { SearchIcon } from '../assets';

const ChannelSearch = ({ setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();
  const [query, setQuery] = useState(''); // Zustand für die Suchanfrage
  const [loading, setLoading] = useState(false); // Zustand für den Ladezustand
  const [teamChannels, setTeamChannels] = useState([]); // Zustand für Teamkanäle
  const [directChannels, setDirectChannels] = useState([]); // Zustand für Direktkanäle

  useEffect(() => {
    if (!query) {
      setTeamChannels([]); // Setze die Teamkanäle zurück, wenn die Suchanfrage leer ist
      setDirectChannels([]); // Setze die Direktkanäle zurück, wenn die Suchanfrage leer ist
    }
  }, [query]);

  const getChannels = async (text) => {
    try {
      const channelResponse = client.queryChannels({
        type: 'team',
        name: { $autocomplete: text }, // Suche nach Teamkanälen, die den Suchbegriff enthalten
        members: { $in: [client.userID] }, // Suche nach Kanälen, in denen der aktuelle Benutzer Mitglied ist
      });
      const userResponse = client.queryUsers({
        id: { $ne: client.userID }, // Suche nach Benutzern, die nicht der aktuelle Benutzer sind
        name: { $autocomplete: text }, // Suche nach Benutzern, deren Name den Suchbegriff enthält
      });

      const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

      if (channels.length) setTeamChannels(channels); // Setze die gefundenen Teamkanäle
      if (users.length) setDirectChannels(users); // Setze die gefundenen Direktkanäle
    } catch (error) {
      setQuery(''); // Setze die Suchanfrage zurück, wenn ein Fehler auftritt
    }
  };

  const onSearch = (event) => {
    event.preventDefault();

    setLoading(true); // Setze den Ladezustand auf true, um anzuzeigen, dass die Suche im Gange ist
    setQuery(event.target.value); // Aktualisiere die Suchanfrage mit dem eingegebenen Text
    getChannels(event.target.value); // Führe die Suche nach Kanälen und Benutzern durch
  };

  const setChannel = (channel) => {
    setQuery(''); // Setze die Suchanfrage zurück, wenn ein Kanal ausgewählt wurde
    setActiveChannel(channel); // Aktiviere den ausgewählten Kanal
  };

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon /> {/* Symbol für die Suchfunktion */}
        </div>
        <input
          className="channel-search__input__text"
          placeholder="Suche"
          type="text"
          value={query}
          onChange={onSearch} // Handler für Änderungen im Suchfeld
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels} // Gefundene Teamkanäle
          directChannels={directChannels} // Gefundene Direktkanäle
          loading={loading} // Ladezustand
          setChannel={setChannel} // Handler für die Auswahl eines Kanals
          setQuery={setQuery} // Handler zum Aktualisieren der Suchanfrage
          setToggleContainer={setToggleContainer} // Handler für das Container-Verhalten
        />
      )}
    </div>
  );
}

export default ChannelSearch;