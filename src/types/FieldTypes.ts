export interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  options?: { label: string; value: string }[];
  rules?: any[];
}
