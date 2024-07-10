import { defaultAppData } from "../../contexts/app.context";
import { List } from "../../data/data";
import {
    AddList,
    AppData,
    DeleteLists,
    SelectAllLists,
    SelectList,
    UpdateList,
    appReducer,
} from "../../data/reducers/app.reducer";
import { assertListsEqual } from "../testUtils";

describe("Lists", () => {
    describe("Add Lists", () => {
        const list: List = new List("My List", "Shopping", "bottom");

        it("adds a new list", () => {
            const newState: AppData = appReducer(
                defaultAppData,
                new AddList({ oldPos: -1, newPos: 1, list: list })
            );

            const newLists: List[] = [list];

            const { lists } = newState;

            assertListsEqual(lists, newLists);
        });

        it("adds a new list to the beginning", () => {
            const lists: List[] = [list];

            const newList: List = new List("My Second List", "List", "top");

            const newState: AppData = appReducer(
                { ...defaultAppData, lists: lists },
                new AddList({ oldPos: -1, newPos: 0, list: newList })
            );

            const { lists: actualLists } = newState;
            const expectedLists: List[] = [newList, list];
            assertListsEqual(actualLists, expectedLists);
        });
    });

    describe("Update Lists", () => {
        const oldState: AppData = {
            ...defaultAppData,
            lists: [
                new List("My List", "Shopping", "bottom"),
                new List("My Second List", "Ordered To-Do", "top"),
            ],
        };

        it("updates a list", () => {
            const list: List = new List("My List [UPDATED]", "List", "bottom");

            const newState: AppData = appReducer(
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
            const oldState: AppData = {
                ...defaultAppData,
                lists: [
                    new List("List 0", "List", "bottom", []),
                    new List("List 1", "List", "top", []),
                    new List("List 2", "Shopping", "bottom", []),
                ],
            };

            const { lists }: AppData = appReducer(oldState, new DeleteLists());
            const expectedLists: List[] = [
                new List("List 0", "List", "bottom", []),
                new List("List 1", "List", "top", []),
                new List("List 2", "Shopping", "bottom", []),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("deletes all when all are selected", () => {
            const oldState: AppData = {
                ...defaultAppData,
                lists: [
                    new List("List 0", "List", "bottom", [], true),
                    new List("List 1", "List", "top", [], true),
                    new List("List 2", "Shopping", "bottom", [], true),
                ],
            };

            const { lists }: AppData = appReducer(oldState, new DeleteLists());
            expect(lists.length).toEqual(0);
        });

        it("deletes selected", () => {
            const oldState: AppData = {
                ...defaultAppData,
                lists: [
                    new List("List 0", "List", "bottom", [], true),
                    new List("List 1", "List", "top", []),
                    new List("List 2", "Shopping", "bottom", [], true),
                ],
            };

            const { lists }: AppData = appReducer(oldState, new DeleteLists());
            const expectedLists: List[] = [
                new List("List 1", "List", "top", []),
            ];
            assertListsEqual(lists, expectedLists);
        });
    });

    describe("Select Lists", () => {
        const lists: List[] = [
            new List("A", "List", "bottom"),
            new List("B", "List", "bottom"),
            new List("C", "List", "bottom"),
        ];

        const oldState: AppData = {
            ...defaultAppData,
            lists: lists,
        };
        it("selects all", () => {
            const { lists } = appReducer(oldState, new SelectAllLists(true));
            const expectedLists: List[] = [
                new List("A", "List", "bottom", [], true),
                new List("B", "List", "bottom", [], true),
                new List("C", "List", "bottom", [], true),
            ];
            assertListsEqual(lists, expectedLists);
        });

        it("selects a single list", () => {
            const { lists } = appReducer(oldState, new SelectList(1, true));
            const expectedLists: List[] = [
                new List("A", "List", "bottom"),
                new List("B", "List", "bottom", [], true),
                new List("C", "List", "bottom"),
            ];
            assertListsEqual(lists, expectedLists);
        });
    });
});
