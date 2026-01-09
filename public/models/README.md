# Pest Detection Model Placeholder

This directory is intended to hold the client-side TensorFlow.js (TFJS) model for pest and disease detection.

## How to Add a Real Model

For the application to use a custom-trained model, you must convert it to the TFJS format and place it in a subdirectory here.

1.  **Convert Your Model**:
    -   If you have a Keras model (`.h5` file), use the TensorFlow.js converter. Make sure you have `tensorflowjs` installed (`pip install tensorflowjs`).
    -   Run the converter:
        ```bash
        tensorflowjs_converter --input_format keras /path/to/your/model.h5 public/models/pest-model
        ```
    -   This command will generate a `model.json` file and several binary weight files (`.bin`) inside the `public/models/pest-model` directory.

2.  **Update the Code**:
    -   The application will automatically try to load a model from `/models/pest-model/model.json`.
    -   Once your model is in place, the fallback MobileNet classifier will no longer be used.
    -   You may need to adjust the class labels in `src/data/pests.js` to match your model's output classes.

## Important Notes

-   **Do not commit large model weights** to the Git repository. Use Git LFS or another method for handling large files if necessary.
-   Ensure the model is optimized for web performance (e.g., quantized) to keep the application responsive.
