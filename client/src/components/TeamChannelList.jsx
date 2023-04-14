import React from 'react'

import { AddChannel } from '../assets';

const TeamChannelList = ({ children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing }) => {
    if(error) {
        return type === 'team' ? (
            <div className="team-channel-list">
                <p className="team-channel-list__message">
                    Verbindungsfehler, bitte warten Sie einen Moment und versuchen Sie es erneut.
                </p>
            </div>
        ) : null;
    }

if(loading) {
    return (
        <div className="team-channel-list">
        <p className="team-channel-list__message loading">
            {type === 'team' ? 'Kanäle' : 'Direkt Nachrichten'} laden...
        </p>
    </div>
    )
}

  return (
    <div className="team-channel-list">
        <div className="team-channel-list__header">
            <p className="team-channel-list__header__title">
                {type === 'team' ? 'Kanäle' : 'Direkt Nachrichten'}
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
  )
}

export default TeamChannelList