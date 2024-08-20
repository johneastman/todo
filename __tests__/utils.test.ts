import { Item, List } from "../data/data";
import { CollectionViewCell } from "../types";
import {
    cellsCountDisplay,
    getCellBeingEdited,
    getCellModalVisibleAndNextIndex,
    getNumberOfSelectedCells,
    insertAt,
    partitionLists,
    pluralize,
    removeAt,
    updateAt,
} from "../utils";
import listSelected, {
    assertListEqual,
    assertListsEqual,
    itemIncomplete,
    listDefault,
} from "./testUtils";

describe("utils", () => {
    describe("pluralize", () => {
        it("is 0", () =>
            expect(pluralize(0, "Item", "Items")).toEqual("Items"));
        it("is 1", () => expect(pluralize(1, "Item", "Items")).toEqual("Item"));
        it("is 2", () =>
            expect(pluralize(2, "Item", "Items")).toEqual("Items"));
    });

    describe("getListModalVisibleAndIndex", () => {
        describe("Adding a list", () => {
            const isAddingList: boolean = true;
            const currentIndex: number = -1;
            const numLists: number = 0;

            describe("Alternate Action", () => {
                const isAlternateAction: boolean = true;

                it("Adds a list", () => {
                    const [isModalVisible, nextIndex] =
                        getCellModalVisibleAndNextIndex(
                            currentIndex,
                            numLists,
                            isAddingList,
                            isAlternateAction
                        );

                    expect(isModalVisible).toEqual(true);
                    expect(nextIndex).toEqual(-1);
                });
            });

            describe("Primary Action (Not Alternate)", () => {
                const isAlternateAction: boolean = false;

                it("Adds a list", () => {
                    const [isModalVisible, nextIndex] =
                        getCellModalVisibleAndNextIndex(
                            currentIndex,
                            numLists,
                            isAddingList,
                            isAlternateAction
                        );

                    expect(isModalVisible).toEqual(false);
                    expect(nextIndex).toEqual(-1);
                });
            });
        });

        describe("Updating a list", () => {
            const isAddingList: boolean = false;
            const numLists: number = 10;

            describe("Alternate Action", () => {
                const isAlternateAction: boolean = true;

                it("Updates a list", () => {
                    const [isModalVisible, nextIndex] =
                        getCellModalVisibleAndNextIndex(
                            5,
                            numLists,
                            isAddingList,
                            isAlternateAction
                        );

                    expect(isModalVisible).toEqual(true);
                    expect(nextIndex).toEqual(6);
                });

                it("Updates the last list", () => {
                    const [isModalVisible, nextIndex] =
                        getCellModalVisibleAndNextIndex(
                            9,
                            numLists,
                            isAddingList,
                            isAlternateAction
                        );

                    expect(isModalVisible).toEqual(false);
                    expect(nextIndex).toEqual(-1);
                });
            });

            describe("Primary Action (Not Alternate)", () => {
                const isAlternateAction: boolean = false;

                it("Updates a list, no alternate action", () => {
                    const [isModalVisible, nextIndex] =
                        getCellModalVisibleAndNextIndex(
                            5,
                            numLists,
                            isAddingList,
                            isAlternateAction
                        );

                    expect(isModalVisible).toEqual(false);
                    expect(nextIndex).toEqual(-1);
                });
            });
        });
    });

    describe("partitionLists", () => {
        const lists: List[] = [
            listDefault("A", "List", "bottom"),
            listDefault("B", "List", "bottom"),
            listDefault("C", "List", "bottom"),
            listDefault("D", "List", "bottom"),
            listDefault("E", "List", "bottom"),
        ];
        it("when current list the first list", () => {
            const [currentList, otherLists] = partitionLists(0, lists);
            assertListEqual(currentList, listDefault("A", "List", "bottom"));
            assertListsEqual(otherLists, [
                listDefault("B", "List", "bottom"),
                listDefault("C", "List", "bottom"),
                listDefault("D", "List", "bottom"),
                listDefault("E", "List", "bottom"),
            ]);
        });

        it("when current list is the last list", () => {
            const [currentList, otherLists] = partitionLists(4, lists);
            assertListEqual(currentList, listDefault("E", "List", "bottom"));
            assertListsEqual(otherLists, [
                listDefault("A", "List", "bottom"),
                listDefault("B", "List", "bottom"),
                listDefault("C", "List", "bottom"),
                listDefault("D", "List", "bottom"),
            ]);
        });

        it("when current list is the middle list", () => {
            const [currentList, otherLists] = partitionLists(2, lists);
            assertListEqual(currentList, listDefault("C", "List", "bottom"));
            assertListsEqual(otherLists, [
                listDefault("A", "List", "bottom"),
                listDefault("B", "List", "bottom"),
                listDefault("D", "List", "bottom"),
                listDefault("E", "List", "bottom"),
            ]);
        });

        it("when index out of range", () => {
            expect(() => partitionLists(-1, lists)).toThrowError(
                "Index out of range: -1"
            );

            expect(() => partitionLists(lists.length, lists)).toThrowError(
                "Index out of range: 5"
            );
        });
    });

    describe("Cells helpers", () => {
        describe("getNumberOfSelectedCells", () => {
            describe("Lists", () => {
                it("returns 0", () => {
                    const cells: CollectionViewCell[] = [
                        listDefault("A", "List", "bottom"),
                        listDefault("B", "List", "bottom"),
                        listDefault("C", "List", "bottom"),
                    ];
                    expect(getNumberOfSelectedCells(cells)).toEqual(0);
                });

                it("returns 1", () => {
                    const cells: CollectionViewCell[] = [
                        listDefault("A", "List", "bottom"),
                        listSelected("B", "List", "bottom"),
                        listDefault("C", "List", "bottom"),
                    ];
                    expect(getNumberOfSelectedCells(cells)).toEqual(1);
                });

                it("returns 2", () => {
                    const cells: CollectionViewCell[] = [
                        listDefault("A", "List", "bottom"),
                        listSelected("B", "List", "bottom"),
                        listSelected("C", "List", "bottom"),
                    ];
                    expect(getNumberOfSelectedCells(cells)).toEqual(2);
                });
            });

            describe("Items", () => {
                it("returns 0", () => {
                    const cells: CollectionViewCell[] = [
                        itemIncomplete("A", "", 1),
                        itemIncomplete("B", "", 1),
                        itemIncomplete("C", "", 1),
                    ];
                    expect(getNumberOfSelectedCells(cells)).toEqual(0);
                });

                it("returns 1", () => {
                    const cells: CollectionViewCell[] = [
                        new Item("A", "", 1, {
                            isComplete: false,
                            isSelected: true,
                        }),
                        itemIncomplete("B", "", 1),
                        itemIncomplete("C", "", 1),
                    ];
                    expect(getNumberOfSelectedCells(cells)).toEqual(1);
                });

                it("returns 2", () => {
                    const cells: CollectionViewCell[] = [
                        new Item("A", "", 1, {
                            isComplete: false,
                            isSelected: true,
                        }),
                        itemIncomplete("B", "", 1),
                        new Item("C", "", 1, {
                            isComplete: false,
                            isSelected: true,
                        }),
                    ];
                    expect(getNumberOfSelectedCells(cells)).toEqual(2);
                });
            });
        });

        describe("cellsCountDisplay", () => {
            it("lists", () => {
                const listsLabel: string = cellsCountDisplay("List", 5);
                expect(listsLabel).toEqual("5 lists");
            });

            it("items", () => {
                const listsLabel: string = cellsCountDisplay("Item", 5);
                expect(listsLabel).toEqual("5 items");
            });
        });

        describe("getCellBeingEdited", () => {
            describe("when no cells are selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        listDefault("A", "List", "bottom"),
                        listDefault("B", "List", "bottom"),
                        listDefault("C", "List", "bottom"),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(-1);
                });

                it("items", () => {
                    const items: Item[] = [
                        itemIncomplete("A", "", 1),
                        itemIncomplete("B", "", 1),
                        itemIncomplete("C", "", 1),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(-1);
                });
            });

            describe("when a cell is selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        listDefault("A", "List", "bottom"),
                        listDefault("B", "List", "bottom"),
                        listSelected("C", "List", "bottom"),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(2);
                });

                it("items", () => {
                    const items: Item[] = [
                        itemIncomplete("A", "", 1),
                        itemIncomplete("B", "", 1),
                        new Item("C", "", 1, {
                            isComplete: false,
                            isSelected: true,
                        }),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(2);
                });
            });

            describe("returns the first cell when multiple are selected", () => {
                it("lists", () => {
                    const lists: List[] = [
                        listSelected("A", "List", "bottom"),
                        listDefault("B", "List", "bottom"),
                        listSelected("C", "List", "bottom", []),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(lists);
                    expect(selectedListIndex).toEqual(0);
                });

                it("items", () => {
                    const items: Item[] = [
                        new Item("A", "", 1, {
                            isComplete: false,
                            isSelected: true,
                        }),
                        itemIncomplete("B", "", 1),
                        new Item("C", "", 1, {
                            isComplete: false,
                            isSelected: true,
                        }),
                    ];

                    const selectedListIndex: number = getCellBeingEdited(items);
                    expect(selectedListIndex).toEqual(0);
                });
            });
        });
    });

    describe("generic list helpers", () => {
        const letters: string[] = ["A", "B", "C", "D", "E"];

        describe("insertAt", () => {
            it("adds item to beginning", () => {
                const newLetters: string[] = insertAt(0, "F", letters);
                expect(newLetters).toEqual(["F", "A", "B", "C", "D", "E"]);
            });

            it("adds item at end", () => {
                const newLetters: string[] = insertAt(
                    letters.length,
                    "F",
                    letters
                );
                expect(newLetters).toEqual(["A", "B", "C", "D", "E", "F"]);
            });

            it("adds item in the middle end", () => {
                const newLetters: string[] = insertAt(2, "F", letters);
                expect(newLetters).toEqual(["A", "B", "F", "C", "D", "E"]);
            });
        });

        describe("removeAt", () => {
            it("removes first item", () => {
                const newLetters: string[] = removeAt(0, letters);
                expect(newLetters).toEqual(["B", "C", "D", "E"]);
            });

            it("removes last item", () => {
                const newLetters: string[] = removeAt(
                    letters.length - 1,
                    letters
                );
                expect(newLetters).toEqual(["A", "B", "C", "D"]);
            });

            it("removes item in middle", () => {
                const newLetters: string[] = removeAt(3, letters);
                expect(newLetters).toEqual(["A", "B", "C", "E"]);
            });
        });

        describe("updateAt", () => {
            describe("Errors", () => {
                it("when current index is greater than or equal to length", () => {
                    expect(() => updateAt("F", letters, 5)).toThrow(
                        "Current index out of range"
                    );
                });

                it("when current index is less than 0", () => {
                    expect(() => updateAt("F", letters, -1)).toThrow(
                        "Current index out of range"
                    );
                });

                it("when new index is greater than or equal to length", () => {
                    expect(() => updateAt("F", letters, 0, 5)).toThrow(
                        "New index out of range"
                    );
                });

                it("when new index is less than 0", () => {
                    expect(() => updateAt("F", letters, 0, -1)).toThrow(
                        "New index out of range"
                    );
                });
            });

            it("updates item at beginning", () => {
                const newLetters: string[] = updateAt("F", letters, 0);
                expect(newLetters).toEqual(["F", "B", "C", "D", "E"]);
            });

            it("updates item at end", () => {
                const newLetters: string[] = updateAt(
                    "F",
                    letters,
                    letters.length - 1
                );
                expect(newLetters).toEqual(["A", "B", "C", "D", "F"]);
            });

            it("updates item in middle", () => {
                const newLetters: string[] = updateAt("F", letters, 2);
                expect(newLetters).toEqual(["A", "B", "F", "D", "E"]);
            });

            it("moves item", () => {
                const newLetters: string[] = updateAt("B", letters, 1, 3);
                expect(newLetters).toEqual(["A", "C", "D", "B", "E"]);
            });

            it("replaces and moves item", () => {
                const newLetters: string[] = updateAt("F", letters, 1, 3);
                expect(newLetters).toEqual(["A", "C", "D", "F", "E"]);
            });
        });
    });
});
