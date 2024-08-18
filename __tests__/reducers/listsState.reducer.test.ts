import { defaultListsStateData } from "../../contexts/listsState.context";
import {
    DeleteModalVisible,
    ListsState,
    listsStateReducer,
    UpdateCurrentIndex,
    UpdateDrawerVisibility,
    UpdateSelectMode,
} from "../../data/reducers/listsState.reducer";
import { assertListsStateEqual } from "../testUtils";

describe("Lists State Reducer", () => {
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

    it("updates drawer visibility", () => {
        const newState: ListsState = listsStateReducer(
            defaultListsStateData,
            new UpdateDrawerVisibility(true)
        );

        assertListsStateEqual(newState, {
            ...defaultListsStateData,
            isDrawerVisible: true,
        });
    });

    it("updates select mode", () => {
        const newState: ListsState = listsStateReducer(
            defaultListsStateData,
            new UpdateSelectMode(true)
        );

        assertListsStateEqual(newState, {
            ...defaultListsStateData,
            selectMode: true,
        });
    });
});
