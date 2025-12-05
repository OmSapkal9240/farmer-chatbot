# Farmer Advisory — UI Demo

This project is a frontend-only demonstration of a Farmer Advisory application, built with React, Vite, and Tailwind CSS. It is designed as a scaffold for a hackathon, featuring a modular interface for various farmer-centric services.

## Features

- **Crop Care Module**: A detailed, interactive guide for crop management.
- **Pest / Disease Detection**: A client-side AI module to identify crop issues from images.
- **Seasonal Advice**: An interactive calendar with monthly tasks and tips for selected crops.
- **Government Schemes**: A searchable database of central government schemes for farmers.
- **i18n Support**: Mock internationalization for English, Hindi, and Marathi.
- **Responsive Design**: Adapts to both desktop and mobile viewports.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd farmer-chat-ui
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## Crop Care Module Demo Instructions

Follow these steps to test the Crop Care feature:

1.  **Navigate to the Module**:
    - Open the application in your browser.
    - From the top navigation, click on **Modules** -> **Crop Care**.
    - The page should load with "Tomato" selected by default (or your last-viewed crop).

2.  **Explore Crop Details**:
    - Observe the two-column layout on desktop (or stacked on mobile).
    - The left panel shows the detailed view for the selected crop.
    - The right sidebar shows the crop list, quick facts, and a chat button.

3.  **Interact with Symptoms Tab**:
    - Click the **Symptoms** tab in the main content area.
    - Click on an accordion item, like "Early Blight", to expand it and see details.
    - Click the **"See Example Image"** button to open the image gallery modal.
    - Close the modal by clicking the 'X' or the backdrop.

4.  **Test Actions**:
    - Click the **"Download PDF"** button. A sample text file representing the crop plan should be downloaded.
    - Click the **"Save to My Farm"** button. You should see an alert confirming the crop was saved (this uses localStorage).

5.  **Test Chat Context**:
    - In the right sidebar, click the **"Start Chat (with crop context)"** button.
    - An alert will appear showing the pre-filled message that would be sent to a chat agent.

### Sample Chat Phrases

Try these phrases with the "Start Chat (with crop context)" action for the Crop Care module:

-   **English**: `I have Tomato - leaves with brown spots - location 421302`
-   **Hindi (mock)**: `मेरे पास टमाटर है - पत्तियों पर भूरे धब्बे हैं - स्थान 421302`
-   **Marathi (mock)**: `माझ्याकडे टोमॅटो आहे - पानांवर तपकिरी ठिपके आहेत - स्थान 421302`

## Developer Notes

-   **No Backend**: This is a frontend-only demo. All data is mocked in `src/data/crops.js`.
-   **API Hooks**: Files contain `TODO` comments indicating where to integrate real APIs for weather, pest diagnosis, and chat agents.
-   **Styling**: The project uses Tailwind CSS for utility-first styling.

## Pest Detection - Run & Replace Model

This module uses TensorFlow.js to perform inference directly in the browser. It includes a fallback mechanism for when a custom model is not present.

### How to Test

1.  **Open the page**: Navigate to **Modules → Pest / Disease Diagnosis**.
2.  **Upload an image**: Click **Upload File** or **Use Camera** to select a photo of a diseased plant leaf.
3.  **View results**: The model will analyze the image and display the top predictions with confidence scores and recommended actions.
4.  **Test actions**:
    -   Click **"Start Chat with this context"** to see a mock alert with a pre-filled message.
    -   Click **"Save Case"** to store the result in your browser's localStorage.

### How to Add a Custom TFJS Model

1.  **Convert your model** (e.g., a Keras `.h5` file) using the TensorFlow.js converter:
    ```bash
    # pip install tensorflowjs
    tensorflowjs_converter --input_format keras path/to/your/model.h5 public/models/pest-model
    ```
2.  This will create a `model.json` and several `.bin` weight files in `public/models/pest-model/`.
3.  The application will automatically detect and use this model. The fallback MobileNet classifier will be disabled.

### Sample Chat Phrases (Pest Detection)

-   **EN**: `Tomato — brown spots on leaves; please advise.`
-   **HI**: `मेरे प्याज के पत्तों पर पीले धब्बे हैं, क्या करूँ?`
-   **MR**: `माझ्या भाताच्या पिकावर साखळी पानांचे बदल दिसत आहेत.`

## Seasonal Advice Module Demo Instructions

### How to Test

1.  **Open the page**: Navigate to **Modules → Seasonal Advice**.
2.  **Select a crop and region**: Choose a crop like "Tomato" and enter a mock PIN, e.g., "421302".
3.  **Explore the calendar**: Click on a month chip (e.g., "May") to see the recommended tasks and contextual tips for that period.
4.  **Test actions**:
    -   Click **"Save Schedule"** to store the current view (crop, PIN, month) in localStorage.
    -   Click **"Download Schedule"** to save a `.json` or `.txt` file with the schedule details.
    -   In the task list, click **"Mark done"** on a task to see its state persist locally.

## Government Schemes Module Demo Instructions

### How to Test

1.  **Open the page**: Navigate to **Modules → Government Schemes**.
2.  **Search and Filter**: Use the search bar to find a scheme like "PM-Kisan" or filter by category, such as "Insurance".
3.  **View Details**: Click on a scheme card to see its detailed information in the right-hand panel, including tabs for eligibility, benefits, and how to apply.
4.  **Test Actions**:
    -   Click **"Open Official Page"** to be taken to the scheme's government website.
    -   Click **"Save Scheme"** and verify that it appears in a "Saved Schemes" section (mocked in the right column for this demo).
    -   Click **"Download Summary"** to get a simple text file with the scheme's key details.

-   **EN**: `Tomato — brown spots on leaves; please advise.`
-   **HI**: `मेरे प्याज के पत्तों पर पीले धब्बे हैं, क्या करूँ?`
-   **MR**: `माझ्या भाताच्या पिकावर साखळी पानांचे बदल दिसत आहेत.`
