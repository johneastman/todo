export type LoginState = {
    username?: string;
    isLoginPageVisible: boolean;
    error?: string;
};

export type LoginActionType =
    | "UPDATE_USERNAME"
    | "UPDATE_IS_LOGIN_PAGE_VISIBLE"
    | "UPDATE_ACCOUNT_CREATION_ERROR"
    | "LOGOUT";

export interface LoginAction {
    type: LoginActionType;
}

export class UpdateUsername implements LoginAction {
    type: LoginActionType = "UPDATE_USERNAME";
    newUsername: string | undefined;
    constructor(newUsername: string | undefined) {
        this.newUsername = newUsername;
    }
}

export class UpdateIsLoginPageVisible implements LoginAction {
    type: LoginActionType = "UPDATE_IS_LOGIN_PAGE_VISIBLE";
    isLoginPageVisible: boolean;
    constructor(isLoginPageVisible: boolean) {
        this.isLoginPageVisible = isLoginPageVisible;
    }
}

export class UpdateAccountCreationError implements LoginAction {
    type: LoginActionType = "UPDATE_ACCOUNT_CREATION_ERROR";
    error: string;
    constructor(error: string) {
        this.error = error;
    }
}

export class Logout implements LoginAction {
    type: LoginActionType = "LOGOUT";
}

export function loginStateReducer(
    prevState: LoginState,
    action: LoginAction
): LoginState {
    const prevStateWithoutError: LoginState = {
        ...prevState,
        error: undefined,
    };

    switch (action.type) {
        case "UPDATE_USERNAME": {
            const { newUsername } = action as UpdateUsername;
            return {
                ...prevStateWithoutError,
                username: newUsername,
            };
        }

        case "UPDATE_IS_LOGIN_PAGE_VISIBLE": {
            const { isLoginPageVisible } = action as UpdateIsLoginPageVisible;
            return {
                ...prevStateWithoutError,
                isLoginPageVisible: isLoginPageVisible,
            };
        }

        case "UPDATE_ACCOUNT_CREATION_ERROR": {
            const { error } = action as UpdateAccountCreationError;
            return {
                ...prevStateWithoutError,
                error: error,
            };
        }

        case "LOGOUT": {
            return {
                ...prevStateWithoutError,
                username: undefined,
                isLoginPageVisible: true,
            };
        }

        default: {
            throw Error(
                `Unknown action for account state reducer: ${action.type}`
            );
        }
    }
}
