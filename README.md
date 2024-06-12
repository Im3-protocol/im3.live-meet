
### User Flow Diagram

**Web3 Login Page:**
- User logs in using their Web3 wallet.

**Main Page:**
- User sees two buttons: "Create Meeting" and "Join Meeting".

**1. Creating a Meeting:**
- User clicks on the "Create Meeting" button.
- The system generates a unique meeting URL.
- The system displays the meeting URL to the user.

**2. Joining a Meeting:**
- User clicks on the "Join Meeting" button.
- User is taken to a Join Meeting Page.
- User enters the meeting URL.
- User clicks "Join Meeting".
- The system verifies the meeting URL.
- If the URL is valid, the user is redirected to the Meeting Page.
- If the URL is invalid, an error message is displayed.

---

### Detailed User Flow

#### Web3 Login Page
- **Components:**
  - Title: "Welcome to IM3 Meet"
  - Button: "Login with Wallet"
- **Display:**
  ```
  --------------------------------------
  |          Welcome to IM3 Meet       |
  |                                    |
  |         [Login with Wallet]        |
  --------------------------------------
  ```
- **Action:**
  - User clicks "Login with Wallet".
  - User's Web3 wallet (e.g., MetaMask) is prompted to connect.
- **System Response:**
  - The system verifies the wallet connection.
  - **If the wallet is connected successfully:**
    - The user is redirected to the Main Page.
  - **If the wallet connection fails:**
    - An error message is displayed: "Failed to connect wallet. Please try again."
  - **Error Display:**
  ```
  --------------------------------------
  |          Welcome to IM3 Meet       |
  |                                    |
  |    [Failed to connect wallet.      |
  |        Please try again.]          |
  |         [Login with Wallet]        |
  --------------------------------------
  ```

#### Main Page
- **Components:**
  - Title: "Welcome to IM3 Meet"
  - Button 1: "Create Meeting"
  - Button 2: "Join Meeting"
- **Display:**
  ```
  --------------------------------------
  |          Welcome to IM3 Meet       |
  |                                    |
  |          [Create Meeting]          |
  |                                    |
  |          [Join Meeting]            |
  --------------------------------------
  ```

#### 1. Create Meeting Flow
- **Action:** User clicks "Create Meeting".
- **System Response:**
  - The system generates a unique meeting URL (e.g., `https://im3meet.com/meeting/12345`).
  - The system displays the generated URL to the user.
- **Display:**
  ```
  --------------------------------------
  |          Your Meeting URL          |
  |                                    |
  | https://im3meet.com/meeting/12345  |
  |                                    |
  |     [Copy URL] [Back to Main]      |
  --------------------------------------
  ```

#### 2. Join Meeting Flow
- **Action:** User clicks "Join Meeting".
- **System Response:**
  - The user is redirected to the Join Meeting Page.
- **Join Meeting Page:**
  - **Components:**
    - Title: "Join a Meeting"
    - Input Field: "Enter meeting URL"
    - Button: "Join Meeting"
  - **Display:**
  ```
  --------------------------------------
  |            Join a Meeting          |
  |                                    |
  |   [Enter meeting URL ___________]  |
  |                                    |
  |          [Join Meeting]            |
  --------------------------------------
  ```
- **Action:**
  - User enters the meeting URL.
  - User clicks "Join Meeting".
- **System Response:**
  - The system verifies the meeting URL.
  - **If the URL is valid:**
    - The user is redirected to the Meeting Page.
  - **If the URL is invalid:**
    - An error message is displayed: "Invalid meeting URL. Please try again."
  - **Error Display:**
  ```
  --------------------------------------
  |            Join a Meeting          |
  |                                    |
  |   [Enter meeting URL ___________]  |
  |                                    |
  |  [Invalid meeting URL. Try again.] |
  |          [Join Meeting]            |
  --------------------------------------
  ```

#### Meeting Page
- **Components:**
  - Title: "Meeting: [Meeting Name or ID]"
  - Video Display Area
  - Participants List (Sidebar)
  - Controls (Mute, Unmute, Video On/Off, End Call, Chat)
- **Display:**
  ```
  ------------------------------------------------
  | Meeting: [Meeting Name or ID]                |
  |----------------------------------------------|
  |                                              |
  |      [Video Display Area]                    |
  |                                              |
  |----------------------------------------------|
  | [Mute] [Unmute] [Video On/Off] [End Call] [Chat] |
  ------------------------------------------------
  | Participants:                                |
  | - User1                                      |
  | - User2                                      |
  | - User3                                      |
  ------------------------------------------------
  ```

---

### Summary of User Flow

1. **Web3 Login Page:**
   - User clicks "Login with Wallet".
   - System verifies wallet connection.
   - Successful connection → Redirect to Main Page.
   - Failed connection → Display error message.

2. **Main Page:**
   - Two buttons: "Create Meeting" and "Join Meeting".

3. **Create Meeting:**
   - Click "Create Meeting" → Generate URL → Display URL.

4. **Join Meeting:**
   - Click "Join Meeting" → Input URL → Verify URL.
   - Valid URL → Redirect to Meeting Page.
   - Invalid URL → Display error message.

5. **Meeting Page:**
   - Video display, participant list, and controls.

