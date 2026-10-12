# Section B: Short Answer Questions

***6. Explain the Purpose of `express.Router()` in the Code Above.***

express.Router() is used to create a different router that manages related routes in an Express.js apps. It helps organize code by grouping related routes into separate files instead of putting all in one file. This makes the application easier to read, maintain, and reuse.




***7. How would you implement error handling in the Express routes to ensure that any issues (such as file not found or server errors) are appropriately handled? Provide an example.***

Error handling in express.js can be implemented using try...catch blocks and error-handling middleware. This ensures that errors, such as a file not being found or a server problem, return appropriate HTTP status codes and helpful messages instead of crashing the application.

```js
// 404 for unknown routes (after all routes)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Centralized error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'ENOENT') {
    return res.status(404).send('File Not Found');
  }

  res.status(500).send('Internal Server Error');
});
```


# Section C: Bonus


***Explain how the `app.listen(process.env.port || 8081)` line works and why it's useful in production environments.***

This line starts the Express.js server and makes it listen for incoming requests on a specific port.

process.env.port checks for a port number set in the env variables.

|| 8081 uses port 8081 as the default if the not set.

Hosting platforms can assign a port dynamically through environment variables. This allows the application to run in different environments without changing the source code.
