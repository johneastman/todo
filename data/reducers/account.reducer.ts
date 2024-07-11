export type Account = {
    username?: string;
    isAccountCreationModalVisible: boolean;
    error?: string;
};

export type AccountActionType =
    | "UPDATE_USERNAME"
    | "UPDATE_IS_ACCOUNT_CREATION_MODAL_VISIBLE"
    | "UPDATE_ACCOUNT_CREATION_ERROR"
    | "DELETE_ACCOUNT";

export interface AccountAction {
    type: AccountActionType;
}

export class UpdateUsername implements AccountAction {
    type: AccountActionType = "UPDATE_USERNAME";
    newUsername: string | undefined;
    constructor(newUsername: string | undefined) {
        this.newUsername = newUsername;
    }
}

export class UpdateIsAccountCreationModalVisible implements AccountAction {
    type: AccountActionType = "UPDATE_IS_ACCOUNT_CREATION_MODAL_VISIBLE";
    isAccountCreationModalVisible: boolean;
    constructor(isAccountCreationModalVisible: boolean) {
        this.isAccountCreationModalVisible = isAccountCreationModalVisible;
    }
}

export class UpdateAccountCreationError implements AccountAction {
    type: AccountActionType = "UPDATE_ACCOUNT_CREATION_ERROR";
    error: string;
    constructor(error: string) {
        this.error = error;
    }
}

export class DeleteAccount implements AccountAction {
    type: AccountActionType = "DELETE_ACCOUNT";
}

export function accountReducer(
    prevState: Account,
    action: AccountAction
): Account {
    const prevStateWithoutError: Account = {
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

        case "UPDATE_IS_ACCOUNT_CREATION_MODAL_VISIBLE": {
            const { isAccountCreationModalVisible } =
                action as UpdateIsAccountCreationModalVisible;
            return {
                ...prevStateWithoutError,
                isAccountCreationModalVisible: isAccountCreationModalVisible,
            };
        }

        case "UPDATE_ACCOUNT_CREATION_ERROR": {
            const { error } = action as UpdateAccountCreationError;
            return {
                ...prevStateWithoutError,
                error: error,
            };
        }

        case "DELETE_ACCOUNT": {
            return {
                ...prevStateWithoutError,
                username: undefined,
                isAccountCreationModalVisible: true,
            };
        }

        default: {
            throw Error(
                `Unknown action for account state reducer: ${action.type}`
            );
        }
    }
}
