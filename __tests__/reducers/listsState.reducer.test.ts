import { defaultListsStateData } from "../../contexts/listsState.context";
import {
    ActionsModalVisible,
    DeleteModalVisible,
    ListsState,
    listsStateReducer,
    UpdateCurrentIndex,
} from "../../data/reducers/listsState.reducer";
import { assertListsStateEqual } from "../testUtils";

describe("Lists State Reducer", () => {
    it("updates action modal visibility", () => {
        const newState: ListsState = listsStateReducer(
            defaultListsStateData,
            new ActionsModalVisible(true)
        );

        assertListsStateEqual(newState, {
            ...defaultListsStateData,
            isActionsModalVisible: true,
        });
    });

    it("updates delete modal visibility", () => {
        const newState: ListsState = listsStateReducer(
            defaultListsStateData,
            new DeleteModalVisible(true)
        );

        assertListsStateEqual(newState, {
            ...defaultListsStateData,
            isDeleteAllModalVisible: true,
        });
    });

    it("updates current index", () => {
        const newState: ListsState = listsStateReducer(
            defaultListsStateData,
            new UpdateCurrentIndex(5)
        );

        assertListsStateEqual(newState, {
            ...defaultListsStateData,
            currentIndex: 5,
        });
    });
});
