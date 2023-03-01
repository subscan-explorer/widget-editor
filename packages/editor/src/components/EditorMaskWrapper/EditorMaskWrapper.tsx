import React, { useMemo, useRef, useState, useEffect } from 'react';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { Box } from '@chakra-ui/react';
import { EditorMask } from './EditorMask';
import { throttle } from 'lodash';
import { ExplorerMenuTabs } from '../../constants/enum';
import { genOperation } from '../../operations';

type Props = {
  services: EditorServices;
};

export const EditorMaskWrapper: React.FC<Props> = observer(props => {
  const { children, services } = props;
  const { editorStore, eventBus, registry } = services;
  const {
    setSelectedComponentId,
    setExplorerMenuTab,
    selectedComponentId,
    hoverComponentId,
  } = editorStore;
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  const [scrollOffset, setScrollOffset] = useState<[number, number]>([0, 0]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dragOverSlotRef = useRef<string>('');

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition([e.clientX, e.clientY]);
  };
  const onMouseLeave = () => {
    setMousePosition([-Infinity, -Infinity]);
  };
  const onScroll = () => {
    if (wrapperRef.current) {
      setScrollOffset([wrapperRef.current.scrollLeft, wrapperRef.current.scrollTop]);
      eventBus.send('MaskWrapperScrollCapture');
    }
  };

  const onClick = () => {
    if (hoverComponentId) {
      setSelectedComponentId(hoverComponentId);
    }
  };

  const throttleSetMousePosition = useMemo(() => {
    return throttle((position: [number, number]) => {
      setMousePosition(position);
    }, 50);
  }, [setMousePosition]);

  const onDragOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    throttleSetMousePosition([e.clientX, e.clientY]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExplorerMenuTab(ExplorerMenuTabs.UI_TREE);
    const creatingComponent = e.dataTransfer?.getData('component') || '';
    eventBus.send(
      'operation',
      genOperation(registry, 'createComponent', {
        componentType: creatingComponent,
        parentId: hoverComponentId,
        slot: dragOverSlotRef.current,
      })
    );
  };

  useEffect(() => {
    // can't capture the iframe click event
    // use `setInterval` to check whether the iframe is selected
    const timer = setInterval(function () {
      if (document.activeElement?.tagName === 'IFRAME') {
        const currentSelectedComponentId =
          document.activeElement?.getAttribute('title') || '';

        if (selectedComponentId !== currentSelectedComponentId) {
          setSelectedComponentId(currentSelectedComponentId);
        }
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  });

  const mousePositionWithOffset: [number, number] = [
    mousePosition[0] + scrollOffset[0],
    mousePosition[1] + scrollOffset[1],
  ];

  return (
    <Box
      id="editor-mask-wrapper"
      width="full"
      height="full"
      overflow="auto"
      position="relative"
      padding="20px"
      // some components stop click event propagation, so here we should capture onClick
      onClickCapture={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      // here we use capture to detect all the components and their children's scroll event
      // because every scroll event may change their children's location in coordinates system
      onScrollCapture={onScroll}
      ref={wrapperRef}
    >
      {children}
      <EditorMask
        services={services}
        mousePosition={mousePositionWithOffset}
        dragOverSlotRef={dragOverSlotRef}
        wrapperRef={wrapperRef}
      />
    </Box>
  );
});
