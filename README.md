# Raja Home Decor - Frontend

This is the frontend application for Raja Home Decor, a modern e-commerce platform built with React, TypeScript, and Vite.

## 🚀 Technologies

*   **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
*   **Payment:** Razorpay Integration

## 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/eramit01/raja-home-decor-frontend.git
    cd raja-home-decor-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill in the required values:
    ```bash
    cp .env.example .env
    ```
    *   `VITE_API_URL`: URL of your backend API
    *   `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID
    *   `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

## 📂 Project Structure

*   `src/components`: Reusable UI components
*   `src/pages`: Application pages (Home, ProductDetails, Cart, etc.)
*   `src/store`: Redux store configuration and slices
*   `src/services`: API service calls
*   `src/types`: TypeScript interfaces and types
