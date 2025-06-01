export default {
  jwt: {
    secret: process.env.JWT_SECRET 
    expiresIn: "7d",
    issuer: "larix-panel",
    audience: "users",
  },
  session: {
    enabled: true,
    cookieName: "larix_session",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET 
      callbackUrl: process.env.GOOGLE_CALLBACK_URL 
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID 
      clientSecret: process.env.GITHUB_CLIENT_SECRET 
      callbackUrl: process.env.GITHUB_CALLBACK_URL 
    },
  },
  roles: ["admin", "user", "moderator"],
  defaultRole: "user",
};
