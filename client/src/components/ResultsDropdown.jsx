import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

// Funktion, die den Kanal nach Benutzer filtert und den existierenden Kanal aktiviert oder einen neuen Kanal erstellt
const channelByUser = async ({ client, setActiveChannel, channel, setChannel }) => {
  const filters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [client.user.id, client.userID] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) return setActiveChannel(existingChannel);

  const newChannel = client.channel('messaging', { members: [channel.id, client.userID] });

  setChannel(newChannel);

  return setActiveChannel(newChannel);
};

// Komponente für ein einzelnes Suchergebnis
const SearchResult = ({ channel, focusedId, type, setChannel, setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();

  if (type === 'channel') {
    // Rendern des Kanalnamens für Team-Kanäle
    return (
      <div
        onClick={() => {
          setChannel(channel);
          if (setToggleContainer) {
            setToggleContainer((prevState) => !prevState);
          }
        }}
        className={focusedId === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container'}
      >
        <div className='result-hashtag'>#</div>
        <p className='channel-search__result-text'>{channel.data.name}</p>
      </div>
    );
  }

  // Rendern des Benutzernamens und Avatars für Direktnachrichten-Kanäle
  return (
    <div
      onClick={async () => {
        channelByUser({ client, setActiveChannel, channel, setChannel });
        if (setToggleContainer) {
          setToggleContainer((prevState) => !prevState);
        }
      }}
      className={focusedId === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container'}
    >
      <div className='channel-search__result-user'>
        <Avatar image={channel.image || undefined} name={channel.name} size={24} />
        <p className='channel-search__result-text'>{channel.name}</p>
      </div>
    </div>
  );
};

// Komponente für die Dropdown-Liste der Suchergebnisse
const ResultsDropdown = ({ teamChannels, directChannels, focusedId, loading, setChannel, setToggleContainer }) => {

  return (
    <div className='channel-search__results'>
      <p className='channel-search__results-header'>Kanäle</p>
      {loading && !teamChannels.length && (
        <p className='channel-search__results-header'>
          <i>Laden...</i>
        </p>
      )}
      {!loading && !teamChannels.length ? (
        <p className='channel-search__results-header'>
          <i>Keine Kanäle vorhanden.</i>
        </p>
      ) : (
        // Rendern der Team-Kanäle
        teamChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type='channel'
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
      <p className='channel-search__results-header'>Nutzer</p>
      {loading && !directChannels.length && (
        <p className='channel-search__results-header'>
          <i>Laden...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className='channel-search__results-header'>
          <i>Keine Direktnachrichten vorhanden.</i>
        </p>
      ) : (
        // Rendern der Direktnachrichten-Kanäle
        directChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type='user'
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
    </div>
  );
};

export default ResultsDropdown;