# Jira Export Integration - Implementation Plan

## Context

The Product Design Work Estimator is a standalone React application that helps design teams estimate project complexity, story points, and time requirements. The tool walks users through a wizard that captures project information, activities, complexity assessments, and generates detailed estimates with markdown breakdowns.

**Current State:**
- Standalone React app running on localhost:5173
- Estimates stored in browser localStorage
- Rich estimation data including: project metadata, complexity scores, activity selections, story points (Fibonacci), t-shirt sizes, and detailed markdown breakdowns
- Export capabilities: Copy to clipboard, save to history

**Problem to Solve:**
Users want to export their estimates into Jira to create issues (Epics/Stories/Spikes) with proper story points, labels, and detailed estimation breakdowns, rather than manually transcribing data.

**Goal:**
Add one-way export functionality (App → Jira) while maintaining the standalone architecture. Future consideration for bidirectional sync (Jira → App) based on team feedback.

---

## Recommended Architecture: REST API + Personal Access Token (PAT)

### Approach Overview

Use Jira REST API v3 with Basic Authentication (email + Personal Access Token). Configuration and tokens stored in browser localStorage.

### Why This Approach?

✅ **Preserves standalone architecture** - App remains on localhost, no deployment changes
✅ **Simple implementation** - No backend server, no OAuth flow, ~12-16 hours effort
✅ **User control** - Users manage their own Jira credentials
✅ **Upgradeable** - Can migrate to OAuth 2.0 later if enterprise deployment needed

### Trade-offs Accepted

⚠️ **Manual token management** - Users create PAT in Jira and paste into app
⚠️ **Token in localStorage** - Acceptable security risk for personal tool, not enterprise-grade
⚠️ **Token expiration** - Jira Cloud PATs can expire (user must refresh)

### Alternative Approaches Considered

**Atlassian Forge** - Rejected because it would require moving the app into Jira's ecosystem, violating the standalone requirement.

**OAuth 2.0** - Deferred to Phase 2 due to complexity (requires backend server for secure token storage, token refresh logic, ~40-60 hours effort). Consider when/if enterprise deployment is needed.

---

## Data Requirements

### Configuration Data to Collect from User

#### Required Settings
- **Jira Instance URL** - e.g., `https://your-domain.atlassian.net`
- **Email** - Email address associated with Jira account
- **API Token** - Personal Access Token generated from Jira account settings
- **Default Project Key** - e.g., `PDW`, `DESIGN` (which Jira project to create issues in)
- **Default Issue Type** - Epic, Story, or Spike

#### Optional Settings
- **Story Points Field ID** - Custom field ID for story points (e.g., `customfield_10016`)
- **T-Shirt Size Field ID** - Custom field ID for t-shirt sizing (e.g., `customfield_10017`)

### How to Discover Custom Field IDs

**Problem:** User may not know if Story Points or T-Shirt Size custom fields exist in their Jira instance.

**Solution:** Implement auto-detection in settings page:
1. Fetch all custom fields from Jira: `GET /rest/api/3/field`
2. Search for fields with names containing:
   - Story Points: "story point", "points", "story points", "sp"
   - T-Shirt Size: "t-shirt", "tshirt", "shirt size", "size"
3. Show matches in dropdown for user to select
4. Fallback: Manual field ID entry with help text explaining how to find field ID in Jira

### Storage Strategy

Add to `/src/utils/storage.js`:

```javascript
const JIRA_CONFIG_KEY = 'jira_integration_config';

export function saveJiraConfig(config) {
  localStorage.setItem(JIRA_CONFIG_KEY, JSON.stringify(config));
}

export function loadJiraConfig() {
  const data = localStorage.getItem(JIRA_CONFIG_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearJiraConfig() {
  localStorage.removeItem(JIRA_CONFIG_KEY);
}
```

**Config Object Schema:**
```javascript
{
  jiraUrl: 'https://your-domain.atlassian.net',
  email: 'user@company.com',
  apiToken: 'ATATT3xF...secret...',
  defaultProjectKey: 'PDW',
  defaultIssueType: 'Story',
  storyPointsFieldId: 'customfield_10016',  // Optional
  tshirtSizeFieldId: 'customfield_10017',   // Optional
  lastValidated: '2026-07-30T12:00:00Z'
}
```

### Changes to Estimation Data Model

**No changes required** to the existing estimation object structure. Current data already contains everything needed for export:

| Estimation Field | Maps To Jira Field |
|-----------------|-------------------|
| `projectName` | Issue Summary |
| `calculationBreakdown` (markdown) | Issue Description |
| `stage` (Discovery/Define/Design) | Label |
| `complexity.*` (ambiguity/artifactComplexity/stakeholderRisk/iterationLikelihood) | Labels (e.g., "complexity-high") |
| `activities` (selected activities array) | Labels (first 10-15 activities) |
| `finalPoints` (Fibonacci: 1,2,3,5,8,13) | Story Points custom field |
| `finalTShirtSize` (XS/S/M/L/XL) | T-Shirt Size custom field |

**Optional Future Addition:** Track which Jira issue was created from an estimation (for future bidirectional sync):

```javascript
{
  // Add to estimation object:
  jiraIssueKey: 'PDW-123',           // Track linked Jira issue
  jiraIssueUrl: 'https://...',       // Direct link
  lastSyncedAt: '2026-07-30T...',    // Last sync timestamp
}
```

---

## Implementation Components

### 1. New API Service: `/src/services/jiraService.js`

Core Jira REST API integration layer.

**Functions to Implement:**

```javascript
// Test connection to Jira instance
async function testConnection(jiraUrl, email, apiToken)
  → Returns: { success: boolean, message: string }

// Get all projects accessible to user
async function getProjects(jiraUrl, email, apiToken)
  → Returns: Array<{ key: string, name: string }>

// Get issue types for a specific project
async function getIssueTypes(jiraUrl, email, apiToken, projectKey)
  → Returns: Array<{ id: string, name: string }> // Epic, Story, Spike

// Search for custom fields (for auto-detection)
async function getCustomFields(jiraUrl, email, apiToken, searchTerm)
  → Returns: Array<{ id: string, name: string, type: string }>

// Create issue in Jira
async function createIssue(jiraUrl, email, apiToken, issueData)
  → Returns: { key: string, url: string } // PDW-123, https://...

// Get issue by key (for verification)
async function getIssue(jiraUrl, email, apiToken, issueKey)
  → Returns: Issue object
```

**Authentication Pattern:**
```javascript
const headers = {
  'Authorization': `Basic ${btoa(`${email}:${apiToken}`)}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
```

**Issue Creation Payload Structure:**

```javascript
{
  fields: {
    project: { key: projectKey },
    summary: estimation.projectName,
    description: {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: estimation.calculationBreakdown }]
      }]
    },
    issuetype: { name: issueType }, // Epic, Story, or Spike
    labels: [
      estimation.stage.toLowerCase(),              // 'discovery', 'define', 'design'
      `complexity-${estimation.finalPoints}`,      // 'complexity-5'
      `size-${estimation.finalTShirtSize}`,        // 'size-M'
      ...selectedActivityLabels                    // First 10-15 activities
    ],
    // Custom fields (only if configured)
    ...(storyPointsFieldId && { [storyPointsFieldId]: estimation.finalPoints }),
    ...(tshirtSizeFieldId && { [tshirtSizeFieldId]: estimation.finalTShirtSize })
  }
}
```

**Error Handling:**
- 401 Unauthorized → Invalid credentials
- 403 Forbidden → Permission denied
- 404 Not Found → Project/field not found
- 429 Too Many Requests → Rate limiting
- Network errors → Connection timeout

### 2. New Settings Page: `/src/pages/SettingsPage.jsx`

**Route:** `/settings`

**Sections:**

#### A. Connection Setup
- Jira URL input field
- Email input field
- API Token input field (masked, with show/hide toggle)
- "How to create Jira API token" help link → https://id.atlassian.com/manage-profile/security/api-tokens
- "Test Connection" button
- Connection status indicator (✓ Connected / ✗ Failed / ⏳ Testing)

#### B. Project Defaults
- Project Key dropdown (populated after successful connection test via `getProjects()`)
- Default Issue Type radio buttons (Epic / Story / Spike)

#### C. Custom Field Mapping (Collapsible/Advanced Section)
- "Auto-Detect Fields" button
  - Calls `getCustomFields()` to search for story points and t-shirt size fields
  - Shows dropdown of detected fields for user to select
- Manual override inputs (in case auto-detect fails)
  - Story Points Field ID input
  - T-Shirt Size Field ID input
- Field preview section (shows sample field data from Jira to confirm correct field)

#### D. Actions
- "Save Configuration" button (primary)
- "Clear Configuration" button (destructive, with confirmation)
- Last validated timestamp display

**Validation:**
- All required fields must be filled
- Test connection must succeed before allowing save
- Provide clear error messages for each validation failure

### 3. Export Modal: `/src/components/export/JiraExportModal.jsx`

Triggered from StepReport.jsx "Export to Jira" button.

**Sections:**

#### A. Configuration Check
- If no Jira config exists: Show "Configure Jira Integration First" message with link to `/settings`
- If config exists: Show current connection status (project, last validated time)

#### B. Export Options
- **Issue Type Selector** - Dropdown (Epic / Story / Spike) - defaults to configured preference
- **Project Key Input** - Pre-filled with default project, can be overridden
- **Include Labels Checkbox** - Option to include/exclude activity labels (can be verbose)
- **Preview Section** - Shows what will be exported:
  - Issue Summary (projectName)
  - Labels (stage, complexity, size, activities)
  - Story Points (if configured)
  - T-Shirt Size (if configured)
  - Description preview (first 200 chars of calculationBreakdown)

#### C. Export Actions
- **"Export to Jira" Button** (primary action)
  - Loading state during API call (disable button, show spinner)
  - Success state: Show success message with direct link to created Jira issue
  - Error state: Show error message with actionable guidance
- **"Cancel" Button** (secondary action)

**Error Handling:**
- Connection errors → "Check your internet connection"
- Auth errors → "Credentials may be invalid. Reconfigure in Settings."
- Permission errors → "You don't have permission to create issues in project X"
- Field errors → "Story Points field not found. Check field ID in Settings."

### 4. Update Existing Components

#### `/src/components/wizard/StepReport.jsx`
Add "Export to Jira" button next to existing export options:

```jsx
<div className="flex gap-3">
  <button onClick={handleCopy} className="flex-1 btn-secondary">
    {copied ? 'Copied!' : 'Copy to Clipboard'}
  </button>
  <button onClick={handleJiraExport} className="flex-1 btn-secondary">
    Export to Jira
  </button>
  <button onClick={handleSave} className="flex-1 btn-primary">
    Save to History
  </button>
</div>
```

**Behavior:**
- Click "Export to Jira" → Opens JiraExportModal
- If no config exists → Modal shows setup prompt
- If config exists → Modal shows export options

#### `/src/components/common/Layout.jsx`
Add "Settings" link to navigation:

```jsx
<nav className="flex gap-6">
  <button onClick={handleNewEstimation}>New Estimation</button>
  <Link to="/history">History</Link>
  <Link to="/settings">Settings</Link>
</nav>
```

#### `/src/App.jsx`
Add route for Settings page:

```jsx
<Route path="/settings" element={<SettingsPage />} />
```

---

## Implementation Phases

### Phase 1: MVP - One-Way Export (Estimated: 12-16 hours)

**Step 1: Core Jira Service (2-3 hours)**
- Create `/src/services/jiraService.js`
- Implement `testConnection()`, `getProjects()`, `createIssue()`
- Add error handling utilities
- Manual testing with console logs

**Step 2: Settings Page (3-4 hours)**
- Create `/src/pages/SettingsPage.jsx`
- Build connection setup form
- Implement "Test Connection" flow
- Add project selection dropdown
- Wire up to storage (save/load/clear config)
- Add route to App.jsx

**Step 3: Export Modal (2-3 hours)**
- Create `/src/components/export/JiraExportModal.jsx`
- Build issue type selector
- Add export preview
- Implement export flow (call createIssue)
- Success/error handling UI

**Step 4: Integration with StepReport (1 hour)**
- Add "Export to Jira" button to StepReport.jsx
- Wire up modal trigger
- Pass estimation data to modal
- Handle post-export actions (show success, link to Jira issue)

**Step 5: Custom Field Discovery (2 hours)**
- Implement `getCustomFields()` in jiraService.js
- Add "Auto-Detect Fields" UI to SettingsPage
- Build field mapping interface
- Test with and without custom fields

**Step 6: Testing & Polish (2-3 hours)**
- End-to-end testing: configure → export → verify in Jira
- Error handling for edge cases
- Loading states and user feedback
- Update README with setup instructions

### Phase 2: Bidirectional Sync (Future - 20-30 hours)

**Defer to later based on user feedback.**

**Use Cases:**
- Import existing Jira issues into estimator for refinement
- Update Jira issues when estimation changes
- Sync status between app and Jira

**Implementation Considerations:**
- Add "Import from Jira" feature in settings
- Track `jiraIssueKey` in estimation object
- Implement conflict detection/resolution
- Build field mapping (Jira → Estimation)
- Add "Update Jira" vs "Create New Issue" logic

**Signal to Trigger Phase 2:**
- User requests bidirectional sync
- Multiple users need to collaborate on same estimation via Jira
- Need for version control/audit trail in Jira

---

## Testing Strategy

### Manual Testing Checklist

**Settings Configuration:**
- [ ] Configure Jira connection with valid credentials
- [ ] Test connection success scenario
- [ ] Test connection failure scenarios (invalid URL, wrong credentials, network error)
- [ ] Load projects dropdown successfully
- [ ] Select default project and issue type
- [ ] Save configuration persists across browser refresh
- [ ] Clear configuration resets all fields and removes from localStorage

**Custom Field Discovery:**
- [ ] Auto-detect finds existing Story Points and T-Shirt Size fields
- [ ] Manual field ID entry works
- [ ] Field validation detects invalid field IDs
- [ ] Graceful fallback when no custom fields exist (issue still created)

**Export Flow:**
- [ ] Export creates Jira issue with correct summary (projectName)
- [ ] Description contains full calculationBreakdown text
- [ ] Labels include: stage, complexity level, t-shirt size
- [ ] Activity labels included (first 10-15 activities)
- [ ] Story Points custom field populated correctly (if configured)
- [ ] T-Shirt Size custom field populated correctly (if configured)
- [ ] Issue type matches user selection (Epic/Story/Spike)
- [ ] Success message displays with clickable link to Jira issue
- [ ] Link opens correct Jira issue in new tab

**Error Scenarios:**
- [ ] Invalid Jira credentials show clear error message
- [ ] Network timeout handled gracefully (retry option)
- [ ] Project not found error
- [ ] Permission denied error (user can't create issues in project)
- [ ] Custom field write failure (issue created but field missing)
- [ ] Rate limit error (429 response)
- [ ] Malformed API token error

**Security:**
- [ ] API token not visible in browser console
- [ ] API token not exposed in network request logs
- [ ] Config stored in localStorage (not sessionStorage or cookies)
- [ ] No token leakage in error messages
- [ ] Clear config removes sensitive data completely

**Cross-Browser:**
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

### Acceptance Criteria

**Definition of Done:**
- User can configure Jira connection in Settings page
- Connection test validates credentials and shows success/failure
- User can export estimation to Jira with one click
- Jira issue is created with:
  - Summary = Project Name
  - Description = Full calculation breakdown
  - Labels = Stage, complexity, size, activities
  - Story Points custom field (if configured)
  - T-Shirt Size custom field (if configured)
  - Issue Type = User's selection (Epic/Story/Spike)
- Success message shows direct link to created Jira issue
- Errors are handled gracefully with clear user guidance
- Configuration persists across browser sessions
- README updated with setup instructions

---

## Security Considerations

### Current Approach (PAT in localStorage)

**Risks:**
- localStorage accessible to any JavaScript on same origin
- XSS vulnerabilities could leak token
- Token visible in browser developer tools
- No encryption (stored as plain text JSON)

**Mitigations:**
- Document security risk in UI ("Keep this browser secure")
- Add "Clear Configuration" button prominently in Settings
- Warn users not to use on shared computers
- Consider adding browser session timeout (clear config on browser close)

**Acceptable For:**
- Personal use tools
- Single-user environments
- Development/staging environments
- Non-sensitive Jira projects

**NOT Acceptable For:**
- Enterprise multi-user deployments
- Shared computer environments
- Production systems with sensitive data

### Future Improvements (Phase 2+)

**Option A: Backend Proxy Server**
- Add Node.js backend (Express)
- Backend stores encrypted tokens (server-side)
- Frontend calls backend, backend calls Jira
- Tokens never in browser
- Requires deployment and maintenance

**Option B: OAuth 2.0 with PKCE**
- Implement OAuth 2.0 authorization code flow
- Tokens stored in httpOnly cookies
- Refresh token rotation
- Industry-standard security
- Complex implementation (~40-60 hours)

**Recommendation:** Start with PAT for MVP (acceptable for personal tool). Upgrade to OAuth if enterprise deployment or multi-user support is needed.

---

## Open Questions for Team Discussion

1. **Jira Instance Type:**
   - Are users on Jira Cloud (.atlassian.net) or Jira Server/Data Center (self-hosted)?
   - This plan assumes Jira Cloud. Jira Server uses different authentication.

2. **Label Truncation Strategy:**
   - 68 possible activities exist. Should we:
     - Include first 10 activities as labels?
     - Only label activities with adjustments (Less/More Complex)?
     - Skip activity labels entirely (already in description)?
   - **Recommendation:** First 10 selected activities, to avoid Jira label limit issues.

3. **Epic Behavior:**
   - If user selects "Epic" issue type, should we:
     - Create Epic only?
     - Create Epic + child Stories (one per activity group)?
   - **Recommendation:** Epic only for MVP. Child stories can be Phase 2.

4. **Description Format:**
   - Jira Cloud uses Atlassian Document Format (ADF), not pure markdown
   - Should we:
     - Convert markdown → ADF (better formatting, more complex)
     - Use plain text paragraphs (simpler, loses formatting)
   - **Recommendation:** Plain text for MVP. ADF conversion in Phase 2 if needed.

5. **Story Points Field Validation:**
   - Should we validate that Story Points field accepts Fibonacci numbers (1,2,3,5,8,13)?
   - Should we validate that T-Shirt Size field accepts strings (XS,S,M,L,XL)?
   - **Recommendation:** Basic validation (field exists, is writable) for MVP. Schema validation in Phase 2.

6. **Multi-Project Support:**
   - Should users be able to select different projects at export time?
   - Or always use default project from settings?
   - **Recommendation:** Allow override in export modal (defaults to settings, can change per export).

---

## Critical Files Reference

| File Path | Purpose |
|-----------|---------|
| `/src/services/jiraService.js` | **NEW** - Core Jira REST API integration |
| `/src/pages/SettingsPage.jsx` | **NEW** - Jira configuration UI |
| `/src/components/export/JiraExportModal.jsx` | **NEW** - Export modal component |
| `/src/utils/storage.js` | **MODIFY** - Add Jira config storage functions |
| `/src/components/wizard/StepReport.jsx` | **MODIFY** - Add "Export to Jira" button |
| `/src/components/common/Layout.jsx` | **MODIFY** - Add Settings navigation link |
| `/src/App.jsx` | **MODIFY** - Add /settings route |
| `/src/context/EstimationContext.jsx` | **READ-ONLY** - Understand wizardData structure |
| `/src/utils/calculations.js` | **READ-ONLY** - Understand calculation logic |
| `/src/utils/constants.js` | **READ-ONLY** - Understand activities and stages |

---

## Verification Steps (Post-Implementation)

1. **Configure Jira Integration:**
   - Go to Settings page
   - Enter Jira URL: `https://your-domain.atlassian.net`
   - Enter email and create Personal Access Token from Jira
   - Click "Test Connection" → Should show success
   - Select default project from dropdown
   - Save configuration

2. **Create Estimation:**
   - Go to New Estimation
   - Fill out project info (Step 1)
   - Select activities (Step 2)
   - Rate complexity (Step 3)
   - Review (Step 4)
   - Go to Report (Step 5)

3. **Export to Jira:**
   - Click "Export to Jira" button
   - Select issue type (Story/Epic/Spike)
   - Verify preview shows correct data
   - Click "Export to Jira"
   - Wait for success message
   - Click link to view issue in Jira

4. **Verify in Jira:**
   - Issue exists in correct project
   - Summary = estimation project name
   - Description contains calculation breakdown
   - Labels include stage, complexity, activities
   - Story Points = estimation finalPoints (if custom field configured)
   - T-Shirt Size = estimation finalTShirtSize (if custom field configured)
   - Issue type matches selection

5. **Test Error Scenarios:**
   - Try exporting with invalid credentials (should show clear error)
   - Try exporting to non-existent project (should show error)
   - Try exporting without Jira config (should prompt to configure)

---

## Success Metrics

**User Experience:**
- Time to configure Jira integration: < 5 minutes
- Time to export estimation to Jira: < 30 seconds
- Success rate of exports: > 95%

**Technical:**
- Zero breaking changes to existing estimation flow
- Jira configuration persists across browser sessions
- All error states have clear user guidance
- Export creates properly formatted Jira issues

**Business:**
- Reduces manual data entry time (copying estimates to Jira)
- Maintains detailed estimation history in Jira
- Enables better project planning with story points in Jira

---

## Next Steps for Scrum Master / Development Team

1. **Review this plan** with Product Owner and stakeholders
2. **Validate assumptions** (Jira Cloud vs Server, custom fields exist, etc.)
3. **Answer open questions** listed above
4. **Create user stories** from implementation steps (one story per component)
5. **Estimate effort** for each story (team's velocity)
6. **Prioritize backlog** (Phase 1 MVP vs Phase 2 enhancements)
7. **Assign tasks** to developers
8. **Set up test Jira instance** for development/testing
9. **Define sprint goals** (e.g., Sprint 1 = Settings + API Service, Sprint 2 = Export Flow)
10. **Schedule kickoff** and review sessions

**Estimated Total Effort:** 12-16 hours for Phase 1 MVP (one-way export)

**Suggested Sprint Breakdown:**
- Sprint 1 (Week 1): Core API service + Settings page + Testing
- Sprint 2 (Week 2): Export modal + Integration + Polish + Documentation
