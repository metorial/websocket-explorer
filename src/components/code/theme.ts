import type { PrismTheme } from 'prism-react-renderer';

export let theme: PrismTheme = {
  plain: {
    color: '#393A34',
    backgroundColor: 'white'
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#999988',
        fontStyle: 'italic'
      }
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7
      }
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: '#3867d6'
      }
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#393A34'
      }
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'property',
        'regex',
        'inserted'
      ],
      style: {
        color: '#19bc78'
      }
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: '#3867d6'
      }
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: {
        color: '#eb3b5a'
      }
    },
    {
      types: ['function-variable'],
      style: {
        color: '#6f42c1'
      }
    },
    {
      types: ['tag', 'selector', 'keyword'],
      style: {
        color: '#10ac84'
      }
    }
  ]
};
