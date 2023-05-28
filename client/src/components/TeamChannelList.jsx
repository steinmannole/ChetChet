import React from 'react';

import { AddChannel } from '../assets';

// Komponente für die Liste der Team-Kanäle
const TeamChannelList = ({ children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing }) => {
  // Fehlermeldung bei Verbindungsfehler
  if (error) {
    return type === 'team' ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          Verbindungsfehler.
        </p>
      </div>
    ) : null;
  }

  // Anzeige während des Ladens
  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === 'team' ? 'Gruppen' : 'Direkt'} laden...
        </p>
      </div>
    );
  }

  // Rendern der Team-Kanal-Liste
  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === 'team' ? 'Gruppen' : 'Direkt'}
        </p>
        <AddChannel 
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          type={type === 'team' ? 'team' : 'messsaging'}
        />
      </div>
      {children}
    </div>
  );
}

export default TeamChannelList;
