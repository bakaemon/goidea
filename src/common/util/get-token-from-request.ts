import { HttpException } from '@nestjs/common';
export const getTokenFromRequest = (req) => {
    let token, refreshToken;

    const tokenQuery = req.query.token;
    
    if (tokenQuery) {
        token = tokenQuery;
    }
    const tokenBody = req.body.token;
    if (tokenBody) {
        token = tokenBody;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (req.cookies) {
        token = req.cookies['token'];
    }
    refreshToken = req.cookies['refresh_token'];
    return{ token, refreshToken};
}

export const getTokenFromCookies = (req) => {
    try {
        const token = req.cookies['token'];
    const refreshToken = req.cookies['refresh_token'];
    return {
        token,
        refreshToken
    };
    }
    catch(error) {
        console.log(error);
        return {
            token: null,
            refreshToken: null
        }
    }
}