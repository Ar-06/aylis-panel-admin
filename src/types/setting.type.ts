export interface SettingStore {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface SettingStoreResponse {
  message: string;
  data: SettingStore[];
}

export interface SettingSingleResponse {
  message: string;
  data: SettingStore;
}