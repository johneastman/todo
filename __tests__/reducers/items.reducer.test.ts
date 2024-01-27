import { defaultSettings } from "../../contexts/app.context";
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
    UpdateCopyModalVisible,
    UpdateDeleteModalVisible,
    UpdateModalVisible,
    appReducer,
} from "../../data/reducers/app.reducer";
import { AppData, MoveItemAction } from "../../types";
import { assertListsEqual } from "../testUtils";

describe("Items", () => {
    const currentListId: string = "0";

    describe("Add Items", () => {
        const oldState: AppData = {
            settings: defaultSettings,
            lists: [new List("0", "My List", "Shopping", "bottom")],
            itemsState: {
                currentIndex: -1,
                isModalVisible: false,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            },
            listsState: {
                currentIndex: 1,
                isModalVisible: true,
                isDeleteAllModalVisible: false,
            },
        };

        it("adds a new item", () => {
            const item: Item = new Item("Carrots", 1, "Item", false);
            const newState: AppData = appReducer(
                oldState,
                new AddItem(
                    {
                        listId: "0",
                        item: item,
                        oldPos: -1,
                        newPos: "bottom",
                    },
                    false
                )
            );

            const {
                lists,
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            const newItems: Item[] = [item];
            const newLists: List[] = [
                new List("0", "My List", "Shopping", "bottom", newItems),
            ];

            assertListsEqual(lists, newLists);
            expect(isModalVisible).toEqual(false);
            expect(currentIndex).toEqual(-1);
        });

        it("adds a new item with alternate action", () => {
            const item: Item = new Item("Carrots", 1, "Item", false);

            const newState: AppData = appReducer(
                oldState,
                new AddItem(
                    {
                        listId: "0",
                        item: item,
                        oldPos: -1,
                        newPos: "bottom",
                    },
                    true
                )
            );

            const {
                lists,
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            const newItems: Item[] = [item];
            const newLists: List[] = [
                new List("0", "My List", "Shopping", "bottom", newItems),
            ];

            // The modal remains visible
            assertListsEqual(lists, newLists);
            expect(isModalVisible).toEqual(true);
            expect(currentIndex).toEqual(-1);
        });
    });

    describe("Update Items", () => {
        it("updates items with alternate action", () => {
            const item: Item = new Item("B", 1, "Item", false);

            const oldState: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("0", "My List", "Shopping", "bottom", [
                        new Item("A", 1, "Item", false),
                        item,
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                    ]),
                ],
                itemsState: {
                    currentIndex: 1,
                    isModalVisible: true,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
                listsState: {
                    currentIndex: -1,
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newState: AppData = appReducer(
                oldState,
                new UpdateItem(
                    {
                        listId: "0",
                        item: item,
                        oldPos: 1,
                        newPos: "current",
                    },
                    true
                )
            );

            const {
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            expect(isModalVisible).toEqual(true);
            expect(currentIndex).toEqual(2);
        });

        it("updates last item with alternate action and dismisses modal", () => {
            const item: Item = new Item("D", 1, "Item", false);

            const oldState: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("0", "My List", "Shopping", "bottom", [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                        item,
                    ]),
                ],
                itemsState: {
                    currentIndex: 3,
                    isModalVisible: true,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
                listsState: {
                    currentIndex: -1,
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newState: AppData = appReducer(
                oldState,
                new UpdateItem(
                    {
                        listId: "0",
                        item: new Item("D", 1, "Item", false),
                        oldPos: 3,
                        newPos: "current",
                    },
                    true
                )
            );

            const {
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            expect(isModalVisible).toEqual(false);
            expect(currentIndex).toEqual(-1);
        });
    });

    describe("Delete Item", () => {
        const lists: List[] = [
            new List("0", "A", "List", "bottom", [
                new Item("A.1", 1, "Item", false),
                new Item("A.2", 1, "Item", false),
                new Item("A.2", 1, "Item", false),
            ]),
            new List("1", "B", "List", "bottom", [
                new Item("B.1", 1, "Item", false, true),
                new Item("B.2", 1, "Item", false),
                new Item("C.2", 1, "Item", false, true),
            ]),
            new List("2", "C", "List", "bottom", [
                new Item("C.1", 1, "Item", false, true),
                new Item("C.2", 1, "Item", false, true),
                new Item("C.2", 1, "Item", false, true),
            ]),
        ];

        const state: AppData = {
            settings: defaultSettings,
            lists: lists,
            listsState: {
                isModalVisible: false,
                isDeleteAllModalVisible: false,
                currentIndex: -1,
            },
            itemsState: {
                isModalVisible: false,
                currentIndex: -1,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            },
        };

        it("Deletes all items when none are selected", () => {
            const { lists } = appReducer(state, new DeleteItems("0"));
            const newLists: List[] = [
                new List("0", "A", "List", "bottom", []),
                new List("1", "B", "List", "bottom", [
                    new Item("B.1", 1, "Item", false, true),
                    new Item("B.2", 1, "Item", false),
                    new Item("C.2", 1, "Item", false, true),
                ]),
                new List("2", "C", "List", "bottom", [
                    new Item("C.1", 1, "Item", false, true),
                    new Item("C.2", 1, "Item", false, true),
                    new Item("C.2", 1, "Item", false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });

        it("deletes all items when all are selected", () => {
            const { lists } = appReducer(state, new DeleteItems("2"));
            const newLists: List[] = [
                new List("0", "A", "List", "bottom", [
                    new Item("A.1", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                ]),
                new List("1", "B", "List", "bottom", [
                    new Item("B.1", 1, "Item", false, true),
                    new Item("B.2", 1, "Item", false),
                    new Item("C.2", 1, "Item", false, true),
                ]),
                new List("2", "C", "List", "bottom", []),
            ];
            assertListsEqual(lists, newLists);
        });

        it("Deletes selected items", () => {
            const { lists } = appReducer(state, new DeleteItems("1"));
            const newLists: List[] = [
                new List("0", "A", "List", "bottom", [
                    new Item("A.1", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                ]),
                new List("1", "B", "List", "bottom", [
                    new Item("B.2", 1, "Item", false),
                ]),
                new List("2", "C", "List", "bottom", [
                    new Item("C.1", 1, "Item", false, true),
                    new Item("C.2", 1, "Item", false, true),
                    new Item("C.2", 1, "Item", false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });
    });

    describe("Copy Items Workflow", () => {
        const action: MoveItemAction = "Copy";

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
                listsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isDeleteAllModalVisible: false,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "1", "0")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("Move Items Workflow", () => {
        const action: MoveItemAction = "Move";

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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newState: AppData = appReducer(
                state,
                new MoveItems(action, currentListId, "1", "0")
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("Item Modal Visibility", () => {
        const state: AppData = {
            settings: defaultSettings,
            lists: [],
            listsState: {
                isModalVisible: false,
                isDeleteAllModalVisible: false,
                currentIndex: -1,
            },
            itemsState: {
                isModalVisible: false,
                currentIndex: -1,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            },
        };

        describe("is visible", () => {
            it("when adding a new item", () => {
                const newState: AppData = appReducer(
                    state,
                    new UpdateModalVisible("Item", true)
                );

                const {
                    itemsState: { isModalVisible, currentIndex },
                } = newState;

                expect(isModalVisible).toEqual(true);
                expect(currentIndex).toEqual(-1);
            });

            it("when editing an existing item", () => {
                const newState: AppData = appReducer(
                    state,
                    new UpdateModalVisible("Item", true, 5)
                );

                const {
                    itemsState: { isModalVisible, currentIndex },
                } = newState;

                expect(isModalVisible).toEqual(true);
                expect(currentIndex).toEqual(5);
            });
        });

        describe("is not visible", () => {
            const editState: AppData = {
                settings: defaultSettings,
                lists: [],
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: true,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            it("is not visible after adding item", () => {
                const newState: AppData = appReducer(
                    editState,
                    new UpdateModalVisible("Item", false)
                );

                const {
                    itemsState: { isModalVisible, currentIndex },
                } = newState;

                expect(isModalVisible).toEqual(false);
                expect(currentIndex).toEqual(-1);
            });

            it("is not visible after editing item", () => {
                const newState: AppData = appReducer(
                    editState,
                    new UpdateModalVisible("Item", false)
                );

                const {
                    itemsState: { isModalVisible, currentIndex },
                } = newState;

                expect(isModalVisible).toEqual(false);
                expect(currentIndex).toEqual(-1);
            });
        });
    });

    describe("Delete Modal Visibility", () => {
        it("is visible", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [],
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newState = appReducer(
                state,
                new UpdateDeleteModalVisible("Item", true)
            );

            const {
                itemsState: { isDeleteAllModalVisible },
            } = newState;

            expect(isDeleteAllModalVisible).toEqual(true);
        });

        it("is not visible", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [],
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: true,
                },
            };

            const newState = appReducer(
                state,
                new UpdateDeleteModalVisible("Item", false)
            );

            const {
                itemsState: { isDeleteAllModalVisible },
            } = newState;

            expect(isDeleteAllModalVisible).toEqual(false);
        });
    });

    describe("Copy/Move Item Modal Visibility", () => {
        it("is visible", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [],
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newState = appReducer(
                state,
                new UpdateCopyModalVisible(true)
            );

            const {
                itemsState: { isCopyModalVisible },
            } = newState;

            expect(isCopyModalVisible).toEqual(true);
        });

        it("is not visible", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [],
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isCopyModalVisible: true,
                    isDeleteAllModalVisible: false,
                },
            };

            const newState = appReducer(
                state,
                new UpdateCopyModalVisible(false)
            );

            const {
                itemsState: { isCopyModalVisible },
            } = newState;

            expect(isCopyModalVisible).toEqual(false);
        });
    });

    describe("Select Items", () => {
        const lists: List[] = [
            new List("0", "A", "List", "bottom", [
                new Item("A.1", 1, "Item", false),
                new Item("A.2", 1, "Item", false),
                new Item("A.2", 1, "Item", false),
            ]),
            new List("1", "B", "List", "bottom", [
                new Item("B.1", 1, "Item", false),
                new Item("B.2", 1, "Item", false),
                new Item("C.2", 1, "Item", false),
            ]),
        ];

        const state: AppData = {
            settings: defaultSettings,
            lists: lists,
            listsState: {
                isModalVisible: false,
                isDeleteAllModalVisible: false,
                currentIndex: -1,
            },
            itemsState: {
                isModalVisible: false,
                currentIndex: -1,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            },
        };

        it("selects all items", () => {
            const { lists } = appReducer(state, new SelectAllItems("1", true));

            const newLists: List[] = [
                new List("0", "A", "List", "bottom", [
                    new Item("A.1", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                ]),
                new List("1", "B", "List", "bottom", [
                    new Item("B.1", 1, "Item", false, true),
                    new Item("B.2", 1, "Item", false, true),
                    new Item("C.2", 1, "Item", false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });

        it("selects a single item", () => {
            const { lists } = appReducer(state, new SelectItem("0", 2, true));

            const newLists: List[] = [
                new List("0", "A", "List", "bottom", [
                    new Item("A.1", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                    new Item("A.2", 1, "Item", false, true),
                ]),
                new List("1", "B", "List", "bottom", [
                    new Item("B.1", 1, "Item", false),
                    new Item("B.2", 1, "Item", false),
                    new Item("C.2", 1, "Item", false),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });
    });

    describe("Complete Items", () => {
        const lists: List[] = [
            new List("0", "A", "List", "bottom", [
                new Item("A.1", 1, "Item", false),
                new Item("A.2", 1, "Item", false),
                new Item("A.2", 1, "Item", false),
            ]),
            new List("1", "B", "List", "bottom", [
                new Item("B.1", 1, "Item", false),
                new Item("B.2", 1, "Item", false),
                new Item("C.2", 1, "Item", false),
            ]),
        ];

        const state: AppData = {
            settings: defaultSettings,
            lists: lists,
            listsState: {
                isModalVisible: false,
                isDeleteAllModalVisible: false,
                currentIndex: -1,
            },
            itemsState: {
                isModalVisible: false,
                currentIndex: -1,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            },
        };

        it("marks all items as complete and incomplete", () => {
            const { lists: completeItemsLists }: AppData = appReducer(
                state,
                new ItemsIsComplete("0", true)
            );

            const newLists: List[] = [
                new List("0", "A", "List", "bottom", [
                    new Item("A.1", 1, "Item", true),
                    new Item("A.2", 1, "Item", true),
                    new Item("A.2", 1, "Item", true),
                ]),
                new List("1", "B", "List", "bottom", [
                    new Item("B.1", 1, "Item", false),
                    new Item("B.2", 1, "Item", false),
                    new Item("C.2", 1, "Item", false),
                ]),
            ];

            assertListsEqual(completeItemsLists, newLists);
        });

        it("marks one item as complete", () => {
            const { lists }: AppData = appReducer(
                state,
                new ItemIsComplete("0", 0)
            );

            const expectedLists: List[] = [
                new List("0", "A", "List", "bottom", [
                    new Item("A.1", 1, "Item", true),
                    new Item("A.2", 1, "Item", false),
                    new Item("A.2", 1, "Item", false),
                ]),
                new List("1", "B", "List", "bottom", [
                    new Item("B.1", 1, "Item", false),
                    new Item("B.2", 1, "Item", false),
                    new Item("C.2", 1, "Item", false),
                ]),
            ];

            assertListsEqual(lists, expectedLists);
        });
    });
});