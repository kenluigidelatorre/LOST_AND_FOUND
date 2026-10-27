const db = require("./db");
const SQL = "INSERT INTO notifications (user_id, message, type, link) ";
exports.notify = (userId, message, type = "info", link = null, client = db) =>
  client.query(SQL + "VALUES ($1,$2,$3,$4)", [userId, message, type, link]);
exports.notifyAdmins = (message, type = "info", link = null, client = db) =>
  client.query(SQL + "SELECT id,$1,$2,$3 FROM users WHERE role='admin'", [
    message,
    type,
    link,
  ]);
