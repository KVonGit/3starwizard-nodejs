# Streak Tracker

This project is a simple web application that allows users to track their streaks. It provides a single-page interface where users can view their streaks, add new users, increment their streaks, and delete users.

## Project Structure

```
streak-tracker
├── src
│   ├── server.js          # Entry point of the application
│   ├── routes
│   │   └── api.js         # API routes for handling streak operations
│   ├── public
│   │   ├── index.html      # HTML structure of the web page
│   │   ├── css
│   │   │   └── style.css   # Styles for the HTML page
│   │   └── js
│   │       └── main.js     # JavaScript for fetching data and handling user interactions
│   └── data
│       └── streakdata.json    # JSON file storing user data and streaks
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Features

- **Streak Check**: Load and display the current streaks from the JSON file.
- **Streak Start**: Add a new user with an initial streak of 0.
- **Streak Plus**: Increment the streak value for an existing user by 1.
- **Streak End**: Delete a user from the streaks.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd streak-tracker
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your web browser and go to `http://localhost:3000` to access the application.

## Usage

- Use the provided interface to manage user streaks.
- The application interacts with a JSON file to persist data, ensuring that user streaks are maintained across sessions.

## License

This project is licensed under the MIT License.