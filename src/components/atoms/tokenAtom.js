import { atom } from 'recoil';

export const tokenState = atom({
  key: 'tokenState',
  default: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
});