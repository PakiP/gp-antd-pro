import React from 'react';
export interface ITagCloudProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: number;
  padding?: number;
  weight: number;
  style?: React.CSSProperties;
}

export default class TagCloud extends React.Component<ITagCloudProps, any> {}
