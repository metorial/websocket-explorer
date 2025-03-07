import styled from 'styled-components';

let ButtonStyled = styled.button`
  height: 40px;
  padding: 0px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  background: var(--primary);
  color: var(--white);
  border: none;

  svg {
    height: 16px;
    width: 16px;
  }

  span {
    flex-shrink: 0;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.size-1 {
    height: 34px;
    padding: 0px 12px;

    svg {
      height: 12px;
      width: 12px;
    }
  }

  &.secondary {
    background: var(--gray-2);
    color: var(--gray-9);
  }
`;

export let Button = ({
  variant,
  size,
  ...props
}: {
  variant?: 'primary' | 'secondary';
  size?: 1 | 2;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <ButtonStyled className={`${variant ?? 'primary'} size-${size ?? 2}`} {...props} />;
};
