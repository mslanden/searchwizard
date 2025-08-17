/**
 * SearchWizard Database Schema
 * 
 * This file documents the complete database schema for the SearchWizard application,
 * including all tables, relationships, RLS policies, and functions.
 * 
 * Last Updated: 2025-01-06
 * Admin System Status:  IMPLEMENTED (with admin approval workflow)
 */

// =============================================================================
// AUTHENTICATION & USER MANAGEMENT
// =============================================================================

/**
 * User Roles Table
 * Manages user permissions and admin status
 */
export interface UserRole {
  id: string; // UUID, primary key
  user_id: string; // UUID, references auth.users(id)
  role: 'user' | 'admin'; // User role type
  is_active: boolean; // Whether role is currently active
  assigned_by: string | null; // UUID, references auth.users(id) - who assigned this role
  assigned_at: string; // TIMESTAMPTZ, when role was assigned
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

/**
 * Pending User Approvals Table
 * Tracks user registration requests awaiting admin approval
 */
export interface PendingUserApproval {
  id: string; // UUID, primary key
  user_id: string; // UUID, references auth.users(id)
  email: string; // User's email address
  full_name: string | null; // User's full name (if provided)
  registration_date: string; // TIMESTAMPTZ, when user registered
  status: 'pending' | 'approved' | 'denied'; // Approval status
  reviewed_by: string | null; // UUID, references auth.users(id) - admin who reviewed
  reviewed_at: string | null; // TIMESTAMPTZ, when reviewed
  review_notes: string | null; // Admin notes about the decision
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

/**
 * Admin Activity Log Table
 * Tracks all administrative actions for audit purposes
 */
export interface AdminActivityLog {
  id: string; // UUID, primary key
  admin_user_id: string; // UUID, references auth.users(id)
  action_type: string; // 'approve_user', 'deny_user', 'deactivate_user', 'assign_role', etc.
  target_user_id: string | null; // UUID, references auth.users(id)
  target_email: string | null; // Email of target user
  details: Record<string, any> | null; // JSONB, additional action details
  ip_address: string | null; // INET, IP address of admin
  user_agent: string | null; // Browser/client info
  created_at: string; // TIMESTAMPTZ
}

// =============================================================================
// CORE PROJECT MANAGEMENT
// =============================================================================

/**
 * Projects Table
 * Main project entities that contain all other data
 */
export interface Project {
  id: string; // UUID, primary key
  title: string; // Project title
  client: string | null; // Client name
  date: string; // DATE, project date
  artifact_count: number; // Number of artifacts in project
  background_color: string; // UI background color preference
  user_id: string; // UUID, references auth.users(id) - project owner
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

/**
 * Artifacts Table
 * General project artifacts (company info, role specs, etc.)
 */
export interface Artifact {
  id: string; // UUID, primary key
  project_id: string; // UUID, references projects(id)
  name: string; // Artifact name
  description: string | null; // Artifact description
  artifact_type: string; // Type of artifact
  file_path: string | null; // Storage path
  file_url: string | null; // Public URL
  file_type: string | null; // MIME type
  file_size: number | null; // File size in bytes
  upload_date: string; // TIMESTAMPTZ
  user_id: string; // UUID, references auth.users(id)
}

/**
 * Artifact Types Table
 * Defines available artifact types (system + user-defined)
 */
export interface ArtifactType {
  id: string; // UUID, primary key
  name: string; // Type name
  description: string | null; // Type description
  category: string; // Category grouping
  is_system: boolean; // Whether it's a system-defined type
  user_id: string | null; // UUID, references auth.users(id) - null for system types
  created_at: string; // TIMESTAMPTZ
}

// =============================================================================
// PEOPLE MANAGEMENT
// =============================================================================

/**
 * Candidates Table
 * People being evaluated for roles
 */
export interface Candidate {
  id: string; // UUID, primary key
  project_id: string; // UUID, references projects(id)
  name: string; // Candidate name
  role: string | null; // Target role
  company: string | null; // Current company
  email: string | null; // Contact email
  phone: string | null; // Contact phone
  profile_photo_url: string | null; // Profile photo URL
  user_id: string; // UUID, references auth.users(id)
  created_at: string; // TIMESTAMPTZ
}

/**
 * Candidate Artifacts Table
 * Documents related to specific candidates
 */
export interface CandidateArtifact {
  id: string; // UUID, primary key
  candidate_id: string; // UUID, references candidates(id)
  name: string; // Artifact name
  description: string | null; // Artifact description
  file_path: string | null; // Storage path
  file_url: string | null; // Public URL
  file_type: string | null; // MIME type
  file_size: number | null; // File size in bytes
  upload_date: string; // TIMESTAMPTZ
  user_id: string; // UUID, references auth.users(id)
}

/**
 * Interviewers Table
 * People conducting interviews/evaluations
 */
export interface Interviewer {
  id: string; // UUID, primary key
  project_id: string; // UUID, references projects(id)
  name: string; // Interviewer name
  role: string | null; // Their role/title
  email: string | null; // Contact email
  profile_photo_url: string | null; // Profile photo URL
  user_id: string; // UUID, references auth.users(id)
  created_at: string; // TIMESTAMPTZ
}

/**
 * Process Artifacts Table
 * Documents related to the interview/evaluation process
 */
export interface ProcessArtifact {
  id: string; // UUID, primary key
  interviewer_id: string; // UUID, references interviewers(id)
  name: string; // Artifact name
  description: string | null; // Artifact description
  file_path: string | null; // Storage path
  file_url: string | null; // Public URL
  file_type: string | null; // MIME type
  file_size: number | null; // File size in bytes
  upload_date: string; // TIMESTAMPTZ
  user_id: string; // UUID, references auth.users(id)
}

// =============================================================================
// OUTPUT MANAGEMENT
// =============================================================================

/**
 * Project Outputs Table
 * Generated documents and final deliverables
 */
export interface ProjectOutput {
  id: string; // UUID, primary key
  project_id: string; // UUID, references projects(id)
  name: string; // Output name
  description: string | null; // Output description
  output_type: string | null; // Type of output
  file_path: string | null; // Storage path
  file_url: string | null; // Public URL
  file_type: string | null; // MIME type
  file_size: number | null; // File size in bytes
  date_created: string; // TIMESTAMPTZ
  user_id: string; // UUID, references auth.users(id)
}

/**
 * Golden Examples Table
 * Template documents and examples (user-owned globally)
 */
export interface GoldenExample {
  id: string; // UUID, primary key
  name: string; // Example name
  description: string | null; // Example description
  example_type: string; // Type of example
  file_path: string | null; // Storage path
  file_url: string | null; // Public URL
  file_type: string | null; // MIME type
  file_size: number | null; // File size in bytes
  date_uploaded: string; // TIMESTAMPTZ
  user_id: string; // UUID, references auth.users(id) - owner
}

// =============================================================================
// STORAGE BUCKETS
// =============================================================================

/**
 * Supabase Storage Buckets Configuration
 * Organized by content type and access patterns
 */
export const STORAGE_BUCKETS = {
  // Project-related artifacts
  companyArtifacts: 'company-artifacts',     // Company info, annual reports
  roleArtifacts: 'role-artifacts',           // Job descriptions, role specs
  processArtifacts: 'process-artifacts',     // Interview guides, evaluation forms
  projectOutputs: 'project-outputs',         // Generated reports (HTML, PDF)
  
  // People-related content
  candidateArtifacts: 'candidate-artifacts', // Resumes, portfolios, references
  candidatePhotos: 'candidate-photos',       // Profile pictures
  interviewerPhotos: 'interviewer-photos',   // Interviewer profile pictures
  
  // Global templates and examples
  goldenExamples: 'golden-examples',         // Template documents, examples
} as const;

/**
 * Storage Bucket Policies
 * All buckets use folder-based organization: /{user_id}/{file_name}
 * Each user can only access their own folder within each bucket
 */
export interface StorageBucketPolicy {
  bucket_id: string;
  policy_name: string;
  policy_type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  definition: string;
}

// =============================================================================
// DATABASE FUNCTIONS
// =============================================================================

/**
 * Admin System Functions
 * Server-side functions for managing user roles and approvals
 */

/**
 * check_is_admin(user_id: UUID) -> BOOLEAN
 * Checks if a user has active admin role
 * SECURITY DEFINER function bypasses RLS
 */
export interface CheckIsAdminFunction {
  name: 'check_is_admin';
  parameters: {
    check_user_id: string; // UUID
  };
  returns: boolean;
}

/**
 * get_user_auth_info() -> JSON
 * Gets current user's role and approval status
 * Returns: { user_id, email, role, is_active, is_approved }
 */
export interface GetUserAuthInfoFunction {
  name: 'get_user_auth_info';
  parameters: {};
  returns: {
    user_id: string;
    email: string;
    role: string;
    is_active: boolean;
    is_approved: boolean;
  };
}

/**
 * approve_user_registration(approval_id: UUID, admin_notes?: TEXT) -> JSONB
 * Approves a pending user registration
 */
export interface ApproveUserFunction {
  name: 'approve_user_registration';
  parameters: {
    approval_id: string;
    admin_notes?: string;
  };
  returns: {
    success: boolean;
    message?: string;
    error?: string;
    user_id?: string;
    email?: string;
  };
}

/**
 * deny_user_registration(approval_id: UUID, admin_notes?: TEXT) -> JSONB
 * Denies a pending user registration
 */
export interface DenyUserFunction {
  name: 'deny_user_registration';
  parameters: {
    approval_id: string;
    admin_notes?: string;
  };
  returns: {
    success: boolean;
    message?: string;
    error?: string;
    user_id?: string;
    email?: string;
  };
}

/**
 * deactivate_user(target_user_id: UUID, admin_notes?: TEXT) -> JSONB
 * Deactivates all roles for a user
 */
export interface DeactivateUserFunction {
  name: 'deactivate_user';
  parameters: {
    target_user_id: string;
    admin_notes?: string;
  };
  returns: {
    success: boolean;
    message?: string;
    error?: string;
    user_id?: string;
    email?: string;
  };
}

/**
 * assign_user_role(target_user_id: UUID, new_role: TEXT, admin_notes?: TEXT) -> JSONB
 * Assigns a role to a user
 */
export interface AssignUserRoleFunction {
  name: 'assign_user_role';
  parameters: {
    target_user_id: string;
    new_role: 'user' | 'admin';
    admin_notes?: string;
  };
  returns: {
    success: boolean;
    message?: string;
    error?: string;
    user_id?: string;
    email?: string;
    role?: string;
  };
}

// =============================================================================
// DATABASE TRIGGERS
// =============================================================================

/**
 * Database Triggers
 * Automated functions that run on data changes
 */

/**
 * on_auth_user_created()
 * Trigger: AFTER INSERT ON auth.users
 * Creates pending approval record for new users
 */
export interface OnAuthUserCreatedTrigger {
  trigger_name: 'on_auth_user_created';
  table: 'auth.users';
  event: 'AFTER INSERT';
  function: 'handle_new_user_registration';
}

/**
 * on_new_approval_request()
 * Trigger: AFTER INSERT ON pending_user_approvals
 * Sends notification to admins about new registration
 */
export interface OnNewApprovalRequestTrigger {
  trigger_name: 'on_new_approval_request';
  table: 'pending_user_approvals';
  event: 'AFTER INSERT';
  function: 'notify_admins_new_registration';
}

// =============================================================================
// ROW LEVEL SECURITY (RLS) POLICIES
// =============================================================================

/**
 * RLS Policy Summary
 * All tables have RLS enabled with appropriate access controls
 */

export interface RLSPolicySet {
  table_name: string;
  policies: {
    name: string;
    type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
    role: 'authenticated' | 'anon';
    using_clause: string;
    with_check_clause?: string;
  }[];
}

/**
 * Key RLS Patterns:
 * 
 * 1. USER DATA ISOLATION
 *    - Users can only access their own data
 *    - Enforced via user_id = auth.uid()
 * 
 * 2. PROJECT-BASED ACCESS
 *    - Access through project ownership
 *    - Enforced via project.user_id = auth.uid()
 * 
 * 3. ADMIN PRIVILEGES
 *    - Admins can access admin functions and data
 *    - Enforced via check_is_admin(auth.uid())
 * 
 * 4. ROLE-BASED VIEWS
 *    - my_auth_info view provides safe user role access
 *    - Bypasses circular dependency issues
 */

// =============================================================================
// API INTEGRATION TYPES
// =============================================================================

/**
 * Frontend API Integration
 * TypeScript interfaces for API responses
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Admin API responses
export interface PendingApprovalsResponse {
  approvals: (PendingUserApproval & {
    user: {
      id: string;
      email: string;
      created_at: string;
    };
  })[];
}

export interface UsersManagementResponse {
  users: {
    id: string;
    email: string;
    created_at: string;
    roles: {
      role: string;
      is_active: boolean;
      assigned_at: string;
    }[];
  }[];
}

export interface ActivityLogResponse {
  activities: (AdminActivityLog & {
    admin_email: string;
    target_email?: string;
  })[];
}

// =============================================================================
// MIGRATION HISTORY
// =============================================================================

/**
 * Database Migration History
 * Tracks major schema changes and updates
 */

export interface MigrationRecord {
  version: string;
  description: string;
  applied_at: string;
  sql_file: string;
}

export const MIGRATION_HISTORY: MigrationRecord[] = [
  {
    version: '1.0.0',
    description: 'Initial schema - projects, artifacts, candidates, interviewers',
    applied_at: '2024-12-01',
    sql_file: 'initial_schema.sql'
  },
  {
    version: '1.1.0', 
    description: 'Added golden examples and project outputs',
    applied_at: '2024-12-15',
    sql_file: 'add_outputs_examples.sql'
  },
  {
    version: '2.0.0',
    description: 'Admin approval system - user roles, pending approvals, activity log',
    applied_at: '2025-01-06',
    sql_file: 'SUPABASE_ADMIN_APPROVAL_GUIDE.md'
  },
  {
    version: '2.0.1',
    description: 'Fixed RLS policies and added helper functions',
    applied_at: '2025-01-06',
    sql_file: 'FIX_RLS_ALTERNATIVE.sql'
  }
];

// =============================================================================
// FEATURE FLAGS & CONFIGURATION
// =============================================================================

/**
 * Feature Flags
 * Controls application features and rollouts
 */
export interface FeatureFlags {
  adminApprovalSystem: boolean; // Admin approval for new users
  // Future features can be added here
}

export const CURRENT_FEATURES: FeatureFlags = {
  adminApprovalSystem: true, //  ENABLED - Admin system is active
};

// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

/**
 * Required Environment Variables
 */
export interface EnvironmentConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  // Future env vars can be documented here
}

/**
 * Database Connection Limits
 */
export const DB_LIMITS = {
  MAX_FILE_SIZE: 52428800, // 50MB for most files
  MAX_IMAGE_SIZE: 10485760, // 10MB for images
  MAX_CONNECTIONS: 100, // Supabase connection limit
  QUERY_TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Schema Documentation Last Updated: 2025-01-06
 * 
 * STATUS:  CURRENT & COMPLETE
 * - Admin approval system fully implemented
 * - All tables documented with relationships
 * - RLS policies documented and working
 * - Functions and triggers documented
 * - API integration types provided
 * 
 * NEXT UPDATES:
 * - Any new features should update this schema
 * - Migration history should be maintained
 * - Feature flags should reflect actual state
 */