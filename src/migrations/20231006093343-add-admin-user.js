const bcryptjs = require('bcryptjs');

module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    const user_password = bcryptjs.hashSync("Admin@1234");
    await db.collection("users").insertOne({
      name: "Admin",
      email: "admin@gmail.com",
      user_password: user_password,
      role: "admin",
    });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
  },
};
