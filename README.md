# Product Management Frontend

A React-based frontend application for managing product catalogs, featuring multi-part image uploads and optimized production builds.

##  Features

* **Product Creation:** Add products with metadata (ID, Name, Price, Category, Description).
* **Multi-Image Upload:** Supports selecting and uploading multiple files via `multipart/form-data`.
* **API Integration:** Pre-configured Axios instance for backend communication.
* **Form Validation:** Controlled components with state management.

##  Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your backend URL:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.  
*Note: Our CI pipeline treats ESLint warnings as errors. Ensure all variables are used before deploying.*

## Project Structure

* `src/pages/AddProduct.js`: The main form component for adding new products.
* `src/api.js`: Axios configuration for API requests.
* `src/App.js`: Main routing and application entry point.

## Common Build Issues

If the build fails with `[eslint] no-unused-vars`, ensure that all state setters (like `setProductData`) are properly utilized in your functions. In CI environments, warnings are treated as fatal errors to ensure code quality.

---

## Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
