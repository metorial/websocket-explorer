import styled from 'styled-components';

let Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

let InputStyled = styled.input`
  height: 40px;
  border: 1px solid var(--gray-4);
  border-radius: 8px;
  background: var(--white);
  font-size: 14px;
  padding: 0px 13px;
  outline: none;
  flex-grow: 1;
  width: 100%;
  margin-bottom: 10px;
`;

export let Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  padding-bottom: 5px;
  display: block;
`;

export let Input = ({
  label,
  ...props
}: {
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <InputStyled {...props} />
    </Wrapper>
  );
};
