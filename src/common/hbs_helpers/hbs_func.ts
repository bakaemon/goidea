import { FunctionObject } from "express-handlebars/types";

export const hbsHelper: FunctionObject = {
    json: (content: any) => {
        return JSON.stringify(content);
    },
    setVar: (varName: string, varValue: string, options: any) => {
        if (!options.data.root) {
            options.data.root = {};
        }
        options.data.root[varName] = varValue;
    },
    // set variable in iteration without overriding
    setVarIter: (varName: string, varValue: string, options: any) => {
        if (!options.data.root) {
            options.data.root = {};
        }
        if (!options.data.root[varName]) {
            options.data.root[varName] = "";
        }
        options.data.root[varName] += varValue;
    },
    eq: (v1: any, v2: any, options: any) => {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ne: (v1: any, v2: any, options: any) => {
        if (v1 !== v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    lt: (v1: any, v2: any, options: any) => {
        if (v1 < v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    gt: (v1: any, v2: any, options: any) => {
        if (v1 > v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    lte: (v1: any, v2: any, options: any) => {
        if (v1 <= v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    gte: (v1: any, v2: any, options: any) => {
        if (v1 >= v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    and: (v1: any, v2: any, options: any) => {
        if (v1 && v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    is: (v1: any, v2: any, options: any) => {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    or: (v1: any, v2: any, options: any) => {
        if (v1 || v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    not: (v1: any, options: any) => {
        if (!v1) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
    
    
};