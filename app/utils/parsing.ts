import { createElement } from 'react';

export const renderFromRawElement = (node: any, key: number) => {
  console.log(node);
  if (typeof node === 'string') {
    return node;
  }

  if (!node || typeof node !== 'object') {
    return null;
  }

  const { type, props } = node;

  if (!type) {
    return null;
  }

  console.log(type);

  return createElement(
    type,
    { key, ...props },
    Array.isArray(props.children)
      ? props.children.map((child: any, index: number) => renderFromRawElement(child, index))
      : props.children
  );
}