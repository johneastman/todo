import { defaultListsData } from "../../contexts/lists.context";
import { List } from "../../data/data";
import {
    AddList,
    ListsData,
    DeleteLists,
    SelectAllLists,
    SelectList,
    UpdateList,
    listsReducer,
    SelectMultipleLists,
    SelectListsWhere,
} from "../../data/reducers/lists.reducer";
import { listTypePredicateFactory } from "../../utils";
import listSelected, { assertListsEqual, listDefault } from "../testUtils";

describe("Lists", () => {
    describe("Add Lists", () => {
        const list: List = listDefault("My List", "Shopping", "bottom");

        it("adds a new list", () => {
            const newState: ListsData = listsReducer(
                defaultListsData,
                new AddList({ oldPos: -1, newPos: 1, list: list })
            );

            const newLists: List[] = [list];

            const { lists } = newState;

            assertListsEqual(lists, newLists);
        });

        it("adds a new list to the beginning", () => {
            const lists: List[] = [list];

            const newList: List = listDefault("My Second List", "List", "top");

            const newState: ListsData = listsReducer(
                { ...defaultListsData, lists: lists },
                new AddList({ oldPos: -1, newPos: 0, list: newList })
            );

            const { lists: actualLists } = newState;
            const expectedLists: List[] = [newList, list];
            assertListsEqual(actualLists, expectedLists);
        });
    });

    describe("Update Lists", () => {
        const oldState: ListsData = {
            ...defaultListsData,
            lists: [
                listDefault("My List", "Shopping", "bottom"),
                listDefault("My Second List", "Ordered To-Do", "top"),
            ],
        };

        it("updates a list", () => {
            const list: List = listDefault(
                "My List [UPDATED]",
                "List",
                "bottom"
            );

            const newState: ListsData = listsReducer(
                oldState,
                new UpdateList({ oldPos: 0, newPos: 0, list: list })
            );

            const newLists: List[] = [
                list,
                listDefault("My Second List", "Ordered To-Do", "top"),
            ];

            const { lists } = newState;

            assertListsEqual(lists, newLists);
        });
    });

    describe("Delete Lists", () => {
        it("deletes none when no lists are selected", () => {
            const oldState: ListsData = {
                ...defaultListsData,
                lists: [
                    listDefault("List 0", "List", "bottom", []),
                    listDefault("List 1", "List", "top", []),
                    listDefault("List 2", "Shopping", "bottom", []),
                ],
            };

            const { lists }: ListsData = listsReducer(
                oldState,
                new DeleteLists()
            );
            const expectedLists: List[] = [
                listDefault("List 0", "List", "bottom", []),
                listDefault("List 1", "List", "top", []),
                listDefault("List 2", "Shopping", "bottom", []),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("deletes all when all are selected", () => {
            const oldState: ListsData = {
                ...defaultListsData,
                lists: [
                    listSelected("List 0", "List", "bottom"),
                    listSelected("List 1", "List", "top"),
                    listSelected("List 2", "Shopping", "bottom"),
                ],
            };

            const { lists }: ListsData = listsReducer(
                oldState,
                new DeleteLists()
            );
            expect(lists.length).toEqual(0);
        });

        it("deletes selected", () => {
            const oldState: ListsData = {
                ...defaultListsData,
                lists: [
                    listSelected("List 0", "List", "bottom"),
                    listDefault("List 1", "List", "top"),
                    listSelected("List 2", "Shopping", "bottom"),
                ],
            };

            const { lists }: ListsData = listsReducer(
                oldState,
                new DeleteLists()
            );
            const expectedLists: List[] = [
                listDefault("List 1", "List", "top"),
            ];
            assertListsEqual(lists, expectedLists);
        });
    });

    describe("select lists", () => {
        const lists: List[] = [
            listDefault("A", "List", "bottom"),
            listDefault("B", "List", "bottom"),
            listDefault("C", "List", "bottom"),
        ];

        const oldState: ListsData = {
            ...defaultListsData,
            lists: lists,
        };
        it("selects all", () => {
            const { lists } = listsReducer(oldState, new SelectAllLists(true));
            const expectedLists: List[] = [
                listSelected("A", "List", "bottom"),
                listSelected("B", "List", "bottom"),
                listSelected("C", "List", "bottom"),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("selects a single list", () => {
            const { lists } = listsReducer(oldState, new SelectList(1, true));
            const expectedLists: List[] = [
                listDefault("A", "List", "bottom"),
                listSelected("B", "List", "bottom"),
                listDefault("C", "List", "bottom"),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("selects multiple lists", () => {
            const { lists } = listsReducer(
                oldState,
                new SelectMultipleLists([0, 2], true)
            );

            const expectedLists: List[] = [
                listSelected("A", "List", "bottom"),
                listDefault("B", "List", "bottom"),
                listSelected("C", "List", "bottom"),
            ];

            assertListsEqual(lists, expectedLists);
        });

        it("deselects multiple lists", () => {
            const oldLists: List[] = [
                listSelected("A", "List", "bottom", []),
                listSelected("B", "List", "bottom", []),
                listDefault("C", "List", "bottom"),
            ];

            const oldState: ListsData = {
                ...defaultListsData,
                lists: oldLists,
            };

            const { lists } = listsReducer(
                oldState,
                new SelectMultipleLists([0, 1], false)
            );

            const expectedLists: List[] = [
                listDefault("A", "List", "bottom"),
                listDefault("B", "List", "bottom"),
                listDefault("C", "List", "bottom"),
            ];

            assertListsEqual(lists, expectedLists);
        });

        describe("select lists where", () => {
            const lists: List[] = [
                listDefault("A", "List", "bottom"),
                listDefault("B", "Shopping", "bottom"),
                listDefault("C", "To-Do", "bottom"),
                listDefault("D", "Ordered To-Do", "bottom"),
            ];

            const prevState: ListsData = {
                ...defaultListsData,
                lists: lists,
            };

            it("selects all generic lists", () => {
                const { lists } = listsReducer(
                    prevState,
                    new SelectListsWhere(listTypePredicateFactory("List"))
                );
                const expectedLists: List[] = [
                    listSelected("A", "List", "bottom"),
                    listDefault("B", "Shopping", "bottom"),
                    listDefault("C", "To-Do", "bottom"),
                    listDefault("D", "Ordered To-Do", "bottom"),
                ];
                assertListsEqual(lists, expectedLists);
            });

            it("selects all shopping lists", () => {
                const { lists } = listsReducer(
                    prevState,
                    new SelectListsWhere(listTypePredicateFactory("Shopping"))
                );
                const expectedLists: List[] = [
                    listDefault("A", "List", "bottom"),
                    listSelected("B", "Shopping", "bottom"),
                    listDefault("C", "To-Do", "bottom"),
                    listDefault("D", "Ordered To-Do", "bottom"),
                ];
                assertListsEqual(lists, expectedLists);
            });

            it("selects all to-do lists", () => {
                const { lists } = listsReducer(
                    prevState,
                    new SelectListsWhere(listTypePredicateFactory("To-Do"))
                );
                const expectedLists: List[] = [
                    listDefault("A", "List", "bottom"),
                    listDefault("B", "Shopping", "bottom"),
                    listSelected("C", "To-Do", "bottom"),
                    listDefault("D", "Ordered To-Do", "bottom"),
                ];
                assertListsEqual(lists, expectedLists);
            });

            it("selects all ordered to-do lists", () => {
                const { lists } = listsReducer(
                    prevState,
                    new SelectListsWhere(
                        listTypePredicateFactory("Ordered To-Do")
                    )
                );
                const expectedLists: List[] = [
                    listDefault("A", "List", "bottom"),
                    listDefault("B", "Shopping", "bottom"),
                    listDefault("C", "To-Do", "bottom"),
                    listSelected("D", "Ordered To-Do", "bottom"),
                ];
                assertListsEqual(lists, expectedLists);
            });
        });
    });
});
