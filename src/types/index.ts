export interface RawDrop {
  id: string;
  name: string;
  address: string;
  postcode: string;
  time: string;
}

export interface Drop {
  id: string;
  name: string;
  address: string;
  postcode: string;
  time: string;
  done: boolean;
}

export interface StoredState {
  version: 1;
  drops: Drop[];
}