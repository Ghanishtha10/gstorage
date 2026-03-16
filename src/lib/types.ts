
export type FileType = string;

export interface ContentFile {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: FileType;
  mimeType: string;
  size: number;
  tags: string[];
  uploadedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
}
