import { commonProperties, jsxProperties } from './playerInterface';

export interface baseComponentsProps extends commonProperties {
  id: string;
  visible?: boolean;
  stroke?: boolean;
  valuesObj?: jsxProperties;
  childPos?: number;
  children?: JSX.Element | JSX.Element[] | null;
  newText?: boolean;
  translate?: boolean;
}

