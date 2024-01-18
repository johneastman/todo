import { Item, Section } from "../../data/data";
import { assertSectionEqual } from "../testUtils";

describe("data", () => {
    describe("Section", () => {
        const items: Item[] = [
            new Item("First", 1, false),
            new Item("Second", 3, false),
            new Item("Third", 56, true),
        ];
        const section: Section = new Section("My Section", items, true);

        it("updateItem", () => {
            const newItem: Item = new Item("Fourth", 2, true, true);
            const actual: Section = section.updateItem(1, newItem);
            const expected: Section = new Section(
                "My Section",
                [
                    new Item("First", 1, false),
                    new Item("Fourth", 2, true, true),
                    new Item("Third", 56, true),
                ],
                true
            );
            assertSectionEqual(actual, expected);
        });

        it("updateItems", () => {
            const newItems: Item[] = [new Item("Fifth", 100, false, true)];
            const actual: Section = section.updateItems(newItems);
            const expected: Section = new Section("My Section", newItems, true);
            assertSectionEqual(actual, expected);
        });

        it("selectItem", () => {
            const actual: Section = section.selectItem(1, true);
            const expected: Section = new Section(
                "My Section",
                [
                    new Item("First", 1, false),
                    new Item("Second", 3, false, true),
                    new Item("Third", 56, true),
                ],
                true
            );
            assertSectionEqual(actual, expected);
        });

        describe("completeItem", () => {
            it("marks an item as complete", () => {
                const actual: Section = section.completeItem(1);
                const expected: Section = new Section(
                    "My Section",
                    [
                        new Item("First", 1, false),
                        new Item("Second", 3, true),
                        new Item("Third", 56, true),
                    ],
                    true
                );
                assertSectionEqual(actual, expected);
            });

            it("marks an item as incomplete", () => {
                const actual: Section = section.completeItem(2);
                const expected: Section = new Section(
                    "My Section",
                    [
                        new Item("First", 1, false),
                        new Item("Second", 3, false),
                        new Item("Third", 56, false),
                    ],
                    true
                );
                assertSectionEqual(actual, expected);
            });
        });

        it("selectAllItems", () => {
            const actual: Section = section.selectAllItems(true);
            const expected: Section = new Section(
                "My Section",
                [
                    new Item("First", 1, false, true),
                    new Item("Second", 3, false, true),
                    new Item("Third", 56, true, true),
                ],
                true
            );
            assertSectionEqual(actual, expected);
        });

        describe("deleteItems", () => {
            it("deletes all when none are selected", () => {
                const actual: Section = section.deleteItems();
                const expected: Section = new Section("My Section", [], true);
                assertSectionEqual(actual, expected);
            });

            it("deletes selected items", () => {
                const items: Item[] = [
                    new Item("First", 1, false),
                    new Item("Second", 3, false, true),
                    new Item("Third", 56, true),
                ];
                const section: Section = new Section("My Section", items, true);

                const actual: Section = section.deleteItems();
                const expected: Section = new Section(
                    "My Section",
                    [new Item("First", 1, false), new Item("Third", 56, true)],
                    true
                );
                assertSectionEqual(actual, expected);
            });

            it("deletes all when all are selected", () => {
                const items: Item[] = [
                    new Item("First", 1, false, true),
                    new Item("Second", 3, false, true),
                    new Item("Third", 56, true, true),
                ];
                const section: Section = new Section("My Section", items, true);

                const actual: Section = section.deleteItems();
                const expected: Section = new Section("My Section", [], true);
                assertSectionEqual(actual, expected);
            });
        });

        describe("setAllIsComplete", () => {
            it("marks all as complete", () => {
                const actual: Section = section.setAllIsComplete(true);
                const expected: Section = new Section(
                    "My Section",
                    [
                        new Item("First", 1, true),
                        new Item("Second", 3, true),
                        new Item("Third", 56, true),
                    ],
                    true
                );
                assertSectionEqual(actual, expected);
            });

            it("marks all as incomplete", () => {
                const actual: Section = section.setAllIsComplete(false);
                const expected: Section = new Section(
                    "My Section",
                    [
                        new Item("First", 1, false),
                        new Item("Second", 3, false),
                        new Item("Third", 56, false),
                    ],
                    true
                );
                assertSectionEqual(actual, expected);
            });
        });
    });
});
