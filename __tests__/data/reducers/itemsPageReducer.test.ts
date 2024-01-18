import { Item, Section } from "../../../data/data";
import {
    AddItem,
    DeleteItems,
    ItemsPageState,
    SetItemModalVisible,
    itemsPageReducer,
} from "../../../data/reducers/itemsPageReducer";
import { ItemCRUD } from "../../../types";
import { assertItemsPageStateEqual } from "../../testUtils";

describe("items page reducer", () => {
    describe("delete items", () => {
        it("deletes all items and sections when none are selected", () => {
            const oldState: ItemsPageState = {
                sections: [
                    new Section(
                        "Section 1",
                        [new Item("Item 1.1", 1, false)],
                        true
                    ),
                    new Section("Section 2", [
                        new Item("Item 2.1", 1, false),
                        new Item("Item 2.2", 2, false),
                    ]),
                ],
                isItemModalVisible: false,
                isDeleteAllItemsModalVisible: true,
            };

            const newState = itemsPageReducer(oldState, new DeleteItems());

            const expectedItems: Item[] = [];
            const expectedSections: Section[] = [
                new Section("Section 1", expectedItems, true),
            ];

            const newExpectedState: ItemsPageState = {
                sections: expectedSections,
                isDeleteAllItemsModalVisible: false,
                isItemModalVisible: false,
            };
            assertItemsPageStateEqual(newState, newExpectedState);
        });

        describe("deletes selected items", () => {
            it("deletes selected items but not sections", () => {
                const oldState: ItemsPageState = {
                    sections: [
                        new Section(
                            "Default",
                            [
                                new Item("A", 1, false),
                                new Item("C", 1, false, true),
                            ],
                            true
                        ),
                        new Section("Other", [
                            new Item("D", 1, false, true),
                            new Item("B", 2, false),
                        ]),
                    ],
                    isItemModalVisible: false,
                    isDeleteAllItemsModalVisible: true,
                };

                const newState = itemsPageReducer(oldState, new DeleteItems());

                const expectedItems: Item[] = [
                    new Item("A", 1, false),
                    new Item("B", 2, false),
                ];
                const expectedSections: Section[] = [
                    new Section("Default", [new Item("A", 1, false)], true),
                    new Section("Other", [new Item("B", 2, false)]),
                ];

                const newExpectedState: ItemsPageState = {
                    sections: expectedSections,
                    isDeleteAllItemsModalVisible: false,
                    isItemModalVisible: false,
                };
                assertItemsPageStateEqual(newState, newExpectedState);
            });

            it("deletes selected items and sections with no remaining items", () => {
                const oldState: ItemsPageState = {
                    sections: [
                        new Section(
                            "Default",
                            [
                                new Item("A", 1, false),
                                new Item("C", 1, false, true),
                            ],
                            true
                        ),
                        new Section("Other", [
                            new Item("D", 1, false, true),
                            new Item("B", 2, false, true),
                        ]),
                    ],
                    isItemModalVisible: false,
                    isDeleteAllItemsModalVisible: true,
                };

                const newState = itemsPageReducer(oldState, new DeleteItems());

                const expectedItems: Item[] = [new Item("A", 1, false)];
                const expectedSections: Section[] = [
                    new Section("Default", expectedItems, true),
                ];

                const newExpectedState: ItemsPageState = {
                    sections: expectedSections,
                    isDeleteAllItemsModalVisible: false,
                    isItemModalVisible: false,
                };
                assertItemsPageStateEqual(newState, newExpectedState);
            });

            it("deletes all items when all items are selected. ", () => {
                const oldState: ItemsPageState = {
                    sections: [
                        new Section(
                            "Section 1",
                            [new Item("Item 1.1", 1, false, true)],
                            true
                        ),
                        new Section("Section 2", [
                            new Item("Item 2.1", 1, false, true),
                            new Item("Item 2.2", 2, false, true),
                        ]),
                    ],
                    isItemModalVisible: false,
                    isDeleteAllItemsModalVisible: true,
                };

                const newState = itemsPageReducer(oldState, new DeleteItems());

                const expectedItems: Item[] = [];
                const expectedSections: Section[] = [
                    new Section("Section 1", expectedItems, true),
                ];

                const newExpectedState: ItemsPageState = {
                    sections: expectedSections,
                    isDeleteAllItemsModalVisible: false,
                    isItemModalVisible: false,
                };
                assertItemsPageStateEqual(newState, newExpectedState);
            });
        });
    });

    it("open item modal to edit an item", () => {
        const item: Item = new Item("Item 1.1", 1, false, true);
        const oldState: ItemsPageState = {
            sections: [new Section("Section 1", [item], true)],
            isItemModalVisible: false,
            isDeleteAllItemsModalVisible: false,
        };

        const newState = itemsPageReducer(
            oldState,
            new SetItemModalVisible(true, item)
        );

        const expectedItems: Item[] = [new Item("Item 1.1", 1, false, true)];
        const expectedSections: Section[] = [
            new Section("Section 1", expectedItems, true),
        ];

        const newExpectedState: ItemsPageState = {
            sections: expectedSections,
            isDeleteAllItemsModalVisible: false,
            isItemModalVisible: true,
            itemBeingEdited: item,
        };
        assertItemsPageStateEqual(newState, newExpectedState);
    });

    it("adds items to different sections", () => {
        const state0: ItemsPageState = {
            sections: [
                new Section("Section 1", [], true),
                new Section("Section 2", []),
            ],
            isItemModalVisible: false,
            isDeleteAllItemsModalVisible: false,
        };

        /**
         * Add an item to the first section
         */
        const itemParams0: ItemCRUD = {
            name: "Section 1, Item 1",
            sectionIndex: 0,
            quantity: 1,
            isComplete: false,
            oldPosition: -1,
            newPosition: "bottom",
            type: "Item",
        };

        const state1 = itemsPageReducer(state0, new AddItem(itemParams0));

        const expectedSections1: Section[] = [
            new Section(
                "Section 1",
                [new Item("Section 1, Item 1", 1, false)],
                true
            ),
            new Section("Section 2", []),
        ];

        const newExpectedState1: ItemsPageState = {
            sections: expectedSections1,
            isDeleteAllItemsModalVisible: false,
            isItemModalVisible: false,
        };
        assertItemsPageStateEqual(state1, newExpectedState1);

        /**
         * Add an item to the second section
         */
        const itemParams1: ItemCRUD = {
            name: "Section 2, Item 1",
            sectionIndex: 1,
            quantity: 5,
            isComplete: true,
            oldPosition: -1,
            newPosition: "bottom",
            type: "Item",
        };

        const state2 = itemsPageReducer(state1, new AddItem(itemParams1));

        const expectedSections2: Section[] = [
            new Section(
                "Section 1",
                [new Item("Section 1, Item 1", 1, false)],
                true
            ),
            new Section("Section 2", [new Item("Section 2, Item 1", 5, true)]),
        ];

        const newExpectedState2: ItemsPageState = {
            sections: expectedSections2,
            isDeleteAllItemsModalVisible: false,
            isItemModalVisible: false,
        };
        assertItemsPageStateEqual(state2, newExpectedState2);

        /**
         * Add an item to the top of the first section
         */
        const itemParams2: ItemCRUD = {
            name: "Section 1, Item 2",
            sectionIndex: 0,
            quantity: 3,
            isComplete: true,
            oldPosition: -1,
            newPosition: "top",
            type: "Item",
        };

        const state3 = itemsPageReducer(state2, new AddItem(itemParams2));

        const expectedSections3: Section[] = [
            new Section(
                "Section 1",
                [
                    new Item("Section 1, Item 2", 3, true),
                    new Item("Section 1, Item 1", 1, false),
                ],
                true
            ),
            new Section("Section 2", [new Item("Section 2, Item 1", 5, true)]),
        ];

        const newExpectedState3: ItemsPageState = {
            sections: expectedSections3,
            isDeleteAllItemsModalVisible: false,
            isItemModalVisible: false,
        };
        assertItemsPageStateEqual(state3, newExpectedState3);
    });
});
