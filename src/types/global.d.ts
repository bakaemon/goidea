declare module "mongoose" {
    interface QueryOptions {
        select?: string;
        populate?: PopulateOptions | (PopulateOptions | string)[];
        nullable?: boolean;
    }
}

declare module "mongoose" {
    interface PaginateOptions {
        select?: string;
        populate?: PopulateOptions | (PopulateOptions | string)[];
        nullable?: boolean;
    }
}

type ReactionResponse = {
    code: string;
    quantity: number;
    author: any[]
    [index: string]: any;
}

type VoteTypes = "none" | "upvote" | "downvote";

interface PaginatedDocumentsResponse<T> {
    // data: T[];
    //paginationOptions: Partial<import("mongoose").PaginateResult<T>>;
    data: any;
    paginationOptions: any;
}

interface ResponseBody {
    message?: string;
    data?: any;
    success?: boolean;
    paginationOptions?: Partial<import("mongoose").PaginateResult<T>>;
}

interface AuthConfig {
    grantType: string,
    redirectUri: string,
    clientID: string,
    clientSecret: string,
}

interface AuthData {
    grantType?: string,
    clientID?: string,
    clientSecret?: string,
    refreshToken?: string,
    code?: string,
}

interface TokenPayload {
    accountId: string
}

interface SSOConfig {
    grantType: string,
    redirectUri: string,
    authorizationCode: string,
}

interface NotificationOptions {
    save?: boolean;
}
