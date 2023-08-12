const client = require('prom-client');
const express = require('express');
const app = express();
const { histogram } = require('./histogram');
const { gauge } = require('./gauge');
const { summary } = require('./summary');
const { counter } = require('./counter');

// Create a Registry to register the metrics
const register = new client.Registry();

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
const createSlowDelayHandler = async (req, res) => {
  if ((Math.floor(Math.random() * 100)) === 0) {
    throw new Error('Internal Error')
  }

  // delay for 3-6 seconds
  const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3
  await new Promise(res => setTimeout(res, delaySeconds * 1000))

  res.end('Slow url accessed !!');
};
const createFastDelayHandler = async (req, res) => {
  if ((Math.floor(Math.random() * 100)) === 0) {
    throw new Error('Internal Error')
  }

  // delay for 200-800 ms
  const delaySeconds = Math.floor(Math.random() * (8 - 2)) + 2
  await new Promise(res => setTimeout(res, delaySeconds * 100))

  res.end('Fast url accessed !!');
};

app.get('/metrics', async (req, res) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route.path;

  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

app.get('/slow', async (req, res) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route.path;

  await createSlowDelayHandler(req, res);

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

app.get('/fast', async (req, res) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route.path;

  await createFastDelayHandler(req, res);

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

// Start the Express server and listen to a port
app.listen(8081, () => {
  console.log('Server is running on http://localhost:8081')
});