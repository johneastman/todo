export type DataManagerType = "UPDATE_MESSAGE";

export type DataManagerState = {
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

export function dataManagerReducer(
    prevState: DataManagerState,
    action: DataManagerAction
) {
    switch (action.type) {
        case "UPDATE_MESSAGE": {
            const { newMessage } = action as UpdateMessage;
            return { message: newMessage };
        }

        default: {
            throw Error(
                `Unknown action for data manager reducer: ${action.type}`
            );
        }
    }
}
