import {
    CollectionPageViewState,
    UpdateIsDrawerVisible,
    collectionPageViewReducer,
} from "../../data/reducers/collectionPageView.reducer";
import { assertCollectionPageViewStateEqual } from "../testUtils";

describe("Collection Page View Reducer", () => {
    const state: CollectionPageViewState = { isDrawerVisible: false };

    it("updates drawer visibility", () => {
        const newState: CollectionPageViewState = collectionPageViewReducer(
            state,
            new UpdateIsDrawerVisible(true)
        );

        assertCollectionPageViewStateEqual(newState, { isDrawerVisible: true });
    });
});
