import { useEffect, useMemo, useState } from 'react';
import { Settings } from 'react-feather';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Modal } from '../../components/modal';
import { useBinStore } from '../../state/store';
import { NavButton } from '../layout/button';

export let BinSettings = () => {
  let { bins, currentBinId, updateBin } = useBinStore();
  let [addModalOpen, setAddModalOpen] = useState(false);

  let currentBin = useMemo(
    () => bins.find(bin => bin.id == currentBinId),
    [bins, currentBinId]
  );

  let [binName, setBinName] = useState('');

  useEffect(() => {
    if (addModalOpen) setBinName(currentBin?.name ?? '');
  }, [addModalOpen, currentBin]);

  return (
    <>
      <NavButton
        onClick={() => setAddModalOpen(true)}
        title="Settings"
        style={{
          padding: 0,
          width: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Settings />
      </NavButton>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Update Bin"
        description="Update the name of your bin."
      >
        <form
          onSubmit={e => {
            e.preventDefault();

            updateBin(currentBin!.id, { name: binName });
            setAddModalOpen(false);
          }}
        >
          <Input
            label="Bin Name"
            value={binName}
            onChange={e => setBinName(e.target.value)}
            placeholder="Enter a name for your bin"
          />

          <Button disabled={!binName} type="submit">
            Save Bin
          </Button>
        </form>
      </Modal>
    </>
  );
};
