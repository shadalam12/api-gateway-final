// Middleware: Log every request
export async function logRequest(req, res, next) {
  await RequestLog.sync();
  await RequestLog.create({
    url: req.url,
    ip_address: req.ip,
    created_at: new Date()
  });
  next();
}
