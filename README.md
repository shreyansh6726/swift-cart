# Swift-Cart: Multi-Vendor System
A robust MERN stack application featuring role-based access control (RBAC), secure image uploads, and persistent authentication.

## Key Features Implemented
Dual Authentication System: Separate login flows for Customers and Retailers.

Role-Based Access Control (RBAC): Custom middleware to restrict sensitive actions (like adding products) to Retailer accounts only.

Secure Product Management: Full CRUD capability with Mongoose validation.

Cloudinary Integration: Multi-image upload handling using multer and multer-storage-cloudinary.

Persistent Login: State management via React Context API and LocalStorage to keep users logged in across sessions.

### Backend Architecture (Node.js & MongoDB)
The backend follows an MVC (Model-View-Controller) pattern for scalability.

1. Data Models (/models)
User Models: Separate schemas for Customer and Retailer.

Product Model: Stores product details, an array of Cloudinary image URLs, and a soldBy reference linked to the Retailer ID.

2. Security Middleware (/middleware)
protect: Decodes the JWT from the Authorization header, identifies the user type, and attaches the user object to req.user.retailerOnly: Guards routes to ensure only users with the retailer role can proceed.

3. Image Upload Pipeline (/config)
Uses Multer to parse multipart/form-data and stream images directly to Cloudinary, returning secure URLs to be saved in MongoDB.

### Frontend Implementation (React)
1. API Configuration (/api/index.js)
A centralized Axios instance configured with a baseURL and an interceptor that automatically attaches the JWT token to every outgoing request.

2. Authentication Context (/context)
Uses the Context API to provide a global user state. It initializes by checking localStorage, fulfilling your requirement to keep users logged in even after closing the browser.

3. Add Product Logic
A complex form utilizing FormData to handle both text fields (Product ID, Name, Price) and binary file data (up to 10 images).

## Installation & Setup
Prerequisites
1. Node.js & npm

2. MongoDB Atlas Account

3. Cloudinary Account

4. Environment Variables (.env)
Create a ```.env``` file in the server directory:

Code snippet
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Running the App
Backend: ```cd server && npm run dev``` (Runs on port 5000)

Frontend: ```cd client && npm start``` (Runs on port 3000)