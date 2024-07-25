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
import { ListType } from "../../types";
import { listTypePredicateFactory } from "../../utils";
import { assertListsEqual } from "../testUtils";

describe("Lists", () => {
    describe("Add Lists", () => {
        const list: List = new List("My List", "Shopping", "bottom");

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

            const newList: List = new List("My Second List", "List", "top");

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
                new List("My List", "Shopping", "bottom"),
                new List("My Second List", "Ordered To-Do", "top"),
            ],
        };

        it("updates a list", () => {
            const list: List = new List("My List [UPDATED]", "List", "bottom");

            const newState: ListsData = listsReducer(
                oldState,
                new UpdateList({ oldPos: 0, newPos: 0, list: list })
            );

            const newLists: List[] = [
                list,
                new List("My Second List", "Ordered To-Do", "top"),
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
                    new List("List 0", "List", "bottom", []),
                    new List("List 1", "List", "top", []),
                    new List("List 2", "Shopping", "bottom", []),
                ],
            };

            const { lists }: ListsData = listsReducer(
                oldState,
                new DeleteLists()
            );
            const expectedLists: List[] = [
                new List("List 0", "List", "bottom", []),
                new List("List 1", "List", "top", []),
                new List("List 2", "Shopping", "bottom", []),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("deletes all when all are selected", () => {
            const oldState: ListsData = {
                ...defaultListsData,
                lists: [
                    new List("List 0", "List", "bottom", [], true),
                    new List("List 1", "List", "top", [], true),
                    new List("List 2", "Shopping", "bottom", [], true),
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
                    new List("List 0", "List", "bottom", [], true),
                    new List("List 1", "List", "top", []),
                    new List("List 2", "Shopping", "bottom", [], true),
                ],
            };

            const { lists }: ListsData = listsReducer(
                oldState,
                new DeleteLists()
            );
            const expectedLists: List[] = [
                new List("List 1", "List", "top", []),
            ];
            assertListsEqual(lists, expectedLists);
        });
    });

    describe("select lists", () => {
        const lists: List[] = [
            new List("A", "List", "bottom"),
            new List("B", "List", "bottom"),
            new List("C", "List", "bottom"),
        ];

        const oldState: ListsData = {
            ...defaultListsData,
            lists: lists,
        };
        it("selects all", () => {
            const { lists } = listsReducer(oldState, new SelectAllLists(true));
            const expectedLists: List[] = [
                new List("A", "List", "bottom", [], true),
                new List("B", "List", "bottom", [], true),
                new List("C", "List", "bottom", [], true),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("selects a single list", () => {
            const { lists } = listsReducer(oldState, new SelectList(1, true));
            const expectedLists: List[] = [
                new List("A", "List", "bottom"),
                new List("B", "List", "bottom", [], true),
                new List("C", "List", "bottom"),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("selects multiple lists", () => {
            const { lists } = listsReducer(
                oldState,
                new SelectMultipleLists([0, 2], true)
            );

            const expectedLists: List[] = [
                new List("A", "List", "bottom", [], true),
                new List("B", "List", "bottom"),
                new List("C", "List", "bottom", [], true),
            ];

            assertListsEqual(lists, expectedLists);
        });

        it("deselects multiple lists", () => {
            const oldLists: List[] = [
                new List("A", "List", "bottom", [], true),
                new List("B", "List", "bottom", [], true),
                new List("C", "List", "bottom"),
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
                new List("A", "List", "bottom"),
                new List("B", "List", "bottom"),
                new List("C", "List", "bottom"),
            ];

            assertListsEqual(lists, expectedLists);
        });

        describe("select lists where", () => {
            const lists: List[] = [
                new List("A", "List", "bottom"),
                new List("B", "Shopping", "bottom"),
                new List("C", "To-Do", "bottom"),
                new List("D", "Ordered To-Do", "bottom"),
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
                    new List("A", "List", "bottom", [], true),
                    new List("B", "Shopping", "bottom", []),
                    new List("C", "To-Do", "bottom", []),
                    new List("D", "Ordered To-Do", "bottom", []),
                ];
                assertListsEqual(lists, expectedLists);
            });

            it("selects all shopping lists", () => {
                const { lists } = listsReducer(
                    prevState,
                    new SelectListsWhere(listTypePredicateFactory("Shopping"))
                );
                const expectedLists: List[] = [
                    new List("A", "List", "bottom", []),
                    new List("B", "Shopping", "bottom", [], true),
                    new List("C", "To-Do", "bottom", []),
                    new List("D", "Ordered To-Do", "bottom", []),
                ];
                assertListsEqual(lists, expectedLists);
            });

            it("selects all to-do lists", () => {
                const { lists } = listsReducer(
                    prevState,
                    new SelectListsWhere(listTypePredicateFactory("To-Do"))
                );
                const expectedLists: List[] = [
                    new List("A", "List", "bottom", []),
                    new List("B", "Shopping", "bottom", []),
                    new List("C", "To-Do", "bottom", [], true),
                    new List("D", "Ordered To-Do", "bottom", []),
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
                    new List("A", "List", "bottom", []),
                    new List("B", "Shopping", "bottom", []),
                    new List("C", "To-Do", "bottom", []),
                    new List("D", "Ordered To-Do", "bottom", [], true),
                ];
                assertListsEqual(lists, expectedLists);
            });
        });
    });
});
