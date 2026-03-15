export type FileType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface ContentFile {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: FileType;
  mimeType: string;
  size: number;
  tags: string[];
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
}
