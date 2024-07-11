exports.Config = {
  PORT: process.env.PORT || 5000,
  JWTSECRET: {
    SECRET: process.env.ENCRYPTION_KEY || "TOUGHESTSECRETEVER",
  },
  responseCode: {
    success: "SUCCESS",
    error: "ERROR",
  },
};
