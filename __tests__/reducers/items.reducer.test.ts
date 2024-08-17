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
} from "../../data/reducers/lists.reducer";
import { MoveItemAction } from "../../types";
import { assertListsEqual } from "../testUtils";

describe("Items", () => {
    const currentListIndex: number = 0;

    describe("Add Items", () => {
        const oldState: ListsData = {
            ...defaultListsData,
            lists: [new List("My List", "Shopping", "bottom")],
        };

        it("adds a new item", () => {
            const item: Item = new Item("Carrots", "", 1, false);
            const newState: ListsData = listsReducer(
                oldState,
                new AddItem({
                    listIndex: 0,
                    item: item,
                    oldPos: -1,
                    newPos: 0,
                })
            );

            const { lists } = newState;

            const newItems: Item[] = [item];
            const newLists: List[] = [
                new List("My List", "Shopping", "bottom", newItems),
            ];

            assertListsEqual(lists, newLists);
        });
    });

    describe("Update Items", () => {
        it("updates items", () => {
            const oldItem: Item = new Item("B", "", 1, false);
            const newItem: Item = new Item("B2", "", 100, true);
            const lists: List[] = [
                new List("My List", "Shopping", "bottom", [
                    new Item("A", "", 1, false),
                    oldItem,
                    new Item("C", "", 1, false),
                    new Item("D", "", 1, false),
                ]),
            ];

            const oldState: ListsData = {
                ...defaultListsData,
                lists: lists,
            };

            const newState: ListsData = listsReducer(
                oldState,
                new UpdateItem({
                    listIndex: 0,
                    item: newItem,
                    oldPos: 1,
                    newPos: 1,
                })
            );

            const expectedLists: List[] = [
                new List("My List", "Shopping", "bottom", [
                    new Item("A", "", 1, false),
                    newItem,
                    new Item("C", "", 1, false),
                    new Item("D", "", 1, false),
                ]),
            ];

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, expectedLists);
        });
    });

    describe("Delete Item", () => {
        const lists: List[] = [
            new List("A", "List", "bottom", [
                new Item("A.1", "", 1, false),
                new Item("A.2", "", 1, false),
                new Item("A.2", "", 1, false),
            ]),
            new List("B", "List", "bottom", [
                new Item("B.1", "", 1, false, true),
                new Item("B.2", "", 1, false),
                new Item("C.2", "", 1, false, true),
            ]),
            new List("C", "List", "bottom", [
                new Item("C.1", "", 1, false, true),
                new Item("C.2", "", 1, false, true),
                new Item("C.2", "", 1, false, true),
            ]),
        ];

        const oldState: ListsData = {
            ...defaultListsData,
            lists: lists,
        };

        it("Deletes none items when none are selected", () => {
            const { lists } = listsReducer(oldState, new DeleteItems(0));
            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", "", 1, false),
                    new Item("A.2", "", 1, false),
                    new Item("A.2", "", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", "", 1, false, true),
                    new Item("B.2", "", 1, false),
                    new Item("C.2", "", 1, false, true),
                ]),
                new List("C", "List", "bottom", [
                    new Item("C.1", "", 1, false, true),
                    new Item("C.2", "", 1, false, true),
                    new Item("C.2", "", 1, false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });

        it("deletes all items when all are selected", () => {
            const { lists } = listsReducer(oldState, new DeleteItems(2));
            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", "", 1, false),
                    new Item("A.2", "", 1, false),
                    new Item("A.2", "", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", "", 1, false, true),
                    new Item("B.2", "", 1, false),
                    new Item("C.2", "", 1, false, true),
                ]),
                new List("C", "List", "bottom", []),
            ];
            assertListsEqual(lists, newLists);
        });

        it("Deletes selected items", () => {
            const { lists } = listsReducer(oldState, new DeleteItems(1));
            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", "", 1, false),
                    new Item("A.2", "", 1, false),
                    new Item("A.2", "", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.2", "", 1, false),
                ]),
                new List("C", "List", "bottom", [
                    new Item("C.1", "", 1, false, true),
                    new Item("C.2", "", 1, false, true),
                    new Item("C.2", "", 1, false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });
    });

    describe("Copy Items Workflow", () => {
        const action: MoveItemAction = "Copy";

        it("copies items from the current list into another list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", "", 1, false), new Item("B", "", 1, false)]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", "", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", "", 1, false), new Item("B", "", 1, false)]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", "", 1, false),
                new Item("A", "", 1, false),
                new Item("B", "", 1, false),
            ]);

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, currentListIndex, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies items from other list into current list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", "", 1, false), new Item("B", "", 1, false)]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", "", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", "", 1, false),
                    new Item("B", "", 1, false),
                    new Item("C", "", 1, false),
                ]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", "", 1, false),
            ]);

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, 1, currentListIndex)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("Move Items Workflow", () => {
        const action: MoveItemAction = "Move";

        it("moves items from the current list into the other list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", "", 1, false, true),
                    new Item("B", "", 1, false, true),
                ]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", "", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                []
            );

            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", "", 1, false),
                new Item("A", "", 1, false),
                new Item("B", "", 1, false),
            ]);

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, currentListIndex, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves items from the other list into the current list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", "", 1, false), new Item("B", "", 1, false)]
            );

            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", "", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", "", 1, false),
                    new Item("B", "", 1, false),
                    new Item("C", "", 1, false),
                ]
            );
            const otherListAfter: List = new List("List 1", "List", "top", []);

            const oldState: ListsData = {
                ...defaultListsData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: ListsData = listsReducer(
                oldState,
                new MoveItems(action, 1, currentListIndex)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("select items", () => {
        const lists: List[] = [
            new List("A", "List", "bottom", [
                new Item("A.1", "", 1, false),
                new Item("A.2", "", 1, false),
                new Item("A.2", "", 1, false),
            ]),
            new List("B", "List", "bottom", [
                new Item("B.1", "", 1, false, false, false),
                new Item("B.2", "", 1, false, false, true),
                new Item("C.2", "", 1, false, false, false),
            ]),
        ];

        const oldState: ListsData = {
            ...defaultListsData,
            lists: lists,
        };

        it("selects all", () => {
            const { lists } = listsReducer(
                oldState,
                new SelectAllItems(1, true)
            );

            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", "", 1, false),
                    new Item("A.2", "", 1, false),
                    new Item("A.2", "", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", "", 1, false, true),
                    new Item("B.2", "", 1, false, true, true),
                    new Item("C.2", "", 1, false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });

        it("selects one", () => {
            const { lists } = listsReducer(
                oldState,
                new SelectItem(0, 2, true)
            );

            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", "", 1, false),
                    new Item("A.2", "", 1, false),
                    new Item("A.2", "", 1, false, true),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", "", 1, false),
                    new Item("B.2", "", 1, false, false, true),
                    new Item("C.2", "", 1, false),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });

        it("selects items where", () => {
            const { lists } = listsReducer(
                oldState,
                new SelectItemsWhere(1, (item) => item.isLocked)
            );

            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", "", 1, false),
                    new Item("A.2", "", 1, false),
                    new Item("A.2", "", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", "", 1, false, false, false),
                    new Item("B.2", "", 1, false, true, true),
                    new Item("C.2", "", 1, false, false),
                ]),
            ];

            assertListsEqual(lists, newLists);
        });

        it("selects multiple items", () => {
            const oldLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("1", "", 1, false),
                    new Item("2", "", 1, false),
                    new Item("3", "", 1, false),
                    new Item("4", "", 1, false),
                    new Item("5", "", 1, false),
                    new Item("6", "", 1, false),
                ]),
            ];

            const oldState: ListsData = {
                ...defaultListsData,
                lists: oldLists,
            };

            const { lists } = listsReducer(
                oldState,
                new SelectMultipleItems(0, [1, 3, 5], true)
            );

            const expectedNewLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("1", "", 1, false),
                    new Item("2", "", 1, false, true),
                    new Item("3", "", 1, false),
                    new Item("4", "", 1, false, true),
                    new Item("5", "", 1, false),
                    new Item("6", "", 1, false, true),
                ]),
            ];

            assertListsEqual(lists, expectedNewLists);
        });

        it("de-selects multiple items", () => {
            const oldLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("1", "", 1, false),
                    new Item("2", "", 1, false, true),
                    new Item("3", "", 1, false, true),
                    new Item("4", "", 1, false, true),
                    new Item("5", "", 1, false),
                    new Item("6", "", 1, false, true),
                ]),
            ];

            const oldState: ListsData = {
                ...defaultListsData,
                lists: oldLists,
            };

            const { lists } = listsReducer(
                oldState,
                new SelectMultipleItems(0, [1, 3, 5], false)
            );

            const expectedNewLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("1", "", 1, false),
                    new Item("2", "", 1, false),
                    new Item("3", "", 1, false, true),
                    new Item("4", "", 1, false),
                    new Item("5", "", 1, false),
                    new Item("6", "", 1, false),
                ]),
            ];

            assertListsEqual(lists, expectedNewLists);
        });
    });

    describe("Complete Items", () => {
        const lists: List[] = [
            new List("None Complete/All Selected", "List", "bottom", [
                new Item("A", "", 1, false, true),
                new Item("B", "", 1, false, true),
                new Item("C", "", 1, false, true),
            ]),
            new List("All Complete/None Selected", "List", "bottom", [
                new Item("A", "", 1, true),
                new Item("B", "", 1, true),
                new Item("C", "", 1, true),
            ]),
            new List("Some Complete/Some Selected", "List", "bottom", [
                new Item("A", "", 1, false),
                new Item("B", "", 1, true, true),
                new Item("C", "", 1, false),
            ]),
        ];

        const oldState: ListsData = {
            ...defaultListsData,
            lists: lists,
        };

        it("marks all items as complete", () => {
            const { lists: completeItemsLists }: ListsData = listsReducer(
                oldState,
                new ItemsIsComplete(0, true)
            );

            const newLists: List[] = [
                new List("None Complete/All Selected", "List", "bottom", [
                    new Item("A", "", 1, true),
                    new Item("B", "", 1, true),
                    new Item("C", "", 1, true),
                ]),
                new List("All Complete/None Selected", "List", "bottom", [
                    new Item("A", "", 1, true),
                    new Item("B", "", 1, true),
                    new Item("C", "", 1, true),
                ]),
                new List("Some Complete/Some Selected", "List", "bottom", [
                    new Item("A", "", 1, false),
                    new Item("B", "", 1, true, true),
                    new Item("C", "", 1, false),
                ]),
            ];

            assertListsEqual(completeItemsLists, newLists);
        });

        it("marks no items as complete (because none are selected)", () => {
            const { lists: completeItemsLists }: ListsData = listsReducer(
                oldState,
                new ItemsIsComplete(1, false)
            );

            const newLists: List[] = [
                new List("None Complete/All Selected", "List", "bottom", [
                    new Item("A", "", 1, false, true),
                    new Item("B", "", 1, false, true),
                    new Item("C", "", 1, false, true),
                ]),
                new List("All Complete/None Selected", "List", "bottom", [
                    new Item("A", "", 1, true),
                    new Item("B", "", 1, true),
                    new Item("C", "", 1, true),
                ]),
                new List("Some Complete/Some Selected", "List", "bottom", [
                    new Item("A", "", 1, false),
                    new Item("B", "", 1, true, true),
                    new Item("C", "", 1, false),
                ]),
            ];

            assertListsEqual(completeItemsLists, newLists);
        });

        it("marks one item as complete", () => {
            const { lists }: ListsData = listsReducer(
                oldState,
                new ItemIsComplete(2, 0)
            );

            const expectedLists: List[] = [
                new List("None Complete/All Selected", "List", "bottom", [
                    new Item("A", "", 1, false, true),
                    new Item("B", "", 1, false, true),
                    new Item("C", "", 1, false, true),
                ]),
                new List("All Complete/None Selected", "List", "bottom", [
                    new Item("A", "", 1, true),
                    new Item("B", "", 1, true),
                    new Item("C", "", 1, true),
                ]),
                new List("Some Complete/Some Selected", "List", "bottom", [
                    new Item("A", "", 1, true),
                    new Item("B", "", 1, true, true),
                    new Item("C", "", 1, false),
                ]),
            ];

            assertListsEqual(lists, expectedLists);
        });
    });
});
