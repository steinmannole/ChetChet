import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';
import Logo from '../assets/icon_round.png';
import LogoutIcon from '../assets/logout.png';

const cookies = new Cookies();

// ProfilBar-Komponente
const ProfilBar = ({ logout }) => (
    <div className="profile-bar">
        <div className="profile__logout">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width="44" />
            </div>
        </div>
    </div>
);

// CompanyHeader-Komponente
const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">ChetChet</p>
    </div>
);

// Benutzerdefinierte Filterfunktion für Team-Kanäle
const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
};

// Benutzerdefinierte Filterfunktion für Messaging-Kanäle
const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
};

// ChannelListContent-Komponente
const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {
    const { client } = useChatContext();

    const logout = () => {
        // Entferne Cookies
        cookies.remove("token");
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');
        cookies.remove('phoneNumber');

        // Lade die Seite neu
        window.location.reload();
    };

    const filters = { members: { $in: [client.userID] } };

    return (
        <>
            {/* ProfilBar-Komponente */}
            <ProfilBar logout={logout} />

            <div className="channel-list__list__wrapper" id="btn">
                {/* CompanyHeader-Komponente */}
                <CompanyHeader />

                {/* ChannelSearch-Komponente */}
                <ChannelSearch setToggleContainer={setToggleContainer} />

                {/* Team-Kanal-Liste */}
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelTeamFilter}
                    List={(listProps) => (
                        <TeamChannelList
                            {...listProps}
                            type="team"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type="team"
                        />
                    )}
                />

                {/* Messaging-Kanal-Liste */}
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter}
                    List={(listProps) => (
                        <TeamChannelList
                            {...listProps}
                            type="messaging"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type="messaging"
                        />
                    )}
                />
            </div>
        </>
    );
};

// ChannelListContainer-Komponente
const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            {/* Desktop-Ansicht */}
            <div className="channel-list__container">
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                />
            </div>

            {/* Responsive-Ansicht */}
            <div
                className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff" }}
            >
                <div
                    className="channel-list__container-toggle"
                    onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}
                ></div>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        </>
    );
};

export default ChannelListContainer;
