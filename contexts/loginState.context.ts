import { createContext } from "react";
import { LoginState, LoginAction } from "../data/reducers/loginState.reducer";

export type LoginContextData = {
    loginState: LoginState;
    loginStateDispatch: (action: LoginAction) => void;
};

export const defaultLoginData: LoginState = {
    username: undefined,
    isLoginPageVisible: false,
};

export const defaultLoginContextData: LoginContextData = {
    loginState: defaultLoginData,
    loginStateDispatch: (action: LoginAction) => {
        throw Error(
            "dispatch method for default account state context is not implemented"
        );
    },
};

export const LoginContext = createContext<LoginContextData>(
    defaultLoginContextData
);
