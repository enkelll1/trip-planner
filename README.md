<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>README</title>
</head>
<body>

<h1>Trip Planner</h1>

<p>This project is a NestJS application that interacts with MongoDB and Redis, built to be flexible for deployment either with or without Docker.</p>

<h2>Getting Started</h2>

<h3>Building with Docker</h3>
<ol>
    <li>Clone the repository:
        <pre><code>git clone https://github.com/enkelll1/manage-starred-repo.git</code></pre>
    </li>
    <li>Build the Docker containers:
        <pre><code>docker-compose build</code></pre>
    </li>
    <li>Start the application:
        <pre><code>docker-compose up</code></pre>
    </li>
</ol>

<h3>Building Without Docker</h3>
<ol>
    <li>Update your environment variables:
        <ul>
            <li>Rename <code>.env.example</code> to <code>.env</code>.</li>
            <li>Modify the MongoDB and Redis credentials in your <code>.env</code> file according to your own setup.</li>
        </ul>
    </li>
    <li>Install dependencies:
        <pre><code>npm install</code></pre>
    </li>
    <li>Run tests (optional):
        <pre><code>npm run test</code></pre>
    </li>
    <li>Start the application:
        <pre><code>npm start</code></pre>
    </li>
</ol>

<h2>Application Access</h2>
<ul>
    <li><strong>App:</strong> <code>http://localhost:3000</code></li>
    <li><strong>API Documentation (Swagger):</strong> <code>http://localhost:3000/api-docs</code></li>
</ul>

<h2>Notes</h2>
<ol>
    <li><strong>Modules:</strong>
        <ul>
            <li>I’ve used the <code>TravelModule</code> to handle data from the third-party API.</li>
            <li>The <code>TripModule</code> is responsible for managing trips. This separation improves code readability and simplifies testing.</li>
            <li>Some additional, optional fields are included in the <code>Trip</code> model for enhanced flexibility.</li>
        </ul>
    </li>
    <li><strong>MongoDB Security:</strong>
        <ul>
            <li>The MongoDB instance in the Docker container lacks extensive security configurations to allow easy setup without requiring manual creation of root users, etc.</li>
            <li>If you need a more secure MongoDB URL, I can provide one from a cloud-hosted database with all necessary security options.</li>
        </ul>
    </li>
    <li><strong>JWT Authentication:</strong>
        <ul>
            <li>I have used JWT to protect endpoints. You just have to register a user based on a field described, log in, and use the JWT in the endpoints with the <code>Bearer</code> header.</li>
        </ul>
    </li>
    <li><strong>Code Compromises:</strong>
        <ul>
            <li>Certain compromises were made in the code to align with the logic of the use cases. Please refer to the comments in the codebase for details.</li>
        </ul>
    </li>
</ol>

</body>
</html>