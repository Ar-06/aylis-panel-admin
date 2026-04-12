import { apiSetting } from "@/api/settings/apiSetting";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useSetting() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiSetting.getSettingByKey("IS_STORE_OPEN");
      if (response && response.data) {
        setIsOpen(response.data.value === "true");
      }
    } catch (error) {
      console.error("Configuración no encontrada o error de conexión", error);
      if (isAxiosError(error) && error.response) {
        const data = error.response.data;
        if (data && data.message) {
          throw new Error(data.message);
        }
      }
      throw new Error("Error al cargar la configuración");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const toggleAgenda = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await apiSetting.updateSetting("IS_STORE_OPEN", String(checked));
      setIsOpen(checked);
      toast.success(
        checked
          ? "¡Agenda abierta! Volverás a recibir pedido."
          : "¡Agenda cerrada! Los clientes verán el aviso.",
      );
    } catch (error) {
      console.error("Error al cambiar el estado de la agenda", error);
      toast.error("Error al cambiar el estado de la agenda");
    } finally {
      setIsToggling(false);
    }
  };

  return {
    isOpen,
    isLoading,
    isToggling,
    toggleAgenda,
    fetchStatus,
  };
}
