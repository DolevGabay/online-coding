## Getting started
- for localhost , git clone https://github.com/DolevGabay/online-coding.git
- npm install
- node server.js
- npm start

## Deployment
- Deploy the app on an AWS EC2 instance, both the frontend and the backend.
- Frontend address: http://3.68.213.133:8000
- Backend address: http://3.68.213.133:3000

## Princepels used
- MVC Design Pattern - Components are independent and can be developed, tested, and maintained separately, enhancing the overall structure and readability of the code.

- Sockets: Used to maintain persistent connections and automatically update code blocks in real-time.

- Multi threads Server: The main server handles initial requests and creates separate "rooms" for mentors and 
students. Each room runs on its own thread with its own "room server".

- Scalability: Easily add more code blocks by navigating to /create-code-block and creating a new one.

- Reusability - Components like codeEditor that can be used is many places in the code.

## Features
- Real-Time Updates: Code changes made by mentors and students are instantly reflected across all connected clients.

- Isolated Rooms: Each mentor-student pair works in an isolated room, ensuring a focused and personalized coding session.

- Syntax Highlighting: Integrated with Prism.js for syntax highlighting in code blocks.

- Solution Verification: Students can check if their code matches the provided solution with a smiley face indicator.

- There can be only one room of each code block at any time with one mentor and many students.