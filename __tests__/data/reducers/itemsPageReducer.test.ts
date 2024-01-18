import { Item, Section } from "../../../data/data";
import {
    AddItem,
    DeleteItems,
    ItemsPageState,
    ItemsPageStateAction,
    UpdateItem,
    itemsPageReducer,
} from "../../../data/reducers/itemsPageReducer";
import { ItemCRUD } from "../../../types";
import { assertItemsEqual } from "../../testUtils";

describe("items page reducer", () => {
    it("deletes an item after moving it to another list via update", () => {
        const oldState: ItemsPageState = {
            sections: [
                new Section(
                    "Section 1",
                    [new Item("Item 1.1", 1, false, true)],
                    true
                ),
            ],
            items: [new Item("Item 1.1", 1, false, true)],
            isItemModalVisible: true,
            currentItemIndex: 0,
            isDeleteAllItemsModalVisible: false,
        };

        const {
            sections,
            items: newItems,
            isDeleteAllItemsModalVisible,
            currentItemIndex,
            isItemModalVisible,
        } = itemsPageReducer(oldState, new DeleteItems());

        // Assert the number of sections does not change;
        expect(sections.length).toEqual(oldState.sections.length);

        // Assert all items have been deleted and all sections contain no items.
        expect(newItems.length).toEqual(0);
        for (const section of sections) {
            expect(section.items.length).toEqual(0);
        }

        // Assert the "delete all items" modal remains invisible
        expect(isDeleteAllItemsModalVisible).toEqual(false);

        // Assert the current item index has been reset
        expect(currentItemIndex).toEqual(-1);

        // Assert item's update modal is no longer visible
        expect(isItemModalVisible).toEqual(false);
    });

    it("deletes all items and sections", () => {
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
            items: [
                new Item("Item 1.1", 1, false),
                new Item("Item 2.1", 1, false),
                new Item("Item 2.2", 2, false),
            ],
            isItemModalVisible: false,
            currentItemIndex: -1,
            isDeleteAllItemsModalVisible: true,
        };

        const {
            sections,
            items: newItems,
            isDeleteAllItemsModalVisible,
            currentItemIndex,
            isItemModalVisible,
        } = itemsPageReducer(oldState, new DeleteItems());

        // Assert all sections except the primary one are deleted.
        expect(sections.length).toEqual(1);

        // Assert all items have been deleted and all sections contain no items.
        expect(newItems.length).toEqual(0);
        for (const section of sections) {
            expect(section.items.length).toEqual(0);
        }

        // Assert the "delete all items" modal remains invisible
        expect(isDeleteAllItemsModalVisible).toEqual(false);

        // Assert the current item index has been reset
        expect(currentItemIndex).toEqual(-1);

        // Assert item's update modal is no longer visible
        expect(isItemModalVisible).toEqual(false);
    });

    it("adds items to different sections", () => {
        const state0: ItemsPageState = {
            sections: [
                new Section("Section 1", [], true),
                new Section("Section 2", []),
            ],
            items: [],
            isItemModalVisible: false,
            currentItemIndex: -1,
            isDeleteAllItemsModalVisible: true,
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
        const { items: items1, sections: sections1 } = state1;

        expect(items1.length).toEqual(1);
        assertItemsEqual(sections1[0].items, [
            new Item("Section 1, Item 1", 1, false),
        ]);

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
        const { sections: sections2, items: items2 } = state2;

        expect(items2.length).toEqual(2);

        // First section
        assertItemsEqual(sections2[0].items, [
            new Item("Section 1, Item 1", 1, false),
        ]);

        // Second section
        assertItemsEqual(sections2[1].items, [
            new Item("Section 2, Item 1", 5, true),
        ]);

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
        const { sections: sections3, items: items3 } = state3;

        expect(items3.length).toEqual(3);

        // First section
        assertItemsEqual(sections3[0].items, [
            new Item("Section 1, Item 2", 3, true),
            new Item("Section 1, Item 1", 1, false),
        ]);

        // Second section
        assertItemsEqual(sections3[1].items, [
            new Item("Section 2, Item 1", 5, true),
        ]);
    });
});
