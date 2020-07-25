const userApp = require("./userServer");
const configUser = require("./configUser");
const adminApp = require("./adminServer");
const configAdmin = require("./configAdmin");

userApp.listen(configUser.port, () => {
  console.log(`API for user is running on port ${configUser.port}`);
});

adminApp.listen(configAdmin.port, () => {
  console.log(`API for user is running on port ${configAdmin.port}`);
});
