import { apiClient } from "./client";

export const storageApi = {
  getDirectory: (id = "root", userId) =>
    apiClient.get(`/directory/${id}`, {
      params: userId ? { userId } : undefined,
    }),
  createDirectory: (dirname, parentDirId = "root") =>
    apiClient.post(`/directory/${encodeURIComponent(dirname)}`, {}, {
      headers: {
        parentdirid: parentDirId,
      },
    }),
  renameDirectory: (id, newName) => apiClient.patch(`/directory/${id}`, { newName }),
  renameFile: (id, newName) => apiClient.patch(`/files/${id}`, { newName }),
  deleteItem: (id, type) => apiClient.delete(`/delete/${id}`, { params: { type } }),
  shareFile: (fileId, email, permission) => apiClient.post(`/share/${fileId}`, { email, permission }),
  removeSharedAccess: (fileId, userId) => apiClient.delete(`/share/${fileId}/${userId}`),
  uploadFile: (file, parentDirId = "root", onProgress) =>
    apiClient.post(`/upload/${encodeURIComponent(file.name)}`, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-file-type": file.type || "application/octet-stream",
        filesize: file.size,
        parentdirid: parentDirId,
      },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      },
      transformRequest: [(data) => data],
    }),
  getViewUrl: (fileId, action = "view") =>
    `${apiClient.defaults.baseURL}/files/${fileId}?action=${action}`,
};
