import { defaultItemsStateData } from "../../contexts/itemsState.context";
import {
    ActionsModalVisible,
    AddUpdateModalVisible,
    DeleteAllModalVisible,
    ItemsState,
    itemsStateReducer,
    MoveCopyModalVisible,
    UpdateCurrentIndex,
} from "../../data/reducers/itemsState.reducer";
import { assertItemsStateEqual } from "../testUtils";

describe("items state reducer", () => {
    describe("add updates modal", () => {
        it("is visible", () => {
            const newState: ItemsState = itemsStateReducer(
                defaultItemsStateData,
                new AddUpdateModalVisible(true)
            );

            assertItemsStateEqual(newState, {
                ...defaultItemsStateData,
                isModalVisible: true,
            });
        });

        it("is visible with item index", () => {
            const newState: ItemsState = itemsStateReducer(
                defaultItemsStateData,
                new AddUpdateModalVisible(true, 5)
            );

            assertItemsStateEqual(newState, {
                ...defaultItemsStateData,
                isModalVisible: true,
                currentIndex: 5,
            });
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

    it("updates action modal visible", () => {
        const newState: ItemsState = itemsStateReducer(
            defaultItemsStateData,
            new ActionsModalVisible(true)
        );

        assertItemsStateEqual(newState, {
            ...defaultItemsStateData,
            isActionsModalVisible: true,
        });
    });
});
