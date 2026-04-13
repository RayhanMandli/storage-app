import { apiClient } from "./client";

export const integrationApi = {
  listDriveRoot: () => apiClient.get("/integrations/drive/list-root"),
  listDriveFolder: (id) => apiClient.get(`/integrations/drive/list/${id}`),
  getDriveFileDownloadUrl: (id, action = "view") =>
    `${apiClient.defaults.baseURL}/integrations/drive/file/download/${id}?action=${action}`,
};
