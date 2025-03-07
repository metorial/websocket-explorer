import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import styled from 'styled-components';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Modal } from '../../components/modal';
import { useBinStore } from '../../state/store';
import { NavButton } from '../layout/button';

let Item = styled(Select.Item)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-7);

  &.active {
    color: var(--black);
    font-weight: 600;
  }

  &:focus {
    color: var(--primary);
  }

  svg {
    height: 16px;
    width: 16px;
  }
`;

let Content = styled(motion.div)`
  background: rgba(240, 240, 240, 0.9);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-4);
`;

let Viewport = styled(Select.Viewport)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 130px;
`;

let Bin = React.forwardRef(
  (
    {
      children,
      active,
      ...props
    }: { children: React.ReactNode; value: string; active?: boolean },
    forwardedRef
  ) => {
    return (
      <Item className={clsx({ active })} {...props} ref={forwardedRef as any}>
        <Select.ItemText>{children}</Select.ItemText>
      </Item>
    );
  }
);

export let SelectBin = () => {
  let { bins, currentBinId, setBin, addBin } = useBinStore();
  let [addModalOpen, setAddModalOpen] = useState(false);
  let [newBinName, setNewBinName] = useState('');

  useEffect(() => {
    if (addModalOpen) setNewBinName('');
  }, [addModalOpen]);

  return (
    <>
      <Select.Root
        value={currentBinId}
        onValueChange={value => {
          if (value == 'add') {
            setAddModalOpen(true);
          } else {
            setBin(value);
          }
        }}
      >
        <Select.Trigger asChild>
          <NavButton aria-label="Select a bin">
            <Select.Value />
            <Select.Icon>
              <ChevronDown />
            </Select.Icon>
          </NavButton>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content position="popper" sideOffset={5}>
            <Content initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 5 }}>
              <Viewport>
                {bins.map(bin => (
                  <Bin key={bin.id} value={bin.id} active={bin.id == currentBinId}>
                    {bin.name}
                  </Bin>
                ))}

                <Bin value="add">Add Bin</Bin>
              </Viewport>
            </Content>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Bin"
        description="Create a new bin to store your connections in."
      >
        <form
          onSubmit={e => {
            e.preventDefault();

            addBin({ name: newBinName });
            setAddModalOpen(false);
          }}
        >
          <Input
            value={newBinName}
            onChange={e => setNewBinName(e.target.value)}
            placeholder="Enter a name for your bin"
          />

          <Button disabled={!newBinName} type="submit">
            Add Bin
          </Button>
        </form>
      </Modal>
    </>
  );
};
