// middleware/requestCounter.js
let totalRequests = 0;

export function requestCounter(req, res, next) {
  totalRequests++;
  next();
}

export function getTotalRequests() {
  return totalRequests;
}
