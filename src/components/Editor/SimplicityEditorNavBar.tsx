import React, { useState } from "react";
import styled from "styled-components";
import logo from "../../images/transparent_white.png";
import GithubIcon from "../../images/Icons/Github";
import MediumIcon from "../../images/Icons/Medium";
import TelegramIcon from "../../images/Icons/Telegram";
import TwitterIcon from "../../images/Icons/Twitter";
import NpmIcon from "../../images/Icons/Npm";
import HeartIcon from "../../images/Icons/Heart";
import { SponsorModal } from "./SponsorModal";
import { Tooltip, Whisper } from "rsuite";

export const SimplicityEditorNavBar = () => {
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);

  return (
    <ScriptEditorHeaderBar>
      <SponsorModal show={showSponsorModal} close={() => setShowSponsorModal(false)}></SponsorModal>
      <ScriptEditorHeaderLeftSection>
        <ScriptWizLogo src={logo} alt="logo" />

        <ScriptEditorHeaderIconItem href="https://github.com/bit-matrix/script-wiz-lib" target="_blank" rel="noreferrer">
          <GithubIcon width="1rem" height="1rem" />
          <ScriptEditorHeaderIconItemText>Github</ScriptEditorHeaderIconItemText>
        </ScriptEditorHeaderIconItem>

        <ScriptEditorHeaderIconItem href="https://www.npmjs.com/package/@script-wiz/lib" target="_blank" rel="noreferrer">
          <NpmIcon width="2rem" height="2rem" />
          <ScriptEditorHeaderIconItemText>Npm</ScriptEditorHeaderIconItemText>
        </ScriptEditorHeaderIconItem>

        <ScriptEditorHeaderIconItem href="https://twitter.com/script_wizard" target="_blank" rel="noreferrer">
          <TwitterIcon width="0.85rem" height="0.85rem" />
          <ScriptEditorHeaderIconItemText>Twitter</ScriptEditorHeaderIconItemText>
        </ScriptEditorHeaderIconItem>

        <ScriptEditorHeaderIconItem href="https://medium.com/script-wizard" target="_blank">
          <MediumIcon width="0.85rem" height="0.85rem" />
          <ScriptEditorHeaderIconItemText>Medium</ScriptEditorHeaderIconItemText>
        </ScriptEditorHeaderIconItem>

        <ScriptEditorHeaderIconItem href="https://t.me/+bEiJnTeu-mA1ODRk" target="_blank" rel="noreferrer">
          <TelegramIcon width="0.85rem" height="0.85rem" />
          <ScriptEditorHeaderIconItemText>Telegram</ScriptEditorHeaderIconItemText>
        </ScriptEditorHeaderIconItem>
      </ScriptEditorHeaderLeftSection>

      <ScriptEditorHeaderRightSection>
        <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Become a sponsor</Tooltip>}>
          <SponsorButton onClick={() => setShowSponsorModal(true)}>
            <HeartIcon fill="#FF69B4" width="1rem" height="1rem" />
          </SponsorButton>
        </Whisper>
      </ScriptEditorHeaderRightSection>
    </ScriptEditorHeaderBar>
  );
};

const ScriptEditorHeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  height: 3rem;
  width: 100%;
  background: #212121;
`;

const ScriptEditorHeaderLeftSection = styled.div`
  display: flex;
  width: 35rem;
  justify-content: space-between;
  align-items: center;
  color: #fff !important;
`;

const ScriptEditorHeaderRightSection = styled.div`
  display: flex;
  align-items: center;
`;

const ScriptEditorHeaderIconItemText = styled.a`
  margin-left: 0.5rem;
  color: #fff !important;
  text-decoration: none;
`;

const ScriptEditorHeaderIconItem = styled.a`
  display: flex;
  color: #fff !important;
  text-decoration: none;
  display: flex;
  font-size: 0.875rem;
  align-items: center;
  fill: currentColor;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  flex-shrink: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ScriptWizLogo = styled.img.attrs(() => ({
  src: logo,
}))`
  width: 2.7rem;
  margin-left: 1rem;
`;
const SponsorButton = styled.div`
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
  border-radius: 50% !important;
  background: #292d33;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
