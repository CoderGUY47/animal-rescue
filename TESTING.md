# Testing Report

This report outlines the test coverage, automated test executions, and manual validation scenarios designed to guarantee the correctness of the **Animal Rescue Connect** application.

---

## 🤖 Automated Unit Tests

We installed **Vitest** to run atomic unit tests against the state slices of the Redux store.

### Test Execution Commands

```bash
npm run test
```

### Test Outcomes

All tests passed successfully:

- **reportsSlice Reducer:**
  - `should add a new report correctly` — verified that emergency cases are correctly saved to the Redux store with dynamically generated UUIDs, correct timestamps, coordinates, and pending states.
  - `should update a report status correctly` — verified that state transitions ( from `pending` to `in-progress` or `resolved`) update appropriately in memory.
- **volunteersSlice Reducer:**
  - `should register a volunteer correctly` — verified that volunteers are successfully tracked and saved with zero baseline rescues.

```text
 RUN  v4.1.9 C:/Users/Hridoy/Desktop/animal-rescue

 ✓ src/store/slices/store.test.ts (3 tests) 9ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Duration  357ms
```

---

## 🙋 Manual Validation Scenarios

We verified the following flows manually to ensure a reliable end-user experience.

### 1. Emergency Geolocation Capture

- **Scenario:** User opens the "Report Emergency" form.
- **Expected Result:**
  - Browser prompts for GPS location access.
  - Once allowed, the current location details input is automatically pre-filled with the reverse-geocoded address.
  - A green `📍 GPS Captured` pill is rendered.
  - Upon submission, coordinates are passed alongside report information to the Redux store.

### 2. Active Rescues Mapping

- **Scenario:** Navigate to the "Map" tab.
- **Expected Result:**
  - Active (non-resolved) rescues from Redux are loaded and displayed on the interactive MapLibre map.
  - Custom markers are styled dynamically based on case status (pulsing red for pending, pulsing blue for in-progress).
  - Popup descriptors allow quick reading of animal type, condition, and location text, and include a link pointing to the rescue case details view.

### 3. Dynamic Detail Actions

- **Scenario:** Click on a rescue case pin from the map or report list.
- **Expected Result:**
  - The page at `/rescues/{id}` fetches and loads details dynamically from Redux.
  - Clicking "Respond to Rescue" transitions the state to `in-progress`.
  - Clicking "Mark as Resolved" updates status to `resolved` (moving the case off the active discovery map).

### 4. Live Service Discovery Pages

- **Scenario:** Click on a veterinary clinic marker on the map, then click "Navigate" or click on the clinic's name.
- **Expected Result:**
  - The application routes to `/services/{id}` and fetches OSM node details dynamically from the Overpass API.
  - Real details (opening hours, phone numbers, websites, services offered) are rendered correctly.

### 5. AI First-Aid Rescue Chatbot

- **Scenario:** Click the floating medical briefcase FAB in the bottom right corner.
- **Expected Result:**
  - The AI First-Aid Rescue Chatbot panel slides up.
  - Bot greets the user and displays quick first-aid action buttons (Bleeding, Broken Bone, Heat Stroke, Choking).
  - Clicking any quick action button automatically posts the prompt and triggers corresponding first-aid guidelines.
  - Sending custom search queries calls the API route `/api/chat` securely. If no `OPENAI_API_KEY` is configured in `.env`, the engine falls back to smart diagnostic mock guides.
