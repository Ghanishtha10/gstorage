import { ContentFile } from './types';

// Mock data
let mockFiles: ContentFile[] = [
  {
    id: '1',
    name: 'Architectural Blueprint.jpg',
    url: 'https://picsum.photos/seed/arch1/800/600',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 1024 * 500,
    tags: ['Architecture', 'Design', 'Modern'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Q3 Marketing Strategy.pdf',
    url: 'https://placehold.co/600x400/1F2D30/73B6CC?text=Marketing+Strategy+PDF',
    type: 'document',
    mimeType: 'application/pdf',
    size: 1024 * 1200,
    tags: ['Business', 'Strategy', 'Marketing'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Product Reveal Video.mp4',
    url: 'https://picsum.photos/seed/vid1/1200/800',
    type: 'video',
    mimeType: 'video/mp4',
    size: 1024 * 1024 * 15,
    tags: ['Product', 'Launch', 'Video'],
    createdAt: new Date().toISOString(),
  }
];

export async function getFiles() {
  return [...mockFiles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addFile(file: ContentFile) {
  mockFiles = [file, ...mockFiles];
  return file;
}

export async function deleteFile(id: string) {
  mockFiles = mockFiles.filter(f => f.id !== id);
}

export async function updateFileTags(id: string, tags: string[]) {
  const file = mockFiles.find(f => f.id === id);
  if (file) {
    file.tags = tags;
  }
}