import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
} from 'react';
import {
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  IconButton,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import mitt from 'mitt';
import { SpecWidget } from './SpecWidget';
import { implementWidget } from '../../utils/widget';
import { WidgetProps } from '../../types/widget';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui-fork/shared';
import { PREVENT_POPOVER_WIDGET_CLOSE_CLASS } from '../../constants/widget';

type EvenType = {
  'sub-popover-close': string[];
  'other-popover-close': string[];
};

type PopoverWidgetHandler = {
  open: () => void;
  close: () => void;
};

type Children = {
  trigger?: React.ReactElement;
  body?: React.ReactElement;
};

type PopoverWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.Popover}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/popover': {};
  }
}

const emitter = mitt<EvenType>();

export const PopoverWidget = React.forwardRef<
  PopoverWidgetHandler,
  React.ComponentPropsWithoutRef<React.ComponentType> & WidgetProps<PopoverWidgetType>
>((props, ref) => {
  const { spec, path, children } = props;
  const isObjectChildren = children && typeof children === 'object';
  const [isInit, setIsInit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mergedSpec = useMemo(
    () => ({
      ...spec,
      widget:
        spec.widget === `${CORE_VERSION}/${CoreWidgetName.Popover}`
          ? undefined
          : spec.widget,
    }),
    [spec]
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsInit(true);
    emitter.emit('other-popover-close', path);
  }, [path]);
  const handleClickTrigger = useCallback(event => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }, []);
  const handleClickContent = useCallback(
    event => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      emitter.emit('sub-popover-close', path);
    },
    [path]
  );
  const handlerCloseByParent = useCallback(
    (fromPath: string[]) => {
      const fromPathString = fromPath.join('.');
      const pathString = path.join('.');
      const isParent =
        pathString !== fromPathString && pathString.startsWith(fromPathString);

      if (isParent) {
        setIsOpen(false);
      }
    },
    [path]
  );
  const handlerCloseByOther = useCallback(
    (fromPath: string[]) => {
      const fromPathString = fromPath.join('.');
      const pathString = path.join('.');
      const isRelated =
        pathString.startsWith(fromPathString) || fromPathString.startsWith(pathString);

      if (!isRelated) {
        setIsOpen(false);
      }
    },
    [path]
  );

  useEffect(() => {
    emitter.on('sub-popover-close', handlerCloseByParent);
    emitter.on('other-popover-close', handlerCloseByOther);

    return () => {
      emitter.off('sub-popover-close', handlerCloseByParent);
      emitter.off('other-popover-close', handlerCloseByOther);
    };
  }, [handlerCloseByParent, handlerCloseByOther]);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        event.path.some((node: Element) =>
          [...(node.classList?.values() || [])].includes(
            PREVENT_POPOVER_WIDGET_CLOSE_CLASS
          )
        )
      )
        return;
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
      emitter.emit('other-popover-close', path);
    },
    close() {
      setIsOpen(false);
      emitter.emit('sub-popover-close', path);
    },
  }));

  return (
    <Popover
      isLazy
      placement="left"
      closeOnBlur={false}
      isOpen={isOpen}
      onOpen={handleOpen}
    >
      <PopoverTrigger>
        {isObjectChildren && 'trigger' in children ? (
          (children as Children).trigger
        ) : (
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Setting"
            icon={<SettingsIcon />}
            onClick={handleClickTrigger}
          />
        )}
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          className={PREVENT_POPOVER_WIDGET_CLOSE_CLASS}
          onClick={handleClickContent}
        >
          <PopoverArrow />
          <PopoverBody maxHeight="75vh" overflow="auto">
            {isInit ? (
              isObjectChildren && 'body' in children ? (
                (children as Children).body
              ) : (
                <SpecWidget {...props} spec={mergedSpec} />
              )
            ) : null}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});

export default implementWidget<PopoverWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.Popover,
  },
})(PopoverWidget);
