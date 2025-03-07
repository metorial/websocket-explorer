import styled from 'styled-components';

export let getBadgeStyle = (color: string) => `
  display: inline-block;
  padding: 0px 4px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  color: var(--white);
  width: fit-content;
  margin-bottom: 5px;
  height: 20px;
  line-height: 20px;
  background: ${color};
`;

let BadgeWrapper = styled.span.withConfig({
  shouldForwardProp: prop => !['color'].includes(prop)
})<{ color: string }>`
  ${({ color }) => getBadgeStyle(color)}
`;

export let Badge = ({ color, children }: { color: string; children: React.ReactNode }) => {
  return <BadgeWrapper color={color}>{children}</BadgeWrapper>;
};
