import { createElement } from 'react';

export const renderFromRawElement = (node: any, key: number) => {
  if (typeof node === 'string') {
    return node;
  }

  if (!node || typeof node !== 'object') {
    return null;
  }

  const { type, props } = node;

  if (!type || !props) {
    return null;
  }

  return createElement(
    type,
    { key, ...props },
    Array.isArray(props.children)
      ? props.children.map((child: any, index: number) => renderFromRawElement(child, index))
      : props.children
  );
}