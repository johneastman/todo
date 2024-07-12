import { defaultAppData } from "../../contexts/app.context";
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
    AppData,
    ActionsModalVisible,
} from "../../data/reducers/app.reducer";
import { MoveItemAction } from "../../types";
import { assertListsEqual } from "../testUtils";

describe("Items", () => {
    const currentListIndex: number = 0;

    describe("Add Items", () => {
        const oldState: AppData = {
            ...defaultAppData,
            lists: [new List("My List", "Shopping", "bottom")],
        };

        it("adds a new item", () => {
            const item: Item = new Item("Carrots", 1, false);
            const newState: AppData = appReducer(
                oldState,
                new AddItem(
                    {
                        listIndex: 0,
                        item: item,
                        oldPos: -1,
                        newPos: 0,
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
                new List("My List", "Shopping", "bottom", newItems),
            ];

            assertListsEqual(lists, newLists);
            expect(isModalVisible).toEqual(false);
            expect(currentIndex).toEqual(-1);
        });

        it("adds a new item with alternate action", () => {
            const item: Item = new Item("Carrots", 1, false);

            const newState: AppData = appReducer(
                oldState,
                new AddItem(
                    {
                        listIndex: 0,
                        item: item,
                        oldPos: -1,
                        newPos: 0,
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
                new List("My List", "Shopping", "bottom", newItems),
            ];

            // The modal remains visible
            assertListsEqual(lists, newLists);
            expect(isModalVisible).toEqual(true);
            expect(currentIndex).toEqual(-1);
        });
    });

    describe("Update Items", () => {
        it("updates items with alternate action", () => {
            const item: Item = new Item("B", 1, false);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [
                    new List("My List", "Shopping", "bottom", [
                        new Item("A", 1, false),
                        item,
                        new Item("C", 1, false),
                        new Item("D", 1, false),
                    ]),
                ],
                itemsState: {
                    ...defaultAppData.itemsState,
                    currentIndex: 1,
                    isModalVisible: true,
                },
            };

            const newState: AppData = appReducer(
                oldState,
                new UpdateItem(
                    {
                        listIndex: 0,
                        item: item,
                        oldPos: 1,
                        newPos: 1,
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
            const item: Item = new Item("D", 1, false);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [
                    new List("My List", "Shopping", "bottom", [
                        new Item("A", 1, false),
                        new Item("B", 1, false),
                        new Item("C", 1, false),
                        item,
                    ]),
                ],
                itemsState: {
                    ...defaultAppData.itemsState,
                    currentIndex: 3,
                    isModalVisible: true,
                },
            };

            const newState: AppData = appReducer(
                oldState,
                new UpdateItem(
                    {
                        listIndex: 0,
                        item: new Item("D", 1, false),
                        oldPos: 3,
                        newPos: 3,
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
            new List("A", "List", "bottom", [
                new Item("A.1", 1, false),
                new Item("A.2", 1, false),
                new Item("A.2", 1, false),
            ]),
            new List("B", "List", "bottom", [
                new Item("B.1", 1, false, true),
                new Item("B.2", 1, false),
                new Item("C.2", 1, false, true),
            ]),
            new List("C", "List", "bottom", [
                new Item("C.1", 1, false, true),
                new Item("C.2", 1, false, true),
                new Item("C.2", 1, false, true),
            ]),
        ];

        const oldState: AppData = {
            ...defaultAppData,
            lists: lists,
        };

        it("Deletes none items when none are selected", () => {
            const { lists } = appReducer(oldState, new DeleteItems(0));
            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", 1, false),
                    new Item("A.2", 1, false),
                    new Item("A.2", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", 1, false, true),
                    new Item("B.2", 1, false),
                    new Item("C.2", 1, false, true),
                ]),
                new List("C", "List", "bottom", [
                    new Item("C.1", 1, false, true),
                    new Item("C.2", 1, false, true),
                    new Item("C.2", 1, false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });

        it("deletes all items when all are selected", () => {
            const { lists } = appReducer(oldState, new DeleteItems(2));
            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", 1, false),
                    new Item("A.2", 1, false),
                    new Item("A.2", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", 1, false, true),
                    new Item("B.2", 1, false),
                    new Item("C.2", 1, false, true),
                ]),
                new List("C", "List", "bottom", []),
            ];
            assertListsEqual(lists, newLists);
        });

        it("Deletes selected items", () => {
            const { lists } = appReducer(oldState, new DeleteItems(1));
            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", 1, false),
                    new Item("A.2", 1, false),
                    new Item("A.2", 1, false),
                ]),
                new List("B", "List", "bottom", [new Item("B.2", 1, false)]),
                new List("C", "List", "bottom", [
                    new Item("C.1", 1, false, true),
                    new Item("C.2", 1, false, true),
                    new Item("C.2", 1, false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });
    });

    describe("Copy Items Workflow", () => {
        const action: MoveItemAction = "Copy";

        it("copies no items from the current list into the other list when no items are selected", () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false), new Item("B", 1, false)]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false), new Item("B", 1, false)]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 0, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies items from the current list into another list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false, true), new Item("B", 1, false, true)]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false), new Item("B", 1, false)]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
                new Item("A", 1, false),
                new Item("B", 1, false),
            ]);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 0, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies items from other list into current list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false), new Item("B", 1, false)]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false),
                    new Item("C", 1, false),
                ]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 1, 0)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies selected items from current list into other list", async () => {
            const currentListBefore: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false, true),
                    new Item("C", 1, false),
                    new Item("D", 1, false, true),
                    new Item("E", 1, false, true),
                ]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false),
                    new Item("C", 1, false),
                    new Item("D", 1, false),
                    new Item("E", 1, false),
                ]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
                new Item("B", 1, false),
                new Item("D", 1, false),
                new Item("E", 1, false),
            ]);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 0, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("copies selected items from other list into current list (ignores selected items in other list)", async () => {
            const currentListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);
            const otherListBefore: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false, true),
                    new Item("C", 1, false),
                    new Item("D", 1, false, true),
                    new Item("E", 1, false, true),
                ]
            );

            const currentListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
                new Item("A", 1, false),
                new Item("B", 1, false),
                new Item("C", 1, false),
                new Item("D", 1, false),
                new Item("E", 1, false),
            ]);
            const otherListAfter: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false),
                    new Item("C", 1, false),
                    new Item("D", 1, false),
                    new Item("E", 1, false),
                ]
            );

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 1, 0)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("Move Items Workflow", () => {
        const action: MoveItemAction = "Move";

        it("moves no items from the current list into the other list when no items are selected", () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false), new Item("B", 1, false)]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false), new Item("B", 1, false)]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 0, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves items from the current list into the other list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false, true), new Item("B", 1, false, true)]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                []
            );

            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
                new Item("A", 1, false),
                new Item("B", 1, false),
            ]);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 0, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves items from the other list into the current list", async () => {
            const currentListBefore: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [new Item("A", 1, false), new Item("B", 1, false)]
            );

            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 0",
                "Shopping",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false),
                    new Item("C", 1, false),
                ]
            );
            const otherListAfter: List = new List("List 1", "List", "top", []);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 1, 0)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves selected items from the current list into the other list", async () => {
            const currentListBefore: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false, true),
                    new Item("C", 1, false),
                    new Item("D", 1, false, true),
                    new Item("E", 1, false, true),
                ]
            );
            const otherListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const currentListAfter: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                [new Item("A", 1, false), new Item("C", 1, false)]
            );
            const otherListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
                new Item("B", 1, false),
                new Item("D", 1, false),
                new Item("E", 1, false),
            ]);

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 0, 1)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });

        it("moves selected items from the other list into the current list (ignores selected in other list)", async () => {
            const currentListBefore: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
            ]);

            const otherListBefore: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                [
                    new Item("A", 1, false),
                    new Item("B", 1, false, true),
                    new Item("C", 1, false),
                    new Item("D", 1, false, true),
                    new Item("E", 1, false, true),
                ]
            );

            const currentListAfter: List = new List("List 1", "List", "top", [
                new Item("C", 1, false),
                new Item("A", 1, false),
                new Item("B", 1, false),
                new Item("C", 1, false),
                new Item("D", 1, false),
                new Item("E", 1, false),
            ]);
            const otherListAfter: List = new List(
                "List 2",
                "Ordered To-Do",
                "bottom",
                []
            );

            const oldState: AppData = {
                ...defaultAppData,
                lists: [currentListBefore, otherListBefore],
            };

            const newState: AppData = appReducer(
                oldState,
                new MoveItems(action, currentListIndex, 1, 0)
            );

            const { lists: actualLists } = newState;
            assertListsEqual(actualLists, [currentListAfter, otherListAfter]);
        });
    });

    describe("Item Modal Visibility", () => {
        describe("is visible", () => {
            it("when adding a new item", () => {
                const newState: AppData = appReducer(
                    defaultAppData,
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
                    defaultAppData,
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
            const oldState: AppData = {
                ...defaultAppData,
                itemsState: {
                    ...defaultAppData.itemsState,
                    isModalVisible: true,
                },
            };

            it("is not visible after adding item", () => {
                const newState: AppData = appReducer(
                    oldState,
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
                    oldState,
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
            const newState = appReducer(
                defaultAppData,
                new UpdateDeleteModalVisible("Item", true)
            );

            const {
                itemsState: { isDeleteAllModalVisible },
            } = newState;

            expect(isDeleteAllModalVisible).toEqual(true);
        });

        it("is not visible", () => {
            const oldState: AppData = {
                ...defaultAppData,
                itemsState: {
                    ...defaultAppData.itemsState,
                    isDeleteAllModalVisible: true,
                },
            };

            const newState = appReducer(
                oldState,
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
            const newState = appReducer(
                defaultAppData,
                new UpdateCopyModalVisible(true)
            );

            const {
                itemsState: { isCopyModalVisible },
            } = newState;

            expect(isCopyModalVisible).toEqual(true);
        });

        it("is not visible", () => {
            const oldState: AppData = {
                ...defaultAppData,
                itemsState: {
                    ...defaultAppData.itemsState,
                    isCopyModalVisible: true,
                },
            };

            const newState = appReducer(
                oldState,
                new UpdateCopyModalVisible(false)
            );

            const {
                itemsState: { isCopyModalVisible },
            } = newState;

            expect(isCopyModalVisible).toEqual(false);
        });
    });

    describe("Actions Modal Visibility", () => {
        it("is visible", () => {
            const newState = appReducer(
                defaultAppData,
                new ActionsModalVisible(true)
            );

            const {
                itemsState: { isActionsModalVisible },
            } = newState;

            expect(isActionsModalVisible).toEqual(true);
        });

        it("is not visible", () => {
            const newState = appReducer(
                {
                    ...defaultAppData,
                    itemsState: {
                        ...defaultAppData.itemsState,
                        isActionsModalVisible: true,
                    },
                },
                new ActionsModalVisible(false)
            );

            const {
                itemsState: { isActionsModalVisible },
            } = newState;

            expect(isActionsModalVisible).toEqual(false);
        });
    });

    describe("Select Items", () => {
        const lists: List[] = [
            new List("A", "List", "bottom", [
                new Item("A.1", 1, false),
                new Item("A.2", 1, false),
                new Item("A.2", 1, false),
            ]),
            new List("B", "List", "bottom", [
                new Item("B.1", 1, false),
                new Item("B.2", 1, false),
                new Item("C.2", 1, false),
            ]),
        ];

        const oldState: AppData = {
            ...defaultAppData,
            lists: lists,
        };

        it("selects all items", () => {
            const { lists } = appReducer(oldState, new SelectAllItems(1, true));

            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", 1, false),
                    new Item("A.2", 1, false),
                    new Item("A.2", 1, false),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", 1, false, true),
                    new Item("B.2", 1, false, true),
                    new Item("C.2", 1, false, true),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });

        it("selects a single item", () => {
            const { lists } = appReducer(oldState, new SelectItem(0, 2, true));

            const newLists: List[] = [
                new List("A", "List", "bottom", [
                    new Item("A.1", 1, false),
                    new Item("A.2", 1, false),
                    new Item("A.2", 1, false, true),
                ]),
                new List("B", "List", "bottom", [
                    new Item("B.1", 1, false),
                    new Item("B.2", 1, false),
                    new Item("C.2", 1, false),
                ]),
            ];
            assertListsEqual(lists, newLists);
        });
    });

    describe("Complete Items", () => {
        const lists: List[] = [
            new List("None Complete/All Selected", "List", "bottom", [
                new Item("A", 1, false, true),
                new Item("B", 1, false, true),
                new Item("C", 1, false, true),
            ]),
            new List("All Complete/None Selected", "List", "bottom", [
                new Item("A", 1, true),
                new Item("B", 1, true),
                new Item("C", 1, true),
            ]),
            new List("Some Complete/Some Selected", "List", "bottom", [
                new Item("A", 1, false),
                new Item("B", 1, true, true),
                new Item("C", 1, false),
            ]),
        ];

        const oldState: AppData = {
            ...defaultAppData,
            lists: lists,
        };

        it("marks all items as complete", () => {
            const { lists: completeItemsLists }: AppData = appReducer(
                oldState,
                new ItemsIsComplete(0, true)
            );

            const newLists: List[] = [
                new List("None Complete/All Selected", "List", "bottom", [
                    new Item("A", 1, true, true),
                    new Item("B", 1, true, true),
                    new Item("C", 1, true, true),
                ]),
                new List("All Complete/None Selected", "List", "bottom", [
                    new Item("A", 1, true),
                    new Item("B", 1, true),
                    new Item("C", 1, true),
                ]),
                new List("Some Complete/Some Selected", "List", "bottom", [
                    new Item("A", 1, false),
                    new Item("B", 1, true, true),
                    new Item("C", 1, false),
                ]),
            ];

            assertListsEqual(completeItemsLists, newLists);
        });

        it("marks no items as complete (because none are selected)", () => {
            const { lists: completeItemsLists }: AppData = appReducer(
                oldState,
                new ItemsIsComplete(1, false)
            );

            const newLists: List[] = [
                new List("None Complete/All Selected", "List", "bottom", [
                    new Item("A", 1, false, true),
                    new Item("B", 1, false, true),
                    new Item("C", 1, false, true),
                ]),
                new List("All Complete/None Selected", "List", "bottom", [
                    new Item("A", 1, true),
                    new Item("B", 1, true),
                    new Item("C", 1, true),
                ]),
                new List("Some Complete/Some Selected", "List", "bottom", [
                    new Item("A", 1, false),
                    new Item("B", 1, true, true),
                    new Item("C", 1, false),
                ]),
            ];

            assertListsEqual(completeItemsLists, newLists);
        });

        it("marks one item as complete", () => {
            const { lists }: AppData = appReducer(
                oldState,
                new ItemIsComplete(2, 0)
            );

            const expectedLists: List[] = [
                new List("None Complete/All Selected", "List", "bottom", [
                    new Item("A", 1, false, true),
                    new Item("B", 1, false, true),
                    new Item("C", 1, false, true),
                ]),
                new List("All Complete/None Selected", "List", "bottom", [
                    new Item("A", 1, true),
                    new Item("B", 1, true),
                    new Item("C", 1, true),
                ]),
                new List("Some Complete/Some Selected", "List", "bottom", [
                    new Item("A", 1, true),
                    new Item("B", 1, true, true),
                    new Item("C", 1, false),
                ]),
            ];

            assertListsEqual(lists, expectedLists);
        });
    });
});
