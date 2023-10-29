import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Username",

      credentials: {
        name: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log(
          "Next-Auth - Request for login",
          req.body!.user,
          req.body!.password
        );

        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/login/auth",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: req.body!.user,
              password: req.body!.password,
            }),
          }
        );
        const dbuser = await res.json();
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
        console.log("Next-Auth - Result of the login", user);
        console.log("Next Auth result of auth call:", dbuser);

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});
