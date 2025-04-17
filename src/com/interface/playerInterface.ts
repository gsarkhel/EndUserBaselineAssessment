export interface stringObject {
  [key: string]: string;
}

export interface audioObject {
  [key: string]: Howl;
}

export interface anyObject {
  [key: string]: any;
}

export interface playerInterface {
  children?: JSX.Element | null;
}

export interface jsxProperties extends commonProperties {}

export interface commonProperties {
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  disable?: boolean;
  color?: string;
  text?: boolean;
}

export interface configModel {
  gameConfig: anyObject;
  images: stringObject;
  audios?: stringObject;
  videos?: stringObject;
}

