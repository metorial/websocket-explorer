import { motion } from 'framer-motion';
import { Fragment, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { useBinStore } from '../../state/store';
import { Connection } from './connection';

let Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0px 10px;
`;

let Empty = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;

  span {
    font-size: 50px;
  }

  p {
    font-size: 24px;
    font-weight: 400;
  }
`;

let Handle = styled.div`
  width: 8px;
  height: 100%;
  padding: 10px 0px;
  display: flex;
  margin: 0px 3px;

  & > div {
    width: 8px;
    height: 100%;
    border-radius: 4px;
  }

  &:hover,
  &:active,
  &:focus {
    & > div {
      background: var(--gray-4);
    }
  }
`;

let PanelGroupStyled = styled(PanelGroup)`
  overflow: unset !important;
`;

let PanelStyled = styled(Panel)`
  overflow: unset !important;
`;

export let Connections = () => {
  let { currentConnectionIds, currentBinId, bins } = useBinStore();
  let currentBin = useMemo(
    () => bins.find(bin => bin.id == currentBinId),
    [bins, currentBinId]
  );
  let currentConnections = useMemo(
    () =>
      currentBin?.connections.filter(connection =>
        currentConnectionIds.includes(connection.id)
      ) || [],
    [currentBin, currentConnectionIds]
  );
  let configId = useMemo(() => {
    return [
      currentBinId,
      ...[...currentConnectionIds].sort((a, b) => a.localeCompare(b))
    ].join('-');
  }, [currentBinId, currentConnectionIds]);

  return (
    <Wrapper>
      {currentConnections.length == 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Empty>
            <span>🕵️‍♀️</span>
            <p>Select a connection or add a new one</p>
          </Empty>
        </motion.div>
      ) : (
        <PanelGroupStyled direction="horizontal" id={configId} key={configId}>
          {currentConnections.map((connection, i) => (
            <Fragment key={connection.id}>
              {i != 0 && (
                <PanelResizeHandle>
                  <Handle>
                    <div />
                  </Handle>
                </PanelResizeHandle>
              )}

              <PanelStyled minSize={20}>
                <Connection connection={connection} />
              </PanelStyled>
            </Fragment>
          ))}
        </PanelGroupStyled>
      )}
    </Wrapper>
  );
};
