import { defaultSettings } from "../contexts/app.context";
import { Item, List } from "../data/data";
import { AppData, MoveItems, appReducer } from "../data/reducers/app.reducer";
import { MoveItemAction } from "../types";
import { assertListsEqual } from "./testUtils";

describe("app reducer", () => {
    const currentListId: string = "0";

    describe("Copy Workflow", () => {
        const action: MoveItemAction = "copy";

        it("copies items from the current list into another list", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                ]
            );
            const otherListBefore: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const currentListAfter: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                ]
            );
            const otherListAfter: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [
                    new Item("C", 1, "Item", false),
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                ]
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "0", "1")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies items from other list into current list", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                ]
            );
            const otherListBefore: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const currentListAfter: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("C", 1, "Item", false),
                ]
            );
            const otherListAfter: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "1", "0")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies selected items from current list into other list", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false, true),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false, true),
                    new Item("E", 1, "Item", false, true),
                ]
            );
            const otherListBefore: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const currentListAfter: List = new List(
                "0",
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false),
                    new Item("E", 1, "Item", false),
                ]
            );
            const otherListAfter: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [
                    new Item("C", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("D", 1, "Item", false),
                    new Item("E", 1, "Item", false),
                ]
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "0", "1")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies selected items from other list into current list (ignores selected items in other list)", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );
            const otherListBefore: List = new List(
                "1",
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false, true),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false, true),
                    new Item("E", 1, "Item", false, true),
                ]
            );

            const currentListAfter: List = new List(
                "0",
                "List 1",
                "List",
                "top",
                [
                    new Item("C", 1, "Item", false),
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false),
                    new Item("E", 1, "Item", false),
                ]
            );
            const otherListAfter: List = new List(
                "1",
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false),
                    new Item("E", 1, "Item", false),
                ]
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "1", "0")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("Move Workflow", () => {
        const action: MoveItemAction = "move";

        it("moves items from the current list into the other list", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                ]
            );
            const otherListBefore: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const currentListAfter: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                []
            );

            const otherListAfter: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [
                    new Item("C", 1, "Item", false),
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                ]
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "0", "1")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves items from the other list into the current list", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                ]
            );

            const otherListBefore: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const currentListAfter: List = new List(
                "0",
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("C", 1, "Item", false),
                ]
            );
            const otherListAfter: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                []
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "1", "0")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves selected items from the current list into the other list", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false, true),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false, true),
                    new Item("E", 1, "Item", false, true),
                ]
            );
            const otherListBefore: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const currentListAfter: List = new List(
                "0",
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("C", 1, "Item", false),
                ]
            );
            const otherListAfter: List = new List(
                "1",
                "List 1",
                "List",
                "top",
                [
                    new Item("C", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("D", 1, "Item", false),
                    new Item("E", 1, "Item", false),
                ]
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "0", "1")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves selected items from the other list into the current list (ignores selected in other list)", async () => {
            const currentListBefore: List = new List(
                "0",
                "List 1",
                "List",
                "top",
                [new Item("C", 1, "Item", false)]
            );

            const otherListBefore: List = new List(
                "1",
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false, true),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false, true),
                    new Item("E", 1, "Item", false, true),
                ]
            );

            const currentListAfter: List = new List(
                "0",
                "List 1",
                "List",
                "top",
                [
                    new Item("C", 1, "Item", false),
                    new Item("A", 1, "Item", false),
                    new Item("B", 1, "Item", false),
                    new Item("C", 1, "Item", false),
                    new Item("D", 1, "Item", false),
                    new Item("E", 1, "Item", false),
                ]
            );
            const otherListAfter: List = new List(
                "1",
                "List 2",
                "Ordered To-Do",
                "bottom",
                []
            );

            const state: AppData = {
                settings: defaultSettings,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "1", "0")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });
});
