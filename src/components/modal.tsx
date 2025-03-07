import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'react-feather';
import styled from 'styled-components';
import useDelayed from 'use-delayed';

let Blanket = styled(Dialog.Overlay)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(100, 100, 100, 0.5);
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
`;

let Title = styled(Dialog.Title)`
  font-size: 16px;
  font-weight: 600;
`;

let Description = styled(Dialog.Description)`
  font-size: 14px;
  font-weight: 400;
  margin-top: 6px;
  margin-bottom: 15px;
  opacity: 0.7;
`;

let Header = styled.header`
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
`;

let Content = styled.div`
  transform: translate(-50%, -50%);
  background: var(--gray-2);
  border-radius: 15px;
  padding: 30px;
  max-width: 450px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
`;

let FloatingClose = styled.button`
  height: 30px;
  width: 30px;
  border-radius: 7px;
  background: var(--gray-2);
  border: 1px solid var(--gray-4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    height: 16px;
    width: 16px;
  }

  &:hover,
  &:focus {
    border: 1px solid var(--primary);
  }
`;

export let Modal = Object.assign(
  ({
    title,
    description,
    isOpen,
    onClose,
    children
  }: {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    let openDelayed = useDelayed(isOpen, 300, [true]);
    let showBlanket = useDelayed(isOpen, 100, [false]);

    return (
      <Dialog.Root open={openDelayed} onOpenChange={onClose}>
        <Dialog.Portal>
          <Blanket style={{ opacity: showBlanket ? 1 : 0 }} />

          <Dialog.Content>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 1001 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Content>
                    <Header>
                      <div>
                        <Title>{title}</Title>
                        <Description>{description}</Description>
                      </div>

                      <Dialog.Close asChild>
                        <FloatingClose aria-label="Close">
                          <X />
                        </FloatingClose>
                      </Dialog.Close>
                    </Header>

                    <main>{children}</main>
                  </Content>
                </motion.div>
              )}
            </AnimatePresence>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
  {
    Actions: styled.div`
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    `
  }
);
