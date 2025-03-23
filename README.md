# Allergy Identifier

## Live Site

The application is hosted on Vercel:

> [Allergy Identifier](https://allergy-identifier.vercel.app/)

## Overview

Allergy Identifier is a React-based application designed to help users identify potential allergens in products by scanning images and comparing them against known allergens and ailments. The application leverages KendoReact components, React Router, and Google Generative AI for a seamless user experience.


## Features

- **User Authentication:** Secure login and registration.
  - **Login Page:** Allows users to log in with their credentials.
  - **Register Page:** Enables new users to create an account.

- **Ailment Management:** Users can manage their known ailments.
  - **Ailments Page:** Users can add, edit, and delete their known ailments. This information is used to cross-reference scanned products for potential allergens.

- **Product Scanning:** Scan product images to identify potential allergens.
  - **Scan Ingredients Page:** Users can upload images of product ingredients. The application uses Google Generative AI to analyze the image and identify potential allergens based on the user's known ailments.

- **Expiry Tracking:** Track products nearing or past their expiry date.
  - **Expiry Products Page:** Displays a list of products that are nearing their expiry date or have already expired. Users can add new products with expiry dates and receive notifications as the expiry date approaches.

- **Group Management:** Manage user groups for shared allergen information.
  - **Groups Page:** Users can create and manage groups to share allergen information with others. This is useful for families or communities with shared dietary restrictions.
  - **Update Group Page:** Allows users to update group details and manage group members.

- **Notifications:** Real-time notifications for important updates.
  - **Notification System:** Users receive real-time notifications for various events, such as product expiry alerts, group updates, and scan results.

## Installation

To run the application locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/allergy-identifier.git
    ```
2. Navigate to the project directory:
    ```sh
    cd allergy-identifier
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. In the existing .env file, add your own gen AI API key:
    ```env
    REACT_APP_GENAI_API_KEY=your_api_key
    ```
5. Start the development server:
    ```sh
    npm start
    ```

## Usage

1. Open the application in your browser:
    ```sh
    http://localhost:3000
    ```
2. Register or log in to your account.
3. Navigate through the dashboard to manage ailments, scan products, and track expiry dates.

## Technologies Used

- **React:** Frontend library for building user interfaces.
- **KendoReact:** UI components for React.
- **React Router:** Declarative routing for React applications.
- **Google Generative AI:** AI-powered image analysis.
- **Vercel:** Hosting platform for the live site.

## KendoReact Components Used

- `@progress/kendo-react-buttons`
  - `Button`: Used for various clickable buttons throughout the application.
  - `FloatingActionButton`: Used for floating action buttons to trigger primary actions.
  - `Chip`: Used for displaying small blocks of information, such as tags or categories.

- `@progress/kendo-react-layout`
  - `AppBar`: Used for the top navigation bar.
  - `AppBarSection`: Used to divide the AppBar into sections.
  - `AppBarSpacer`: Used to create space between AppBar sections.
  - `Drawer`: Used for the sidebar navigation.
  - `DrawerContent`: Used to define the content within the Drawer.
  - `Card`: Used for displaying content in a card layout.
  - `TabStrip`: Used for tabbed navigation.
  - `TabStripTab`: Used to define individual tabs within the TabStrip.
  - `ExpansionPanel`: Used for expandable/collapsible content sections.
  - `ExpansionPanelContent`: Used to define the content within the ExpansionPanel.
  - `Dialog`: Used for modal dialogs.

- `@progress/kendo-react-inputs`
  - `TextBox`: Used for text input fields.
  - `AutoComplete`: Used for input fields with autocomplete functionality.
  - `DropDownList`: Used for dropdown selection fields.
  - `DatePicker`: Used for date selection fields.
  - `Input`: Used for various input fields.

- `@progress/kendo-react-indicators`
  - `Loader`: Used to display loading indicators.

- `@progress/kendo-react-notification`
  - `Notification`: Used to display notifications.
  - `NotificationGroup`: Used to group multiple notifications together.

- `@progress/kendo-react-animation`
  - `Fade`: Used for fade-in and fade-out animations.
  - `Reveal`: Used for reveal animations.

- `@progress/kendo-react-common`
  - `Typography`: Used for text styling and typography.

- `@progress/kendo-react-tooltip`
  - `Tooltip`: Used to display tooltips.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributors

* **S.Dinesh**
* **N.J.K.Vamsi**
* **P.S.S.Hrithik**
