import React from 'react';
import { css } from '@emotion/css';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { GeneralModal } from '../../GeneralModal';
import { APIMetaData, SubscanApiName, SUBSCAN_API } from './SubscanApi';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { renderMarkdown } from '../../../utils/markdown';

interface Props {
  onClose: () => void;
  onApply: (api: APIMetaData) => void;
}

const MarkdownStyle = css`
  font-size: 14px;

  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    word-break: break-word;
  }
  div {
    display: block;
  }
  marquee {
    display: inline-block;
    width: -webkit-fill-available;
  }
  address {
    display: block;
  }
  blockquote {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;

    padding: 10px 20px;
    border-left: 5px solid var(--border-color);
  }
  figcaption {
    display: block;
  }
  figure {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 40px;
    margin-inline-end: 40px;
  }
  q {
    display: inline;
  }
  q:before {
    content: open-quote;
  }
  q:after {
    content: close-quote;
  }
  center {
    display: block;
    /* special centering to be able to emulate the html4/netscape behaviour */
    text-align: -webkit-center;
  }
  hr {
    display: block;
    overflow: hidden;
    unicode-bidi: isolate;
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    margin-inline-start: auto;
    margin-inline-end: auto;
    border: none;
    height: 1px;
    background-color: var(--border-color);
  }
  map {
    display: inline;
  }
  video {
    object-fit: contain;
  }
  video:-webkit-full-page-media {
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-height: 100%;
    max-width: 100%;
  }
  audio:not([controls]) {
    display: none !important;
  }
  /** TODO(crbug.com/985623): Remove these hard-coded audio tag size.
* This fixed audio tag width/height leads to fail the wpt tests below.
* crbug.com/955170 external/wpt/css/css-contain/contain-size-replaced-003a.html
* crbug.com/955163 external/wpt/css/css-contain/contain-size-replaced-003b.html
* crbug.com/955163 external/wpt/css/css-contain/contain-size-replaced-003c.html
*/
  audio {
    width: 300px;
    height: 54px;
  }
  /* heading elements */
  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    word-break: break-word;
  }
  h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    word-break: break-word;
  }
  h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    word-break: break-word;
  }
  h4 {
    display: block;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    word-break: break-word;
  }
  h5 {
    display: block;
    font-size: 0.83em;
    margin-block-start: 1.67em;
    margin-block-end: 1.67em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    word-break: break-word;
  }
  h6 {
    display: block;
    font-size: 0.67em;
    margin-block-start: 2.33em;
    margin-block-end: 2.33em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    word-break: break-word;
  }
  /* tables */
  table {
    display: table;
    border-collapse: separate;
    border-spacing: 2px;
    border-color: gray;
    box-sizing: border-box;
    text-indent: initial;
    border-collapse: collapse;
  }
  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  tfoot {
    display: table-footer-group;
    vertical-align: middle;
    border-color: inherit;
  }
  /* for tables without table section elements (can happen with XHTML or dynamically created tables) */
  table > tr {
    vertical-align: middle;
  }
  col {
    display: table-column;
  }
  colgroup {
    display: table-column-group;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  td,
  th {
    padding: 5px 10px;
    display: table-cell;
    vertical-align: inherit;
  }
  table tr:last-child {
    border-bottom: 1px solid #ccc;
  }
  th {
    font-weight: bold;
    text-align: -internal-center;
    border-bottom: 1px solid #ccc;
  }
  caption {
    display: table-caption;
    text-align: -webkit-center;
  }
  /* lists */
  ul,
  menu,
  dir {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 40px;
  }
  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 40px;
  }
  li {
    display: list-item;
    text-align: -webkit-match-parent;
    padding-left: 0.8rem;
    margin-bottom: 0.5rem;
  }
  ul ul,
  ol ul {
    list-style-type: circle;
  }
  ol ol ul,
  ol ul ul,
  ul ol ul,
  ul ul ul {
    list-style-type: square;
  }
  dd {
    display: block;
    margin-inline-start: 40px;
  }
  dl {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
  dt {
    display: block;
  }
  ol ul,
  ul ol,
  ul ul,
  ol ol {
    margin-block-start: 0;
    margin-block-end: 0;
  }
  /* form elements */
  form {
    display: block;
    margin-top: 0em;
  }
  :-webkit-any(table, thead, tbody, tfoot, tr) > form:-internal-is-html {
    display: none !important;
  }
  label {
    cursor: default;
  }
  legend {
    display: block;
    padding-inline-start: 2px;
    padding-inline-end: 2px;
    border: none;
  }
  fieldset {
    display: block;
    margin-inline-start: 2px;
    margin-inline-end: 2px;
    padding-block-start: 0.35em;
    padding-inline-start: 0.75em;
    padding-inline-end: 0.75em;
    padding-block-end: 0.625em;
    border: 2px groove #c0c0c0;
    min-inline-size: min-content;
  }
  a {
    color: #0085ff;
    word-break: break-word;
  }
  code {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: var(--main-bg);
    border-radius: 4px;
    overflow: auto;
    word-break: break-all;
  }
  pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: var(--main-color);
    word-break: break-all;
    word-wrap: break-word;
    background-color: var(--main-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: auto;
  }
  img {
    max-width: 70%;
    margin: 2rem auto;
    display: block;
  }

  @media screen and (max-width: $screen-md) {
    img {
      max-width: 100%;
      margin: 2rem auto;
      display: block;
    }
  }
`;

export const SubscanApiModal: React.FC<Props> = props => {
  const category = Object.keys(SubscanApiName);

  return (
    <GeneralModal title="Subscan API" onClose={props.onClose} size="xl">
      <VStack>
        <Text fontSize="md">
          With Subscan API, we provide a simple way to access the chain data of more than
          10 substrate-based networks. <br />
          If you have any question or suggestion, please do not hesitate to contact our
          API support via api@subscan.io.
          <Link
            color="blue.600"
            href="https://support.subscan.io"
            isExternal
            display="block"
          >
            Subscan API Docs <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
      </VStack>
      <Accordion allowToggle mt="3">
        {category.map(title => {
          const filterList = SUBSCAN_API.filter(api => api.category === title);
          return (
            <>
              <Heading as="h5" size="sm" my="3">
                {title} API
              </Heading>
              {filterList.map(api => {
                const descriptionHTML = renderMarkdown(api.description);
                return (
                  <AccordionItem key={`${api.name}${api.url}`}>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          {api.name}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Code mb="3">
                        {api.method.toUpperCase()} {api.url}
                      </Code>
                      <div className={MarkdownStyle}>
                        <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
                      </div>
                      <Flex justifyContent="flex-end" mt="2">
                        <Button
                          colorScheme="blue"
                          size="xs"
                          onClick={() => {
                            props.onApply(api);
                            props.onClose();
                          }}
                        >
                          Apply
                        </Button>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </>
          );
        })}
      </Accordion>
    </GeneralModal>
  );
};
