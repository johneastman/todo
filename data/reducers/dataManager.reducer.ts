export type DataManagerType =
    | "UPDATE_MESSAGE"
    | "UPDATE_LOADING"
    | "UPDATE_ALL";

export type DataManagerState = {
    isLoading: boolean;
    message?: string;
};

export interface DataManagerAction {
    type: DataManagerType;
}

export class UpdateMessage implements DataManagerAction {
    type: DataManagerType = "UPDATE_MESSAGE";
    newMessage?: string;
    constructor(newMessage?: string) {
        this.newMessage = newMessage;
    }
}

export class UpdateLoading implements DataManagerAction {
    type: DataManagerType = "UPDATE_LOADING";
    newLoading: boolean;
    constructor(newLoading: boolean) {
        this.newLoading = newLoading;
    }
}

export class UpdateAll implements DataManagerAction {
    type: DataManagerType = "UPDATE_ALL";
    newLoading: boolean;
    newMessage?: string;
    constructor(newLoading: boolean, newMessage?: string) {
        this.newLoading = newLoading;
        this.newMessage = newMessage;
    }
}

export function dataManagerReducer(
    prevState: DataManagerState,
    action: DataManagerAction
): DataManagerState {
    const { isLoading, message } = prevState;

    switch (action.type) {
        case "UPDATE_MESSAGE": {
            const { newMessage } = action as UpdateMessage;
            return { message: newMessage, isLoading: isLoading };
        }

        case "UPDATE_LOADING": {
            const { newLoading } = action as UpdateLoading;
            return { message: message, isLoading: newLoading };
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
