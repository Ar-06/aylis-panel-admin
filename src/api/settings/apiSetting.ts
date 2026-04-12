import { axiosSetting } from "./axiosSetting";
import type {
  SettingSingleResponse,
  SettingStoreResponse,
} from "@/types/setting.type";

export class ApiSetting {
  async getSettings(): Promise<SettingStoreResponse> {
    const { data } = await axiosSetting.get<SettingStoreResponse>("/");
    return data;
  }

  async getSettingByKey(key: string): Promise<SettingSingleResponse> {
    const { data } = await axiosSetting.get<SettingSingleResponse>(`/${key}`);
    return data;
  }

  async updateSetting(
    key: string,
    value: string,
  ): Promise<SettingSingleResponse> {
    const { data } = await axiosSetting.put<SettingSingleResponse>("/", {
      key,
      value,
    });
    return data;
  }
}

export const apiSetting = new ApiSetting()
