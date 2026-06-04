import { atom } from 'recoil';

export const LastSyncAtom = atom<number | null>({
  key: 'LastSyncAtom',
  default: null
});
