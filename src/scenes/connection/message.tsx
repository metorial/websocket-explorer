import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Badge } from '../../components/badge';
import { Code } from '../../components/code';
import { IMessage, MessageType } from '../../state/types';

let Wrapper = styled.li`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-bottom: 1px solid var(--gray-4);
`;

let Body = styled.div`
  display: flex;
  gap: 10px;
`;

let Aside = styled.aside`
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  time {
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-6);
  }
`;

let Pre = styled.pre`
  margin: 0px;
  font-size: 14px;
`;

let Payload = styled(Pre)`
  word-break: break-all;
  white-space: pre-wrap;
`;

let Text = styled(Pre)`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-7);
`;

export let Message = React.memo(
  ({ message }: { message: IMessage }) => {
    let content = useMemo(() => {
      if (message.type == MessageType.received || message.type == MessageType.sent) {
        try {
          return (
            <Code
              code={JSON.stringify(JSON.parse(message.payload), null, 2)}
              language="json"
            />
          );
        } catch (e) {
          return <Payload>{message.payload}</Payload>;
        }
      }

      return <Text>{message.payload}</Text>;
    }, [message.payload, message.type]);

    return (
      <Wrapper>
        <Body>
          <Aside>
            <Badge
              color={
                {
                  [MessageType.sent]: 'var(--blue)',
                  [MessageType.received]: 'var(--primary)',
                  [MessageType.open]: 'var(--green)',
                  [MessageType.close]: 'var(--orange)',
                  [MessageType.error]: 'var(--red)'
                }[message.type]
              }
            >
              {message.type}
            </Badge>

            <time dateTime={message.createdAt.toISOString()}>
              {message.createdAt.toLocaleTimeString()}
            </time>
          </Aside>
          <main>{content}</main>
        </Body>
      </Wrapper>
    );
  },
  (prev, next) => prev.message.id != next.message.id
);
