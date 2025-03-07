import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useRef } from 'react';
import { sparkTheme } from './theme';

export let CodeMirrorEditor = ({
  value,
  onChange,
  height,
  readOnly
}: {
  height: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) => {
  let onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  let onChangeCached = useCallback((value: string) => {
    onChangeRef.current(value);
  }, []);

  return (
    <div
      style={{
        border: '1px solid var(--gray-4)',
        borderRadius: 7,
        overflow: 'hidden'
      }}
    >
      <CodeMirror
        value={value}
        height={height}
        extensions={[json()]}
        onChange={onChangeCached}
        readOnly={readOnly}
        theme={sparkTheme}
      />
    </div>
  );
};
