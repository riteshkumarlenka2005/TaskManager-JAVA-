export interface User {
  id: number;
  username: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: number[] | null;
  createdAt: number[];
  updatedAt: number[];
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  dueDate?: string;
}

export interface Document {
  id: number;
  title: string;
  content: string; // JSON string
  createdAt: number[];
  updatedAt: number[];
}

export interface DocumentRequest {
  title: string;
  content?: string;
}

// Block types for the document editor
export type BlockType = 'text' | 'heading' | 'image' | 'table' | 'drawing' | 'audio' | 'video' | 'divider' | 'code' | 'quote' | 'checklist' | 'callout';

export interface Block {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
}

export interface TextBlockData {
  text: string;
  html?: string; // rich text HTML from TipTap
  level?: 1 | 2 | 3; // heading level
}

export interface ImageBlockData {
  url: string;
  caption?: string;
  width?: number;
}

export interface TableCell {
  content: string;
  rowSpan?: number;
  colSpan?: number;
  merged?: boolean;
}

export interface TableBlockData {
  rows: TableCell[][];
}

export interface DrawingBlockData {
  dataUrl: string; // base64 PNG
  width: number;
  height: number;
}

export interface MediaBlockData {
  url: string;
  type: 'audio' | 'video';
  caption?: string;
}

export interface CodeBlockData {
  code: string;
  language: string;
}

export interface QuoteBlockData {
  text: string;
  author?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ChecklistBlockData {
  items: ChecklistItem[];
}

export type CalloutType = 'info' | 'warning' | 'success' | 'error';

export interface CalloutBlockData {
  type: CalloutType;
  text: string;
}

// Drawing tool types
export type DrawingTool = 'pen' | 'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle';

export interface DrawingState {
  tool: DrawingTool;
  color: string;
  size: number;
  isDrawing: boolean;
}
