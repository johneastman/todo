import { defaultSettings } from "../../contexts/app.context";
import { List } from "../../data/data";
import {
    AddList,
    AppData,
    DeleteLists,
    SelectAllLists,
    SelectList,
    UpdateDeleteModalVisible,
    UpdateList,
    UpdateModalVisible,
    appReducer,
} from "../../data/reducers/app.reducer";
import { assertListsEqual } from "../testUtils";

describe("Lists", () => {
    describe("Add Lists", () => {
        const oldState: AppData = {
            settings: defaultSettings,
            lists: [],
            itemsState: {
                currentIndex: -1,
                isModalVisible: false,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            },
            listsState: {
                currentIndex: -1,
                isModalVisible: false,
                isDeleteAllModalVisible: false,
            },
        };

        it("adds a new list", () => {
            const list: List = new List("My List", "Shopping", "bottom");

            const newState: AppData = appReducer(
                oldState,
                new AddList({ oldPos: -1, newPos: 1, list: list }, false)
            );

            const newLists: List[] = [list];

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;

            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(-1);
            expect(isModalVisible).toEqual(false);
        });

        it("adds a new list with alternate action", () => {
            const list: List = new List("My List", "Shopping", "bottom");

            const newState: AppData = appReducer(
                oldState,
                new AddList({ oldPos: -1, newPos: 1, list: list }, true)
            );

            const newLists: List[] = [list];

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
                new List("My List", "Shopping", "bottom"),
                new List("My Second List", "Ordered To-Do", "top"),
            ],
            itemsState: {
                currentIndex: -1,
                isModalVisible: false,
                isCopyModalVisible: false,
                isDeleteAllModalVisible: false,
            },
            listsState: {
                currentIndex: 0,
                isModalVisible: true,
                isDeleteAllModalVisible: false,
            },
        };

        it("updates a list", () => {
            const list: List = new List("My List [UPDATED]", "List", "bottom");

            const newState: AppData = appReducer(
                oldState,
                new UpdateList({ oldPos: 0, newPos: 0, list: list }, false)
            );

            const newLists: List[] = [
                list,
                new List("My Second List", "Ordered To-Do", "top"),
            ];

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;

            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(-1);
            expect(isModalVisible).toEqual(false);
        });

        it("updates a list with alternate action", () => {
            const list: List = new List("My List [UPDATED]", "List", "bottom");

            const newState: AppData = appReducer(
                oldState,
                new UpdateList({ oldPos: 0, newPos: 0, list: list }, true)
            );

            const newLists: List[] = [
                list,
                new List("My Second List", "Ordered To-Do", "top"),
            ];

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
                    new List("My List", "Shopping", "bottom"),
                    new List("My Second List", "Ordered To-Do", "top"),
                ],
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

            const list: List = new List(
                "My Second List",
                "Ordered To-Do",
                "top"
            );

            const newState: AppData = appReducer(
                oldState,
                new UpdateList({ oldPos: 1, newPos: 1, list: list }, true)
            );

            const newLists: List[] = [
                new List("My List", "Shopping", "bottom"),
                list,
            ];

            const {
                lists,
                listsState: { currentIndex, isModalVisible },
            } = newState;
            assertListsEqual(lists, newLists);
            expect(currentIndex).toEqual(-1);
            expect(isModalVisible).toEqual(false);
        });
    });

    describe("Delete Lists", () => {
        it("deletes none when no lists are selected", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("List 0", "List", "bottom", []),
                    new List("List 1", "List", "top", []),
                    new List("List 2", "Shopping", "bottom", []),
                ],
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

            const { lists }: AppData = appReducer(state, new DeleteLists());
            const expectedLists: List[] = [
                new List("List 0", "List", "bottom", []),
                new List("List 1", "List", "top", []),
                new List("List 2", "Shopping", "bottom", []),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("deletes all when all are selected", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("List 0", "List", "bottom", [], true),
                    new List("List 1", "List", "top", [], true),
                    new List("List 2", "Shopping", "bottom", [], true),
                ],
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

            const { lists }: AppData = appReducer(state, new DeleteLists());
            expect(lists.length).toEqual(0);
        });

        it("deletes selected", () => {
            const state: AppData = {
                settings: defaultSettings,
                lists: [
                    new List("List 0", "List", "bottom", [], true),
                    new List("List 1", "List", "top", []),
                    new List("List 2", "Shopping", "bottom", [], true),
                ],
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

            const { lists }: AppData = appReducer(state, new DeleteLists());
            const expectedLists: List[] = [
                new List("List 1", "List", "top", []),
            ];
            assertListsEqual(lists, expectedLists);
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
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
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

    describe("List Modal Visibility", () => {
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
                    isCopyModalVisible: false,
                    isDeleteAllModalVisible: false,
                },
            };

            it("after adding a list", () => {
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

            it("after updating a list", () => {
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

    describe("Select Lists", () => {
        const lists: List[] = [
            new List("A", "List", "bottom"),
            new List("B", "List", "bottom"),
            new List("C", "List", "bottom"),
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
        it("selects all", () => {
            const { lists } = appReducer(state, new SelectAllLists(true));
            const expectedLists: List[] = [
                new List("A", "List", "bottom", [], true),
                new List("B", "List", "bottom", [], true),
                new List("C", "List", "bottom", [], true),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("selects a single list", () => {
            const { lists } = appReducer(state, new SelectList(1, true));
            const expectedLists: List[] = [
                new List("A", "List", "bottom"),
                new List("B", "List", "bottom", [], true),
                new List("C", "List", "bottom"),
            ];
            assertListsEqual(lists, expectedLists);
        });
    });
});
