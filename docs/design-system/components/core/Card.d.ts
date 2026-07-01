import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Elevation. Default 'flat' (border only). */
  elevation?: 'flat' | 'raised' | 'floating';
  /** Inner padding. Default 'md'. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Element/tag to render as. Default 'div'. */
  as?: keyof JSX.IntrinsicElements;
}

/** Base surface container — warm white, hairline border, 12px radius. */
export function Card(props: CardProps): JSX.Element;
