import { defaultItemsStateData } from "../../contexts/itemsState.context";
import {
    DeleteAllModalVisible,
    ItemsState,
    itemsStateReducer,
    MoveCopyModalVisible,
    UpdateCurrentIndex,
    UpdateDrawerVisibility,
    UpdateSelectMode,
} from "../../data/reducers/itemsState.reducer";
import { assertItemsStateEqual } from "../testUtils";

describe("items state reducer", () => {
    it("updates current index", () => {
        const newState: ItemsState = itemsStateReducer(
            defaultItemsStateData,
            new UpdateCurrentIndex(5)
        );

        assertItemsStateEqual(newState, {
            ...defaultItemsStateData,
            currentIndex: 5,
        });
    });

    it("updates move copy modal visible", () => {
        const newState: ItemsState = itemsStateReducer(
            defaultItemsStateData,
            new MoveCopyModalVisible(true)
        );

        assertItemsStateEqual(newState, {
            ...defaultItemsStateData,
            isCopyModalVisible: true,
        });
    });

    it("updates delete all modal visible", () => {
        const newState: ItemsState = itemsStateReducer(
            defaultItemsStateData,
            new DeleteAllModalVisible(true)
        );

        assertItemsStateEqual(newState, {
            ...defaultItemsStateData,
            isDeleteAllModalVisible: true,
        });
    });

    it("Updates drawer visibility", () => {
        const newState: ItemsState = itemsStateReducer(
            defaultItemsStateData,
            new UpdateDrawerVisibility(true)
        );

        assertItemsStateEqual(newState, {
            ...defaultItemsStateData,
            isDrawerVisible: true,
        });
    });

    it("Updates select mode", () => {
        const newState: ItemsState = itemsStateReducer(
            defaultItemsStateData,
            new UpdateSelectMode(true)
        );

        assertItemsStateEqual(newState, {
            ...defaultItemsStateData,
            selectMode: true,
        });
    });
});
