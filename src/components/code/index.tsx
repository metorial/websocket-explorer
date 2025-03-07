import Highlight, { defaultProps } from 'prism-react-renderer';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from './theme';

let Pre = styled.pre`
  text-align: left;
  margin: 0;
  overflow: auto;
  font-size: 13px;
  line-height: 1.5;
  font-family: 'Overpass Mono', Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
    'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace, serif;
`;

let Line = styled.div`
  display: table-row;
`;

let LineContent = styled.span`
  display: table-cell;
`;

export let Code = ({ language, code }: { language?: string; code?: string }) => {
  let [lang, setLang] = useState(() => language ?? 'plain');

  useEffect(() => {
    if (language && language != lang) return setLang(language);
  }, [language, lang]);

  return (
    <Highlight {...defaultProps} theme={theme} code={code ?? ''} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({ line, key: i })}>
              <LineContent>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
        </Pre>
      )}
    </Highlight>
  );
};
