import { ModalActionType, UpdateError } from "./common";

type ImportPageActionType = "UPDATE_TEXT";

interface ImportPageAction {
    type: ImportPageActionType | ModalActionType;
}

export type ImportPageState = {
    text: string;
    error?: string;
};

export class UpdateText implements ImportPageAction {
    type: ImportPageActionType = "UPDATE_TEXT";
    newText: string;
    constructor(newText: string) {
        this.newText = newText;
    }
}

export function importPageReducer(
    prevState: ImportPageState,
    action: ImportPageAction
): ImportPageState {
    const { text } = prevState;

    switch (action.type) {
        case "UPDATE_TEXT": {
            const { newText } = action as UpdateText;
            return { text: newText };
        }

        case "UPDATE_ERROR": {
            const { newError } = action as UpdateError;
            return { text: text, error: newError };
        }

        default: {
            throw Error(
                `Unknown action for import page view reducer: ${action.type}`
            );
        }
    }
}
