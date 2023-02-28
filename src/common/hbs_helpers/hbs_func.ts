import { FunctionObject } from "express-handlebars/types";

export const hbsHelper: FunctionObject = {
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
    }
};