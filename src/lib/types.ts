export type FileType = 'image' | 'video' | 'document' | 'other';

export interface ContentFile {
  id: string;
  name: string;
  url: string;
  type: FileType;
  mimeType: string;
  size: number;
  tags: string[];
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}