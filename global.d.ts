import '@testing-library/jest-dom';

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module 'react-dom/client';
declare module '@tosspayments/payment-sdk';

declare module '../../server/utils/logger' {
  export const logger: {
    error: (message: string, ...args: any[]) => void;
    info: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
  };
}
