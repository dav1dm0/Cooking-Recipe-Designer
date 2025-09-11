import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            userType: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        userType: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        userType: string;
    }
}
