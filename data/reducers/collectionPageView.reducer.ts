type CollectionPageViewActionType = "UPDATE_IS_DRAWER_VISIBLE";

interface CollectionPageViewAction {
    type: CollectionPageViewActionType;
}

export type CollectionPageViewState = {
    isDrawerVisible: boolean;
};

export class UpdateIsDrawerVisible implements CollectionPageViewAction {
    type: CollectionPageViewActionType = "UPDATE_IS_DRAWER_VISIBLE";
    newIsDrawerVisible: boolean;
    constructor(newIsDrawerVisible: boolean) {
        this.newIsDrawerVisible = newIsDrawerVisible;
    }
}

export function collectionPageViewReducer(
    prevState: CollectionPageViewState,
    action: CollectionPageViewAction
) {
    switch (action.type) {
        case "UPDATE_IS_DRAWER_VISIBLE": {
            const { newIsDrawerVisible } = action as UpdateIsDrawerVisible;
            return {
                isDrawerVisible: newIsDrawerVisible,
            };
        }
        default: {
            throw Error(
                `Unknown action for collection page view reducer: ${action.type}`
            );
        }
    }
}
