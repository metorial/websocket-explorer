import styled from 'styled-components';
import { Nav } from './nav';

let Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
`;

let Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export let Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <Nav />

      <Main>{children}</Main>
    </Wrapper>
  );
};
