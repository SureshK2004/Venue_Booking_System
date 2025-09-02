📌 Venue Booking Platform

This project is a full-stack venue booking system built with:

Backend: Node.js, Express, Sequelize (MySQL), JWT Auth

Frontend: Next.js (TypeScript, TailwindCSS)

Database: MySQL

🚀 Features

      User authentication (register/login with JWT)
      
      Role-based access (Admin / Customer)
      
      Venue and hall management
      
      Booking creation with conflict detection
      
      RESTful API for frontend integration

🛠️ Backend Setup
1. Clone the repository
   
        git clone https://github.com/your-username/venue-booking.git
        cd venue-booking/backend

3. Install dependencies
   
        npm install

4. Setup environment variables

Create a .env file in /backend:

PORT=5000

# Database
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASS=root
    DB_NAME=venue

# JWT Secrets


    ACCESS_TOKEN_SECRET=youraccesstokensecret
    REFRESH_TOKEN_SECRET=yourrefreshtokensecret

# Frontend URL (for CORS)

    FRONTEND_URL=http://localhost:3000

4. Run backend server
   
        npm run dev


The server will start at:

    👉 http://localhost:5000

5. Seed database (optional)

To populate sample data:

node seed.js

🎨 Frontend Setup
1. Navigate to frontend

        cd ../frontend

3. Install dependencies

        npm install

5. Setup environment variables

Create .env.local in /frontend:

    NEXT_PUBLIC_API_URL=http://localhost:5000/api

4. Run frontend

        npm run dev


Frontend will run at:
👉 http://localhost:3000

🔑 Authentication Notes

    Register: POST /api/auth/register
    
    Login: POST /api/auth/login → returns accessToken & refreshToken
    
    Refresh Token: POST /api/auth/refresh
    
    Protected route example: GET /api/auth/profile

Known Issues:

    Authentication uses JWT tokens in cookies/localStorage. If you get 401 Unauthorized, check:
    
    NEXT_PUBLIC_API_URL is correct in frontend.
    
    FRONTEND_URL matches in backend .env.
    
    Run backend before frontend.
    
    Use "credentials": "include" in fetch requests.

✅ Example Test Users

After seeding (node seed.js), you can login with:

Admin

    email: "admin@example.com"
    password: "admin123"


Customer

    email: "jane@example.com"
    password: "password123"

📌 Scripts

npm run dev → start backend with nodemon

node seed.js → reset DB and insert sample data

npm run build → production build

 
Docker- Its a platform to used to build, shine and runs inside the container. I have learned Docker concepts and practiced with examples, but I couldn’t install it on my current laptop due to system restrictions. However, I understand containerization, how Docker images and containers work, and how to use Docker in real-world projects.

Redis - Redis is an in-memory database mainly used for fast data storage and retrieval. It helps applications run faster by handling caching, sessions, and quick lookups.  I have learned Redis concepts and practiced with examples, but I couldn’t install it on my current laptop due to system restrictions. However, I understand how Redis works as an in-memory data store, its use cases for caching, session management, and improving performance in real-world projects.
