import React from 'react'
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';
import Logo from '../assets/icon_round.png'
import LogoutIcon from '../assets/logout.png'

const cookies = new Cookies();

const SideBar = ({ logout }) => (
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <img src={Logo} alt="ChetChet" width="45" />
            </div>
        </div>
        <div className="channel-list__sidebar__icon2">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width="30" />
            </div>
        </div>
    </div>
);

const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">ChetChet - WIP</p>
    </div>
)

const ChannelListContainer = () => {
    const logout = () => {
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('fullName');
    cookies.remove('avatarURL');
    cookies.remove('hashedPassword');
    cookies.remove('phoneNumber');
    cookies.remove("token");

    window.location.reload();
    }

  return (
    <>
        <SideBar logout={logout} />
        <div className="channel-list__list__wrapper">
            <CompanyHeader />
            <ChannelSearch />
            <ChannelList 
                filters={{}}
                channelRenderFilterFn={() => {}}
                List={(listProps) => (
                    <TeamChannelList 
                        {... listProps}
                        type="team"
                  />
                )} 
                Preview={(previewProbs) => (
                    <TeamChannelPreview 
                        {...previewProbs}
                        type="team"
                    />
                )}
            />
            <ChannelList 
                filters={{}}
                channelRenderFilterFn={() => {}}
                List={(listProps) => (
                    <TeamChannelList 
                        {... listProps}
                        type="messaging"
                  />
                )} 
                Preview={(previewProbs) => (
                    <TeamChannelPreview 
                        {...previewProbs}
                        type="messaging"
                    />
                )}
            />
        </div>
    </>
  );
}

export default ChannelListContainer;