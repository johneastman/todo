export type CloudManagerType =
    | "UPDATE_CURRENT_USER"
    | "UPDATE_ALL_USERS"
    | "UPDATE_MESSAGE"
    | "UPDATE_LOADING"
    | "UPDATE_ALL";

export type CloudManagerState = {
    isLoading: boolean;
    currentUser: string;
    allUsers: string[];
    message?: string;
};

export interface CloudManagerAction {
    type: CloudManagerType;
}

export class UpdateCurrentUser implements CloudManagerAction {
    type: CloudManagerType = "UPDATE_CURRENT_USER";
    newUser: string;
    constructor(newUser: string) {
        this.newUser = newUser;
    }
}

export class UpdateAllUsers implements CloudManagerAction {
    type: CloudManagerType = "UPDATE_ALL_USERS";
    newAllUsers: string[];
    constructor(newAllUsers: string[]) {
        this.newAllUsers = newAllUsers;
    }
}

export class UpdateMessage implements CloudManagerAction {
    type: CloudManagerType = "UPDATE_MESSAGE";
    newMessage?: string;
    constructor(newMessage?: string) {
        this.newMessage = newMessage;
    }
}

export class UpdateLoading implements CloudManagerAction {
    type: CloudManagerType = "UPDATE_LOADING";
    newLoading: boolean;
    constructor(newLoading: boolean) {
        this.newLoading = newLoading;
    }
}

export class UpdateAll implements CloudManagerAction {
    type: CloudManagerType = "UPDATE_ALL";
    newUser: string;
    newAllUsers: string[];
    newLoading: boolean;
    newMessage?: string;
    constructor(
        newUser: string,
        newAllUsers: string[],
        newLoading: boolean,
        newMessage?: string
    ) {
        this.newUser = newUser;
        this.newAllUsers = newAllUsers;
        this.newLoading = newLoading;
        this.newMessage = newMessage;
    }
}

export function cloudManagerReducer(
    prevState: CloudManagerState,
    action: CloudManagerAction
): CloudManagerState {
    switch (action.type) {
        case "UPDATE_CURRENT_USER": {
            const { newUser } = action as UpdateCurrentUser;
            return {
                ...prevState,
                currentUser: newUser,
            };
        }

        case "UPDATE_ALL_USERS": {
            const { newAllUsers } = action as UpdateAllUsers;
            return {
                ...prevState,
                allUsers: newAllUsers,
            };
        }

        case "UPDATE_MESSAGE": {
            const { newMessage } = action as UpdateMessage;
            return { ...prevState, message: newMessage };
        }

        case "UPDATE_LOADING": {
            const { newLoading } = action as UpdateLoading;
            return { ...prevState, isLoading: newLoading };
        }

        case "UPDATE_ALL": {
            const { newUser, newAllUsers, newLoading, newMessage } =
                action as UpdateAll;
            return {
                currentUser: newUser,
                allUsers: newAllUsers,
                message: newMessage,
                isLoading: newLoading,
            };
        }

        default: {
            throw Error(
                `Unknown action for data manager reducer: ${action.type}`
            );
        }
    }
}
