import { useEffect, useState } from 'react';
import { Settings, Trash2, X } from 'react-feather';
import styled from 'styled-components';
import { getBadgeStyle } from '../../components/badge';
import { Button } from '../../components/button';
import { CodeMirrorEditor } from '../../components/code-mirror';
import { Input, Label } from '../../components/input';
import { Modal } from '../../components/modal';
import { ensureUrl } from '../../lib/url';
import { useConnections } from '../../state/connection';
import { useBinStore } from '../../state/store';
import { IConnection } from '../../state/types';
import { Message } from './message';

let Wrapper = styled.section`
  border-radius: 10px;
  border: 1px solid var(--gray-4);
  height: 100%;
  background: var(--white);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: calc(100dvh - 90px);
`;

let Title = styled.h1`
  ${getBadgeStyle('var(--primary)')};
`;

let Header = styled.header`
  border-bottom: 1px solid var(--gray-4);
  background: var(--gray-1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  border-radius: 10px 10px 0px 0px;
`;

let HeaderSection = styled.section`
  display: flex;
  gap: 5px;
`;

let Error = styled.div`
  margin-top: 6px;
  color: var(--red);
  font-size: 12px;
  font-weight: 500;
`;

let UrlInput = styled.input`
  flex-grow: 1;
  height: 40px;
  border: 1px solid var(--gray-4);
  border-radius: 8px;
  background: var(--white);
  font-size: 14px;
  padding: 0px 13px;
  outline: none;
`;

let TinyButton = styled(Button)`
  height: 20px;
  width: 20px;
  padding: 0px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--gray-4);
  color: black;

  svg {
    height: 12px;
    width: 12px;
  }
`;

let Messages = styled.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-grow: 1;
`;

let Send = styled.div`
  padding: 20px;
  border-top: 1px solid var(--gray-4);
  flex-shrink: 0;
`;

let Footer = styled.footer`
  padding: 20px;
  text-align: center;
  flex-shrink: 0;
`;

let EmptyState = styled.p`
  padding: 20px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-7);
  text-wrap: balance;
`;

export let Connection = ({ connection }: { connection: IConnection }) => {
  let { updateConnection, toggleConnection, messages, deleteConnection, clearMessages } =
    useBinStore();
  let { activeConnectionIds, connect, send, disconnect } = useConnections();
  let isConnected = activeConnectionIds.includes(connection.id);

  let [error, setError] = useState('');
  let [settingsOpen, setSettingsOpen] = useState(false);

  let [pingMessage, setPingMessage] = useState(() => connection.ping?.message ?? '');
  let [pingInterval, setPingInterval] = useState(() => connection.ping?.interval ?? 0);
  let [name, setName] = useState(() => connection.name ?? '');

  let [message, setMessage] = useState('');
  let [maxMessages, setMaxMessages] = useState(() => 20);

  let [url, setUrl] = useState(() => connection.url ?? '');
  useEffect(() => setUrl(connection.url ?? ''), [connection.url]);

  return (
    <Wrapper>
      <Header>
        <HeaderSection>
          <Title>
            {connection.name} {isConnected && <span>(Active)</span>}
          </Title>

          <div style={{ flexGrow: 1 }} />

          <TinyButton onClick={() => setSettingsOpen(true)} title="Settings">
            <Settings />
          </TinyButton>

          <TinyButton onClick={() => clearMessages(connection.id)} title="Clear Messages">
            <Trash2 />
          </TinyButton>

          <TinyButton onClick={() => toggleConnection(connection.id)} title="Hide Connection">
            <X />
          </TinyButton>
        </HeaderSection>

        <HeaderSection>
          <UrlInput
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter a WebSocket URL"
            onBlur={() =>
              updateConnection(connection.id, { url: ensureUrl(url) || undefined })
            }
            disabled={isConnected}
          />

          <Button
            disabled={!url.trim()}
            onClick={() => {
              if (!ensureUrl(url)) {
                setError('Please enter a valid WebSocket URL');
                return;
              }

              if (isConnected) {
                disconnect(connection.id);
              } else {
                connect(connection.id, url);
              }
            }}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </HeaderSection>

        {error && <Error>{error}</Error>}
      </Header>

      <Messages>
        {(messages[connection.id] ?? []).map(
          (message, i) => i < maxMessages && <Message key={message.id} message={message} />
        )}

        {(messages[connection.id] ?? []).length == 0 && (
          <EmptyState>
            Messages will appear here. Start your connection to send messages to the WebSocket.
          </EmptyState>
        )}

        {(messages[connection.id] ?? []).length > maxMessages && (
          <Footer>
            <Button className="small" onClick={() => setMaxMessages(maxMessages + 20)}>
              Show More
            </Button>
          </Footer>
        )}
      </Messages>

      <Send>
        <CodeMirrorEditor
          value={message}
          onChange={setMessage}
          height="100px"
          readOnly={!isConnected}
        />

        <Button
          className="small"
          style={{ marginTop: '10px' }}
          disabled={!isConnected}
          onClick={() => {
            send(connection.id, message);
            setMessage('');
          }}
        >
          Send Message
        </Button>
      </Send>

      <Modal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Connection Settings"
        description="Update the settings for your connection."
      >
        <form
          onSubmit={e => {
            e.preventDefault();

            updateConnection(connection.id, {
              name,
              ping:
                pingInterval == 0
                  ? undefined
                  : { message: pingMessage, interval: pingInterval }
            });

            setSettingsOpen(false);
          }}
        >
          <Input
            label="Connection Name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter a name for your connection"
          />

          <Input
            label="Ping Interval (in seconds)"
            type="number"
            value={pingInterval}
            onChange={e => setPingInterval(parseInt(e.target.value))}
            min={0}
            step={1}
          />

          <Label style={{ marginTop: '10px' }}>Ping Message</Label>
          <CodeMirrorEditor value={pingMessage} onChange={setPingMessage} height="200px" />

          <Modal.Actions>
            <Button>Save</Button>

            <Button
              className="secondary"
              type="button"
              onClick={() => deleteConnection(connection.id)}
            >
              Delete
            </Button>
          </Modal.Actions>
        </form>
      </Modal>
    </Wrapper>
  );
};
