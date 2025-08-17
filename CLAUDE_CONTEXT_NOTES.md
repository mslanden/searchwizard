# Claude Context Notes

This file contains important context and recent changes for Claude Code sessions.

## Recent Issues Resolved (August 2025)

### 1. SQL Template Literal Error (`r.ND.sql is not a function`)
- **Issue**: Company artifact uploads showed error but succeeded
- **Cause**: Invalid `supabase.sql` template literal usage in minified JavaScript in `frontend/src/lib/api/utils.js`
- **Fix**: Replaced SQL increment/decrement with fetch-then-update approach
- **Files**: `frontend/src/lib/api/utils.js` (incrementCount/decrementCount functions)

### 2. URL Artifact Upload Pattern Validation Error
- **Issue**: "The string did not match the expected pattern" when uploading URLs like `https://www.marcelinolanden.com`
- **Cause**: Frontend trying to call non-existent `/process-content` backend endpoint
- **Fix**: Modified URL artifact handling to store URLs directly without backend processing
- **Files**: `frontend/src/lib/api/projectApi.js` (addCompanyArtifact/addRoleArtifact functions)
- **Note**: URL artifacts now work like text artifacts - just store the reference, no content processing needed

### 3. Field Name Mismatch
- **Issue**: "Source URL is required for URL artifacts" error  
- **Cause**: UnifiedArtifactUploadPopup using `url` field but API expecting `sourceUrl`
- **Fix**: Changed field name in upload popup
- **Files**: `frontend/src/components/popups/UnifiedArtifactUploadPopup.tsx` (line 109)

### 4. Repository Structure Cleanup
- **Issue**: Confusing nested frontend/frontend directories and wrong repository pushes
- **Fix**: Cleaned up to use correct repository (searchwizard not search-wizard)
- **Structure**: Now integrated frontend (no more "cd frontend" needed)

## Current Backend API Endpoints
Available endpoints in `backend/api.py`:
- `/health` - Health check
- `/api/templates` - Template management  
- `/api/generate-document` - Document generation

**Missing**: `/process-content` endpoint (URL artifacts now work without it)

## Database Schema Notes
- **artifacts table**: Uses `source_url` field for URL artifacts
- **RLS policies**: Users can only access their own artifacts (`user_id = auth.uid()`)
- **Field constraints**: Some character limits on `file_hash` (64), `parser_used` (50), `processing_status` (20)

## Validation Architecture
- **Frontend**: UnifiedArtifactUploadPopup uses simple URL constructor validation
- **Not used**: `frontend/src/utils/validation.js` URL_REGEX (updated but not used in upload flow)
- **Backend**: No URL pattern validation currently

## Testing URLs
These URLs work for artifact uploads:
- `https://www.marcelinolanden.com`
- Any standard HTTP/HTTPS URL

## Future Improvements
- Consider adding `/process-content` endpoint if URL content extraction is needed
- URL artifacts currently store URL reference only (no content processing)
- Users can click stored URLs to access external content when needed