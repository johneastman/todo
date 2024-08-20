import { defaultListsData } from "../../contexts/lists.context";
import { Item, List } from "../../data/data";
import {
    AddItem,
    UpdateItem,
    DeleteItems,
    ItemIsComplete,
    ItemsIsComplete,
    MoveItems,
    SelectAllItems,
    SelectItem,
    listsReducer,
    ListsData,
    SelectItemsWhere,
    SelectMultipleItems,
    LockItems,
} from "../../data/reducers/lists.reducer";
import { MoveItemAction } from "../../types";
import {
    assertItemsEqual,
    assertListsEqual,
    itemComplete,
    itemIncomplete,
    listDefault,
} from "../testUtils";

describe("Items Reducer", () => {
    const listIndex: number = 0;

    describe("Add Items", () => {
        it("adds a new item", () => {
            const prevState = listsDataFactory([]);

            const newItem: Item = new Item("Carrots", "Product", 1, {
                isComplete: false,
            });
            const { lists }: ListsData = listsReducer(
                prevState,
                new AddItem({
                    listIndex: listIndex,
                    item: newItem,
                    oldPos: -1,
                    newPos: 0,
                })
            );

            const expectedItems: Item[] = [newItem];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });
    });

    describe("Update Items", () => {
        it("updates items", () => {
            const prevState = listsDataFactory([
                itemIncomplete("A", "A notes", 1),
            ]);

            const newItem: Item = new Item("A2", "A2 notes", 100, {
                isComplete: true,
            });

            const { lists }: ListsData = listsReducer(
                prevState,
                new UpdateItem({
                    listIndex: listIndex,
                    item: newItem,
                    oldPos: 0,
                    newPos: 0,
                })
            );

            const expectedItems: Item[] = [newItem];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });
    });

    describe("Delete Item", () => {
        it("Deletes none items when none are selected", () => {
            const prevState = listsDataFactory([
                itemIncomplete("A", "", 1),
                itemIncomplete("B", "", 1),
                itemIncomplete("C", "", 1),
            ]);

            const { lists } = listsReducer(
                prevState,
                new DeleteItems(listIndex)
            );

            const expectedItems: Item[] = [
                itemIncomplete("A", "", 1),
                itemIncomplete("B", "", 1),
                itemIncomplete("C", "", 1),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });

        it("deletes all items when all are selected", () => {
            const prevState = listsDataFactory([
                new Item("A", "", 1, { isComplete: false, isSelected: true }),
                new Item("B", "", 1, { isComplete: false, isSelected: true }),
                new Item("C", "", 1, { isComplete: false, isSelected: true }),
            ]);

            const { lists } = listsReducer(
                prevState,
                new DeleteItems(listIndex)
            );

            const expectedItems: Item[] = [];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });

        it("Deletes only selected items", () => {
            const prevState = listsDataFactory([
                new Item("A", "", 1, { isComplete: false, isSelected: true }),
                itemIncomplete("B", "", 1),
                new Item("C", "", 1, { isComplete: false, isSelected: true }),
            ]);

            const { lists } = listsReducer(
                prevState,
                new DeleteItems(listIndex)
            );

            const expectedItems: Item[] = [itemIncomplete("B", "", 1)];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });
    });

    describe("Copy Items Workflow", () => {
        const action: MoveItemAction = "Copy";

        it("copies items from the current list into another list", async () => {
            const currentListBefore: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                [itemIncomplete("A", "", 1), itemIncomplete("B", "", 1)]
            );
            const otherListBefore: List = listDefault("List 1", "List", "top", [
                itemIncomplete("C", "", 1),
            ]);

            const currentListAfter: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                [itemIncomplete("A", "", 1), itemIncomplete("B", "", 1)]
            );
            const otherListAfter: List = listDefault("List 1", "List", "top", [
                itemIncomplete("C", "", 1),
                itemIncomplete("A", "", 1),
                itemIncomplete("B", "", 1),
            ]);

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, listIndex, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies items from other list into current list", async () => {
            const currentListBefore: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                [itemIncomplete("A", "", 1), itemIncomplete("B", "", 1)]
            );
            const otherListBefore: List = listDefault("List 1", "List", "top", [
                itemIncomplete("C", "", 1),
            ]);

            const currentListAfter: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                [
                    itemIncomplete("A", "", 1),
                    itemIncomplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ]
            );
            const otherListAfter: List = listDefault("List 1", "List", "top", [
                itemIncomplete("C", "", 1),
            ]);

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, 1, listIndex)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("Move Items Workflow", () => {
        const action: MoveItemAction = "Move";

        it("moves items from the current list into the other list", async () => {
            const currentListBefore: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", "", 1, {
                        isComplete: false,
                        isSelected: true,
                    }),
                    new Item("B", "", 1, {
                        isComplete: false,
                        isSelected: true,
                    }),
                ]
            );
            const otherListBefore: List = listDefault("List 1", "List", "top", [
                itemIncomplete("C", "", 1),
            ]);

            const currentListAfter: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                []
            );

            const otherListAfter: List = listDefault("List 1", "List", "top", [
                itemIncomplete("C", "", 1),
                itemIncomplete("A", "", 1),
                itemIncomplete("B", "", 1),
            ]);

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, listIndex, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves items from the other list into the current list", async () => {
            const currentListBefore: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                [itemIncomplete("A", "", 1), itemIncomplete("B", "", 1)]
            );

            const otherListBefore: List = listDefault("List 1", "List", "top", [
                itemIncomplete("C", "", 1),
            ]);

            const currentListAfter: List = listDefault(
                "List 0",
                "Shopping",
                "bottom",
                [
                    itemIncomplete("A", "", 1),
                    itemIncomplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ]
            );
            const otherListAfter: List = listDefault("List 1", "List", "top");

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, 1, listIndex)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("select items", () => {
        it("selects all", () => {
            const prevState = listsDataFactory([
                itemIncomplete("A", "", 1),
                itemIncomplete("B", "", 1),
                itemIncomplete("C", "", 1),
            ]);

            const { lists } = listsReducer(
                prevState,
                new SelectAllItems(listIndex, true)
            );

            const expectedItems: Item[] = [
                new Item("A", "", 1, { isComplete: false, isSelected: true }),
                new Item("B", "", 1, { isComplete: false, isSelected: true }),
                new Item("C", "", 1, { isComplete: false, isSelected: true }),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });

        it("selects one", () => {
            const prevState = listsDataFactory([
                itemIncomplete("A", "", 1),
                itemIncomplete("B", "", 1),
                itemIncomplete("C", "", 1),
            ]);

            const { lists } = listsReducer(
                prevState,
                new SelectItem(listIndex, 2, true)
            );

            const expectedItems: Item[] = [
                itemIncomplete("A", "", 1),
                itemIncomplete("B", "", 1),
                new Item("C", "", 1, { isComplete: false, isSelected: true }),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });

        it("selects items where", () => {
            const prevState = listsDataFactory([
                new Item("A", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
                new Item("B", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: true,
                }),
                new Item("C", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
            ]);

            const { lists } = listsReducer(
                prevState,
                new SelectItemsWhere(listIndex, (item) => item.isLocked)
            );

            const expectedItems: Item[] = [
                new Item("A", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
                new Item("B", "", 1, {
                    isComplete: false,
                    isSelected: true,
                    isLocked: true,
                }),
                new Item("C", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });

        it("selects multiple items", () => {
            const prevState = listsDataFactory([
                itemIncomplete("1", "", 1),
                itemIncomplete("2", "", 1),
                itemIncomplete("3", "", 1),
                itemIncomplete("4", "", 1),
                itemIncomplete("5", "", 1),
                itemIncomplete("6", "", 1),
            ]);

            const { lists } = listsReducer(
                prevState,
                new SelectMultipleItems(listIndex, [1, 3, 5], true)
            );

            const expectedItems: Item[] = [
                itemIncomplete("1", "", 1),
                new Item("2", "", 1, { isComplete: false, isSelected: true }),
                itemIncomplete("3", "", 1),
                new Item("4", "", 1, { isComplete: false, isSelected: true }),
                itemIncomplete("5", "", 1),
                new Item("6", "", 1, { isComplete: false, isSelected: true }),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });

        it("de-selects multiple items", () => {
            const prevState: ListsData = listsDataFactory([
                itemIncomplete("1", "", 1),
                new Item("2", "", 1, { isComplete: false, isSelected: true }),
                new Item("3", "", 1, { isComplete: false, isSelected: true }),
                new Item("4", "", 1, { isComplete: false, isSelected: true }),
                itemIncomplete("5", "", 1),
                new Item("6", "", 1, { isComplete: false, isSelected: true }),
            ]);

            const { lists } = listsReducer(
                prevState,
                new SelectMultipleItems(listIndex, [1, 3, 5], false)
            );

            const expectedItems: Item[] = [
                itemIncomplete("1", "", 1),
                itemIncomplete("2", "", 1),
                new Item("3", "", 1, { isComplete: false, isSelected: true }),
                itemIncomplete("4", "", 1),
                itemIncomplete("5", "", 1),
                itemIncomplete("6", "", 1),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });
    });

    describe("Complete Items", () => {
        describe("Complete", () => {
            it("Completes all selected items", () => {
                const prevState = listsDataFactory([
                    new Item("A", "", 1, {
                        isComplete: false,
                        isSelected: false,
                    }),
                    new Item("B", "", 1, {
                        isComplete: false,
                        isSelected: true,
                    }),
                    new Item("C", "", 1, {
                        isComplete: false,
                        isSelected: true,
                    }),
                ]);

                const { lists }: ListsData = listsReducer(
                    prevState,
                    new ItemsIsComplete(listIndex, true)
                );

                const expectedItems: Item[] = [
                    itemIncomplete("A", "", 1),
                    itemComplete("B", "", 1),
                    itemComplete("C", "", 1),
                ];

                assertItemsEqual(lists[listIndex].items, expectedItems);
            });

            it("Completes no items (because none are selected)", () => {
                const prevState = listsDataFactory([
                    itemIncomplete("A", "", 1),
                    itemIncomplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ]);

                const { lists }: ListsData = listsReducer(
                    prevState,
                    new ItemsIsComplete(listIndex, true)
                );

                const expectedItems: Item[] = [
                    itemIncomplete("A", "", 1),
                    itemIncomplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ];

                assertItemsEqual(lists[listIndex].items, expectedItems);
            });

            it("Completes one item", () => {
                const prevState = listsDataFactory([
                    itemIncomplete("A", "", 1),
                    itemComplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ]);

                const { lists }: ListsData = listsReducer(
                    prevState,
                    new ItemIsComplete(listIndex, 0)
                );

                const expectedItems: Item[] = [
                    itemComplete("A", "", 1),
                    itemComplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ];

                assertItemsEqual(lists[listIndex].items, expectedItems);
            });
        });

        describe("Incomplete", () => {
            it("Incompletes all selected items", () => {
                const prevState = listsDataFactory([
                    new Item("A", "", 1, {
                        isComplete: false,
                        isSelected: true,
                    }),
                    new Item("B", "", 1, {
                        isComplete: false,
                        isSelected: true,
                    }),
                    new Item("C", "", 1, {
                        isComplete: true,
                        isSelected: false,
                    }),
                ]);

                const { lists }: ListsData = listsReducer(
                    prevState,
                    new ItemsIsComplete(listIndex, false)
                );

                const expectedItems: Item[] = [
                    itemIncomplete("A", "", 1),
                    itemIncomplete("B", "", 1),
                    itemComplete("C", "", 1),
                ];

                assertItemsEqual(lists[listIndex].items, expectedItems);
            });

            it("Incompletes no items (because none are selected)", () => {
                const prevState = listsDataFactory([
                    itemComplete("A", "", 1),
                    itemComplete("B", "", 1),
                    itemComplete("C", "", 1),
                ]);

                const { lists }: ListsData = listsReducer(
                    prevState,
                    new ItemsIsComplete(listIndex, false)
                );

                const expectedItems: Item[] = [
                    itemComplete("A", "", 1),
                    itemComplete("B", "", 1),
                    itemComplete("C", "", 1),
                ];

                assertItemsEqual(lists[listIndex].items, expectedItems);
            });

            it("Incompletes one item", () => {
                const prevState = listsDataFactory([
                    itemIncomplete("A", "", 1),
                    itemComplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ]);

                const { lists }: ListsData = listsReducer(
                    prevState,
                    new ItemIsComplete(listIndex, 1)
                );

                const expectedItems: Item[] = [
                    itemIncomplete("A", "", 1),
                    itemIncomplete("B", "", 1),
                    itemIncomplete("C", "", 1),
                ];

                assertItemsEqual(lists[listIndex].items, expectedItems);
            });
        });
    });

    describe("Lock Items", () => {
        it("Locks Selected Items", () => {
            const prevState = listsDataFactory([
                new Item("A", "", 1, {
                    isComplete: false,
                    isSelected: true,
                    isLocked: false,
                }),
                new Item("B", "", 1, {
                    isComplete: false,
                    isSelected: true,
                    isLocked: false,
                }),
                new Item("C", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
                new Item("D", "", 1, {
                    isComplete: false,
                    isSelected: true,
                    isLocked: false,
                }),
            ]);

            const { lists }: ListsData = listsReducer(
                prevState,
                new LockItems(listIndex, true)
            );

            const expectedItems: Item[] = [
                new Item("A", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: true,
                }),
                new Item("B", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: true,
                }),
                new Item("C", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
                new Item("D", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: true,
                }),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });

        it("Unlocks Selected Items", () => {
            const prevState = listsDataFactory([
                new Item("A", "", 1, {
                    isComplete: false,
                    isSelected: true,
                    isLocked: true,
                }),
                new Item("B", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: true,
                }),
                new Item("C", "", 1, {
                    isComplete: false,
                    isSelected: true,
                    isLocked: true,
                }),
                new Item("D", "", 1, {
                    isComplete: false,
                    isSelected: true,
                    isLocked: true,
                }),
            ]);

            const { lists }: ListsData = listsReducer(
                prevState,
                new LockItems(listIndex, false)
            );

            const expectedItems: Item[] = [
                new Item("A", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
                new Item("B", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: true,
                }),
                new Item("C", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
                new Item("D", "", 1, {
                    isComplete: false,
                    isSelected: false,
                    isLocked: false,
                }),
            ];

            assertItemsEqual(lists[listIndex].items, expectedItems);
        });
    });
});

function listsDataFactory(items: Item[]): ListsData {
    const list: List = listDefault("My List", "List", "bottom", items);

    const prevState: ListsData = {
        ...defaultListsData,
        lists: [list],
    };

    return prevState;
}
