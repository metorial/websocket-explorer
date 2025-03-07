import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { ChevronRight, Plus } from 'react-feather';
import styled from 'styled-components';
import { Logo } from '../../components/logo';
import { useBinStore } from '../../state/store';
import { SelectBin } from '../bin/select';
import { BinSettings } from '../bin/settings';
import { NavButton } from './button';

let Outer = styled.div`
  padding: 10px;
`;

let Wrapper = styled.header`
  border-bottom: 1px solid var(--gray-4);
  padding: 0px 20px;
  border-radius: 10px;
  border: 1px solid var(--gray-4);
  background: var(--white);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
`;

let Inner = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

let Section = styled.section`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 50%;
  overflow-x: auto;
  padding: 15px 0px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-2);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-5);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray-7);
  }

  scrollbar-width: thin;
  scrollbar-color: var(--gray-5) var(--gray-2);
`;

let LogoWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  gap: 10px;

  span {
    display: flex;
    align-items: center;
    gap: 5px;

    svg {
      height: 16px;
      width: 16px;
      opacity: 0.5;
    }
  }
`;

let CurrentBin = styled.div`
  position: sticky;
  right: 0;
  display: flex;
  flex-shrink: 0;
  box-shadow: rgba(255, 255, 255, 0.5) -5px 0px 10px 0px;
  border-radius: 7px 0px 0px 7px;
  background: var(--white);
`;

let Link = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-9);
`;

export let Nav = () => {
  let { bins, currentBinId, addConnection, currentConnectionIds, toggleConnection } =
    useBinStore();
  let currentBin = useMemo(
    () => bins.find(bin => bin.id == currentBinId),
    [bins, currentBinId]
  );

  return (
    <Outer>
      <Wrapper>
        <Inner>
          <Section>
            <Link href="https://metorial.com">
              <LogoWrapper>
                <Logo height={30} />

                <span>
                  Metorial <ChevronRight /> Webhook Sandbox
                </span>
              </LogoWrapper>
            </Link>

            <div style={{ overflow: 'hidden' }}>
              <AnimatePresence>
                {currentBin && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', gap: 10 }}
                  >
                    <SelectBin />

                    <BinSettings />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Section>

          <Section>
            <AnimatePresence>
              {currentBin?.connections.map(connection => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, scale: 0.9, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 'auto' }}
                  style={{ flexShrink: 0 }}
                >
                  <NavButton
                    className={clsx({ active: currentConnectionIds.includes(connection.id) })}
                    onClick={() => toggleConnection(connection.id)}
                  >
                    <span>{connection.name}</span>
                  </NavButton>
                </motion.div>
              ))}

              {currentBin && (
                <CurrentBin>
                  <NavButton onClick={() => addConnection(currentBinId!)}>
                    <span>Add Connection</span>
                    <Plus />
                  </NavButton>
                </CurrentBin>
              )}
            </AnimatePresence>
          </Section>
        </Inner>
      </Wrapper>
    </Outer>
  );
};
