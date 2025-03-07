import styled from 'styled-components';
import { Logo } from '../../components/logo';

let Wrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: var(--white);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 18px;
  font-weight: 500;
  gap: 20px;
  padding: 30px;
  text-align: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

export let MobileNotice = () => {
  return (
    <Wrapper>
      <Logo height={60} />

      <span>
        Metorial Webhook Sandbox is not available on mobile. Please use a desktop browser.
      </span>
    </Wrapper>
  );
};
