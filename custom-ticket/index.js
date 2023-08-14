const client = require('prom-client');
const express = require('express');
const app = express();
const { histogram } = require('./histogram');
const { gauge } = require('./gauge');
const { summary } = require('./summary');
const { counter } = require('./counter');

// Create a Registry to register the metrics
const register = new client.Registry();
const PORT = 8081;

app.use(express.json());

// Add a default metrics and enable the collection of it
client.collectDefaultMetrics({
  app: 'custom-ticket',
  prefix: 'node_',
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
  register
});

// Create a histogram metric
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
});

// Register the histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Other custom metrics and its usage

// other histograms
histogram(register);

// gauge
gauge(register);

// summary
summary(register);

// counter
counter(register);

// Handlers
app.get('/metrics', async (req, res) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route.path;

  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

app.post('/data', (req, res) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  
  console.log(req.body);  // This will print the JSON body to the console

  res.status(200).json({ message: 'Data received successfully!' });

  // End timer and add labels
  end({ route: req.route.path, code: res.statusCode, method: req.method });
});

// Start the Express server and listen to a port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});
