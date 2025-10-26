// Base types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  rowCount: number;
  pageSize: number;
  pageCount: number;
  currentPage: number;
  items: T[];
}

export interface QueryParams {
  q?: string;
  includes?: string;
  filters?: string;
  orders?: string;
  columns?: string;
}

export interface PaginationQueryParams extends QueryParams {
  page?: number;
  pageSize?: number;
}

// Error Response types
export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp: string;
  traceId?: string;
}

export interface ValidationErrorResponse {
  error: string;
  validationErrors: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// File Upload Response
export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}

// Import Response
export interface ImportResponse {
  importId: string;
  status: 'Started' | 'Processing' | 'Completed' | 'Failed';
  totalRecords?: number;
  processedRecords?: number;
  errors?: ImportError[];
  startedAt: string;
}

export interface ImportError {
  row: number;
  message: string;
}

// Asset types
export interface Asset {
  id: string;
  name?: string;
  area?: string;
  code?: string;
  category?: string;
  description?: string;
  model?: string;
  images?: string[];
  barcode?: string;
  serialNumber?: string;
  manufacturerId?: string;
  locationId: string;
  location?: Location;
}

export interface CreateAssetCommand {
  name?: string;
  serialNumber?: string;
  locationId: string;
  images?: string[];
  area?: string;
  barcode?: string;
  category?: string;
  description?: string;
  manufacturerId?: string;
  model?: string;
}

export interface UpdateAssetCommand {
  id: string;
  name?: string;
  description?: string;
  model?: string;
  locationId: string;
  manufacturerId?: string;
  serialNumber?: string;
  category?: string;
  area?: string;
  barcode?: string;
}

export interface DeleteAssetCommand {
  ids?: string[];
}

// Location types
export interface Location {
  id: string;
  name?: string;
  parentId?: string;
  parent?: Location;
}

export interface CreateLocationCommand {
  name?: string;
}

export interface UpdateLocationCommand {
  id: string;
  name?: string;
}

export interface DeleteLocationCommand {
  ids?: string[];
}

// Maintenance types
export interface Maintenance {
  id: string;
  workOrderId: string;
  cronExpression?: string;
  images?: string[];
  workOrder?: WorkOrder;
  assets?: Asset[];
}

export interface CreateMaintenanceCommand {
  workOrderId?: string;
  cronExpression?: string;
  images?: string[];
}

export interface UpdateMaintenanceCommand {
  id: string;
  workOrderId: string;
  cronExpression?: string;
  images?: string[];
}

export interface DeleteMaintenanceCommand {
  ids?: string[];
}

// Material types
export interface Material {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  images?: string[];
  status: number;
  available: number;
  allocated: number;
  onHand: number;
  incoming: number;
  minimum: number;
  parts?: Part[];
}

export interface CreateMaterialCommand {
  name?: string;
  code?: string;
  status: number;
  description?: string;
  images?: string[];
  parts?: string[];
}

export interface UpdateMaterialCommand {
  id: string;
  name?: string;
  code?: string;
  status: number;
  description?: string;
  images?: string[];
  parts?: string[];
}

export interface DeleteMaterialCommand {
  ids?: string[];
}

// Part types
export interface Part {
  storageId: string;
  status: number;
  description: string;
  category: string;
  cost: number;
  inventory: number;
  minimum: number;
  id: string;
  quantity: number;
  locationId?: string;
  materialId?: string;
  location?: Location;
  material?: Material;
}

export interface CreatePartCommand {
  materialId: string;
  minimum?: number;
  quantity?: number;
  inventory?: number;
  cost?: number;
  category?: string;
  description?: string;
  status: number;
  storageId?: string;
  locationId?: string;
}

export interface UpdatePartCommand {
  id: string;
  materialId: string;
  minimum?: number;
  quantity?: number;
  inventory?: number;
  cost?: number;
  category?: string;
  description?: string;
  status: number;
  storageId?: string;
  locationId?: string;
}

export interface DeletePartCommand {
  ids?: string[];
}

// Request types
export interface Request {
  id: string;
  assetId: string;
  title?: string;
  description?: string;
  category: number;
  status: number;
  priority: number;
  images?: string[];
  workOrderId?: string;
  asset?: Asset;
  workOrder?: WorkOrder;
  files?: File[];
}

export interface CreateRequestCommand {
  assetId?: string;
  title?: string;
  description?: string;
  status: number;
  category: number;
  priority: number;
  images?: string[];
}

export interface UpdateRequestCommand {
  id: string;
  assetId?: string;
  title?: string;
  description?: string;
  status: number;
  category: number;
  priority: number;
  images?: string[];
}

export interface DeleteRequestCommand {
  ids?: string[];
}

// Set types
export interface Set {
  id: string;
  name?: string;
  parts?: Part[];
}

export interface CreateSetCommand {
  name?: string;
  parts?: string[];
}

export interface UpdateSetCommand {
  id: string;
  name?: string;
  parts?: string[];
}

export interface DeleteSetCommand {
  ids?: string[];
}

// Storage types
export interface Storage {
  id: string;
  name?: string;
}

export interface CreateStorageCommand {
  name?: string;
}

export interface UpdateStorageCommand {
  id: string;
  name?: string;
}

export interface DeleteStorageCommand {
  ids?: string[];
}

// Task types
export interface Task {
  id: string;
  assetId?: string;
  type: number;
  value?: unknown;
  asset?: Asset;
}

export interface CreateTaskCommand {
  assetId?: string;
  type: number;
  value?: unknown;
}

export interface UpdateTaskCommand {
  id: string;
  assetId?: string;
  type: number;
  value?: unknown;
}

export interface DeleteTaskCommand {
  ids?: string[];
}

// Team types
export interface Team {
  id: string;
  name?: string;
  description?: string;
  leaderId: string;
  leader?: User;
  members?: User[];
}

export interface CreateTeamCommand {
  name?: string;
  description?: string;
  leaderId: string;
  memberIds?: string[];
}

export interface UpdateTeamCommand {
  id: string;
  name?: string;
  description?: string;
  leaderId: string;
  memberIds?: string[];
}

export interface DeleteTeamCommand {
  ids?: string[];
}

// User types
export interface User {
  id: string;
  name?: string;
  username?: string;
  company?: string;
  phoneNumber?: string;
}

// Work Order types
export interface WorkOrder {
  id: string;
  no?: string;
  title?: string;
  description?: string;
  note?: string;
  status: number;
  priority: number;
  category: number;
  estimate?: string;
  assigneeId?: string;
  requestId?: string;
  maintenanceId?: string;
  images?: string[];
  assignee?: User;
  request?: Request;
  maintenance?: Maintenance;
  parts?: Part[];
  tasks?: Task[];
  checklists?: Checklist[];
}

export interface CreateWorkOrderCommand {
  title?: string;
  description?: string;
  note?: string;
  status: number;
  category: number;
  priority: number;
  estimate?: string;
  requestId?: string;
  maintenanceId?: string;
  images?: string[];
  assigneeId?: string;
  files?: string[];
}

export interface UpdateWorkOrderCommand {
  id: string;
  assetId: string;
  title?: string;
  description?: string;
  status: number;
  category: number;
  priority: number;
  images?: string[];
}

export interface DeleteWorkOrderCommand {
  ids?: string[];
}

// Checklist types
export interface Checklist {
  id: string;
  name?: string;
  description?: string;
  workOrderId?: string;
  workOrder?: WorkOrder;
  tasks?: Task[];
}

export interface ChecklistResponse {
  id: string;
  name?: string;
  description?: string;
  workOrderId?: string;
  workOrder?: WorkOrder;
  tasks?: Task[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChecklistCommand {
  name?: string;
  description?: string;
  workOrderId?: string;
  tasks?: string[];
  tags?: string[];
}

export interface UpdateChecklistCommand {
  id: string;
  name?: string;
  description?: string;
  workOrderId?: string;
  tasks?: string[];
  tags?: string[];
}

export interface DeleteChecklistCommand {
  ids?: string[];
}

// File types
export interface File {
  id: string;
  name?: string;
  ext?: string;
  size: number;
}

export interface UploadFileCommand {
  files?: File[];
}

// Processing Status
export enum ProcessingStatus {
  NotStarted = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4,
}

// Domain Enums
export enum MaterialStatus {
  Active = 0,
  Inactive = 1,
  Deleted = 2,
}

export enum PartStatus {
  Active = 0,
  Inactive = 1,
  Deleted = 2,
}

export enum RequestCategory {
  Default = 0,
}

export enum RequestPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum RequestStatus {
  Open = 0,
  InProgress = 1,
  Closed = 2,
}

export enum TaskType {
  Default = 0,
}

export enum WorkOrderCategory {
  Default = 0,
}

export enum WorkOrderPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Urgent = 3,
}

export enum WorkOrderStatus {
  Draft = 0,
  Open = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}
