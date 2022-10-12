import React, { useState } from "react";
import { Button, Input, InputGroup, Modal, Nav, Tooltip, Whisper } from "rsuite";
import styled from "styled-components";
import CopyIcon from "../../images/Icons/Copy";
import btcQr from "../../images/qrImages/btc.png";
import liquidQr from "../../images/qrImages/liquid.png";

interface SponsorModalProps {
  show: boolean;
  close: () => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ show, close }) => {
  const [activeSponsorType, setActiveSponsorType] = useState<string>("btc");

  const copyToClipboard = () => {
    const btcAddress =
      activeSponsorType === "btc"
        ? "bc1qvhdd984jla9dkr5nad2f6a2wlwt9htucmy3yj3scgmkjymn7usmsjygcta"
        : "VJL9AAstGGHSyF83M6ineuZj3TjQDtykb6zJ5dzxa8fJPUhwEGatuAPjKcBjKKcNeYzicxQ6GostkFoo";

    navigator.clipboard.writeText(btcAddress);
  };

  return (
    <Modal size="sm" open={show} backdrop={false} onClose={close}>
      <Nav activeKey={activeSponsorType} appearance="subtle" onSelect={(sponsorType) => setActiveSponsorType(sponsorType)}>
        <Nav.Item eventKey="btc">BTC</Nav.Item>
        <Nav.Item eventKey="lbtc">L-BTC</Nav.Item>
      </Nav>
      <Modal.Body>
        <SponsorModalBody>{activeSponsorType === "btc" ? <img src={btcQr} alt="btcqr" /> : <img src={liquidQr} alt="lbtcqr" />}</SponsorModalBody>
        <div>
          <InputGroup>
            <SponsorModalAddressInput
              name="input"
              onChange={() => {}}
              value={`${
                activeSponsorType === "btc"
                  ? "bc1qxs7cmf53kqmey0xzt308l0mq2hm35utu45qcjy"
                  : "lq1qqdz4844m679zvpvvnulu6q4zm9nqr4ws2gr7u46xncva5ma3p7yphytwtuc64rtuefs2s45f45nfv9xwk6kgwhrkkauz7xsy2"
              }`}
            />
            <Whisper placement="top" trigger="click" speaker={<Tooltip>Text has been copied to clipboard!</Tooltip>}>
              <InputGroup.Button onClick={copyToClipboard}>
                <CopyIcon width="1rem" height="1rem" />
              </InputGroup.Button>
            </Whisper>
          </InputGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close} appearance="primary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const SponsorModalBody = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const SponsorModalAddressInput = styled(Input)`
  width: 100%;
`;
