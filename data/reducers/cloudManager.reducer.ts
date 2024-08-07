export type CloudManagerType =
    | "UPDATE_MESSAGE"
    | "UPDATE_LOADING"
    | "UPDATE_ALL";

export type CloudManagerState = {
    isLoading: boolean;
    message?: string;
};

export interface CloudManagerAction {
    type: CloudManagerType;
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
    newLoading: boolean;
    newMessage?: string;
    constructor(newLoading: boolean, newMessage?: string) {
        this.newLoading = newLoading;
        this.newMessage = newMessage;
    }
}

export function cloudManagerReducer(
    prevState: CloudManagerState,
    action: CloudManagerAction
): CloudManagerState {
    switch (action.type) {
        case "UPDATE_MESSAGE": {
            const { newMessage } = action as UpdateMessage;
            return { ...prevState, message: newMessage };
        }

        case "UPDATE_LOADING": {
            const { newLoading } = action as UpdateLoading;
            return { ...prevState, isLoading: newLoading };
        }

        case "UPDATE_ALL": {
            const { newLoading, newMessage } = action as UpdateAll;
            return { message: newMessage, isLoading: newLoading };
        }

        default: {
            throw Error(
                `Unknown action for data manager reducer: ${action.type}`
            );
        }
    }
}
