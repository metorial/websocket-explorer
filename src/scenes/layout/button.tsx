import styled from 'styled-components';

export let NavButton = styled.button`
  height: 30px;
  padding: 0px 12px;
  border: 1px solid var(--gray-2);
  background: var(--gray-2);
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  transition: all 0.3s ease;

  svg {
    height: 16px;
    width: 16px;
    opacity: 0.7;
  }

  span {
    flex-shrink: 0;
  }

  &.active {
    background: var(--primary);
    color: var(--white);
  }
`;
