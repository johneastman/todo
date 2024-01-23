import { defaultSettings } from "../contexts/app.context";
import { Item, List } from "../data/data";
import {
    MoveItems,
    UpdateDeleteModalVisible,
    UpdateItems,
    UpdateLists,
    UpdateModalVisible,
    appReducer,
} from "../data/reducers/app.reducer";
import { AppData, MoveItemAction } from "../types";
import { assertListsEqual } from "./testUtils";

describe("app reducer", () => {
    const currentListId: string = "0";

    describe("Add Lists", () => {
        const oldState: AppData = {
            settings: defaultSettings,
            lists: [],
            itemsState: {
                currentIndex: -1,
                isModalVisible: false,
            },
            listsState: {
                currentIndex: -1,
                isModalVisible: false,
                isDeleteAllModalVisible: false,
            },
        };

        it("adds a new list", () => {
            const newLists: List[] = [
                new List("0", "My List", "Shopping", "bottom"),
            ];

            const newState: AppData = appReducer(
                oldState,
                new UpdateLists(newLists, false)
            );

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;
            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(-1);
            expect(isModalVisible).toEqual(false);
        });

        it("adds a new list with alternate action", () => {
            const newLists: List[] = [
                new List("0", "My List", "Shopping", "bottom"),
            ];

            const newState: AppData = appReducer(
                oldState,
                new UpdateLists(newLists, true)
            );

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;
            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(-1);
            expect(isModalVisible).toEqual(true);
        });
    });

    describe("Update Lists", () => {
        const oldState: AppData = {
            settings: defaultSettings,
            lists: [
                new List("0", "My List", "Shopping", "bottom"),
                new List("1", "My Second List", "Ordered To-Do", "top"),
            ],
            itemsState: {
                currentIndex: -1,
                isModalVisible: false,
            },
            listsState: {
                currentIndex: 0,
                isModalVisible: true,
                isDeleteAllModalVisible: false,
            },
        };

        it("updates a list", () => {
            const newLists: List[] = [
                new List("0", "My List [UPDATED]", "List", "bottom"),
            ];

            const newState: AppData = appReducer(
                oldState,
                new UpdateLists(newLists, false)
            );

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;
            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(-1);
            expect(isModalVisible).toEqual(false);
        });

        it("updates a list with alternate action", () => {
            const newLists: List[] = [
                new List("0", "My List [UPDATED]", "List", "bottom"),
                new List("1", "My Second List", "Ordered To-Do", "top"),
            ];

            const newState: AppData = appReducer(
                oldState,
                new UpdateLists(newLists, true)
            );

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;
            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(1);
            expect(isModalVisible).toEqual(true);
        });

        it("updates a list with alternate action at end of lists", () => {
            const oldState: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("0", "My List", "Shopping", "bottom"),
                    new List("1", "My Second List", "Ordered To-Do", "top"),
                ],
                itemsState: {
                    currentIndex: -1,
                    isModalVisible: false,
                },
                listsState: {
                    currentIndex: 1,
                    isModalVisible: true,
                    isDeleteAllModalVisible: false,
                },
            };

            const newLists: List[] = [
                new List("0", "My List [UPDATED]", "List", "bottom"),
                new List("1", "My Second List", "Ordered To-Do", "top"),
            ];

            const newState: AppData = appReducer(
                oldState,
                new UpdateLists(newLists, true)
            );

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;
            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(-1);
            expect(isModalVisible).toEqual(false);
        });
    });

    describe("Add Items", () => {
        const oldState: AppData = {
            settings: defaultSettings,
            lists: [new List("0", "My List", "Shopping", "bottom")],
            itemsState: {
                currentIndex: -1,
                isModalVisible: false,
            },
            listsState: {
                currentIndex: 1,
                isModalVisible: true,
                isDeleteAllModalVisible: false,
            },
        };

        it("adds a new item", () => {
            const newItems: Item[] = [new Item("Carrots", 1, "Item", false)];
            const newState: AppData = appReducer(
                oldState,
                new UpdateItems("0", newItems, false)
            );

            const {
                lists,
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            const newLists: List[] = [
                new List("0", "My List", "Shopping", "bottom", [
                    new Item("Carrots", 1, "Item", false),
                ]),
            ];

            assertListsEqual(lists, newLists);
            expect(isModalVisible).toEqual(false);
            expect(currentIndex).toEqual(-1);
        });

        it("adds a new item with alternate action", () => {
            const newItems: Item[] = [new Item("Carrots", 1, "Item", false)];
            const newState: AppData = appReducer(
                oldState,
                new UpdateItems("0", newItems, true)
            );

            const {
                lists,
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            const newLists: List[] = [
                new List("0", "My List", "Shopping", "bottom", [
                    new Item("Carrots", 1, "Item", false),
                ]),
            ];

            // The modal remains visible
            assertListsEqual(lists, newLists);
            expect(isModalVisible).toEqual(true);
            expect(currentIndex).toEqual(-1);
        });
    });

    describe("Update Items", () => {
        it("updates items with alternate action", () => {
            const oldState: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("0", "My List", "Shopping", "bottom", [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                    ]),
                ],
                itemsState: {
                    currentIndex: 1,
                    isModalVisible: true,
                },
                listsState: {
                    currentIndex: -1,
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newItems: Item[] = [
                new Item("A", 1, "Item", false),
                new Item("B", 1, "Item", false),
                new Item("C", 1, "Item", false),
                new Item("D", 1, "Item", false),
            ];

            const newState: AppData = appReducer(
                oldState,
                new UpdateItems("0", newItems, true)
            );

            const {
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            expect(isModalVisible).toEqual(true);
            expect(currentIndex).toEqual(2);
        });

        it("updates last item with alternate action and dismisses modal", () => {
            const oldState: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("0", "My List", "Shopping", "bottom", [
                        new Item("A", 1, "Item", false),
                        new Item("B", 1, "Item", false),
                        new Item("C", 1, "Item", false),
                        new Item("D", 1, "Item", false),
                    ]),
                ],
                itemsState: {
                    currentIndex: 3,
                    isModalVisible: true,
                },
                listsState: {
                    currentIndex: -1,
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            const newItems: Item[] = [
                new Item("A", 1, "Item", false),
                new Item("B", 1, "Item", false),
                new Item("C", 1, "Item", false),
                new Item("D", 1, "Item", false),
            ];

            const newState: AppData = appReducer(
                oldState,
                new UpdateItems("0", newItems, true)
            );

            const {
                itemsState: { isModalVisible, currentIndex },
            } = newState;

            expect(isModalVisible).toEqual(false);
            expect(currentIndex).toEqual(-1);
        });
    });

    describe("Copy Items Workflow", () => {
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
                listsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                    isDeleteAllModalVisible: false,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
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
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: false,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
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

    describe("Cell Modal Visibility", () => {
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
            },
        };

        describe("Lists", () => {
            describe("is visible", () => {
                it("when adding a new list", () => {
                    const newState: AppData = appReducer(
                        state,
                        new UpdateModalVisible("List", true)
                    );

                    const {
                        listsState: { isModalVisible, currentIndex },
                    } = newState;

                    expect(isModalVisible).toEqual(true);
                    expect(currentIndex).toEqual(-1);
                });

                it("when editing an existing list", () => {
                    const newState: AppData = appReducer(
                        state,
                        new UpdateModalVisible("List", true, 5)
                    );

                    const {
                        listsState: { isModalVisible, currentIndex },
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
                        isModalVisible: true,
                        isDeleteAllModalVisible: false,
                        currentIndex: -1,
                    },
                    itemsState: {
                        isModalVisible: false,
                        currentIndex: -1,
                    },
                };

                it("after adding list", () => {
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

                it("after editing list", () => {
                    const newState: AppData = appReducer(
                        editState,
                        new UpdateModalVisible("List", false)
                    );

                    const {
                        listsState: { isModalVisible, currentIndex },
                    } = newState;

                    expect(isModalVisible).toEqual(false);
                    expect(currentIndex).toEqual(-1);
                });
            });
        });

        describe("Items", () => {
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
    });

    describe("Delete All Modal Visibility", () => {
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
                },
            };

            const newState = appReducer(
                state,
                new UpdateDeleteModalVisible("List", true)
            );

            const {
                listsState: { isDeleteAllModalVisible },
            } = newState;

            expect(isDeleteAllModalVisible).toEqual(true);
        });

        it("is not visible", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [],
                listsState: {
                    isModalVisible: false,
                    isDeleteAllModalVisible: true,
                    currentIndex: -1,
                },
                itemsState: {
                    isModalVisible: false,
                    currentIndex: -1,
                },
            };

            const newState = appReducer(
                state,
                new UpdateDeleteModalVisible("List", false)
            );

            const {
                listsState: { isDeleteAllModalVisible },
            } = newState;

            expect(isDeleteAllModalVisible).toEqual(false);
        });
    });
});
