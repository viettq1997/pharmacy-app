import { ReactNode } from "react";

export interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'select-api' | 'date';
  placeholder?: string;
  fetchOptions?: (search: string) => Promise<any[]>;
  options?: { label: string; value: string }[];
  rules?: any[];
  prefix?: ReactNode
  suffix?: ReactNode
}
