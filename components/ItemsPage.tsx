import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Button, Pressable, View, Text } from "react-native";

import ItemModal from "./ItemModal";
import { Item, List, MenuOption, Section } from "../data/data";
import { /*getItems getLists*/ saveItems } from "../data/utils";
import {
    RED,
    areCellsSelected,
    areTestsRunning,
    getItemBeingEdited,
    getNumItemsIncomplete,
    getNumItemsTotal,
    getSelectedItems,
    isAllSelected,
    pluralize,
    selectedListCellsWording,
    updateCollection,
} from "../utils";
import CustomList from "./CustomList";
import {
    ItemPageNavigationScreenProp,
    SettingsContext,
    ItemCRUD,
} from "../types";
import { useIsFocused } from "@react-navigation/core";
import ItemCellView from "./ItemCellView";
import ListViewHeader from "./ListViewHeader";
import ListPageView from "./ListPageView";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DeleteAllModal from "./DeleteAllModal";
import MoveItemsModal from "./MoveItemsModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationScreenProp): JSX.Element {
    // Props
    const { list: currentList } = route.params;
    const settingsContext = useContext(SettingsContext);

    const [list, setList] = useState<List>(currentList);
    // const [items, setItems] = useState<Item[]>([]);

    /**
     * Lists need to be retrieved in this component and passed to MoveItemsModal because
     * they are used to enable/disable the menu option for moving/copying items when all
     * lists are empty.
     */
    const [lists, setLists] = useState<List[]>([]);

    const [isItemModalVisible, setIsItemModalVisible] =
        useState<boolean>(false);
    const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
    const [isDeleteAllItemsModalVisible, setIsDeleteAllItemsModalVisible] =
        useState<boolean>(false);
    const [isCopyItemsVisible, setIsCopyItemsVisible] =
        useState<boolean>(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        // // Get list items
        // setItems(currentList.items);
        // // Get lists for moving/copying items
        // (async () => setLists(await getLists()))();
    }, [isFocused]);

    // useEffect(() => {
    //     // const saveData = async () => {
    //     //     await saveItems(currentList.id, items);
    //     //     /**
    //     //      * Because items are now part of list objects, lists need to be updated
    //     //      * when items change to reflect the current state of the app. For example,
    //     //      * we need to know the current number of items in each list to
    //     //      * enable/disable the button for moving/copying items.
    //     //      */
    //     //     setLists(await getLists());
    //     // };
    //     // saveData();
    // }, [items]);

    const setIsCompleteForAll = (isComplete: boolean): void => {
        // let newItems: Item[] = items.map((item) => {
        //     if (areCellsSelected(items)) {
        //         // Only apply the changes to items that are currently selected.
        //         const newIsComplete: boolean = item.isSelected
        //             ? isComplete
        //             : item.isComplete;
        //         return new Item(
        //             item.name,
        //             item.quantity,
        //             item.itemType,
        //             newIsComplete
        //         );
        //     }
        //     // When no items are selected, apply changes to all items.
        //     return new Item(
        //         item.name,
        //         item.quantity,
        //         item.itemType,
        //         isComplete
        //     );
        // });
        // setItems(newItems);
    };

    const deleteAllItems = () => {
        // // When items are selected, filter out items NOT being edited because these are the items we want to keep.
        // const newItems: Item[] = areCellsSelected(items)
        //     ? items.filter((item) => !item.isSelected)
        //     : [];
        // setItems(newItems);
        // setIsDeleteAllItemsModalVisible(false);
    };

    const openUpdateItemModal = (index: number): void => {
        setIsItemModalVisible(true);
        setCurrentItemIndex(index);
    };

    const openDeleteAllItemsModal = (): void => {
        setIsDeleteAllItemsModalVisible(true);
    };

    const closeUpdateItemModal = (): void => {
        if (isItemModalVisible) {
            // Ensure selected items are only cleared when an update operation that requires the item modal happens.
            setIsItemModalVisible(false);
        }
        setCurrentItemIndex(-1);
    };

    const addItem = (addItemParams: ItemCRUD): void => {
        const { newPos, item } = addItemParams;

        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.name.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        // setItems(newPos === "top" ? [item].concat(items) : items.concat(item));

        // Close add-items modal. For some reason, calling "closeUpdateItemModal", which originally had
        // logic to de-select every item, resulted in new items not being added.
        setCurrentItemIndex(-1);
        setIsItemModalVisible(false);
    };

    const updateItem = async (updateItemParams: ItemCRUD): Promise<void> => {
        // const { oldPos, newPos, listId, item } = updateItemParams;

        // // If the user doesn't enter a name, "itemName" will be an empty string
        // if (item.name.trim().length <= 0) {
        //     setIsItemModalVisible(false);
        //     return;
        // }

        // if (listId === currentList.id) {
        //     // Updating item in current list
        //     let newItems: Item[] = updateCollection(
        //         item,
        //         items.concat(),
        //         oldPos,
        //         newPos
        //     );
        //     setItems(newItems);
        // } else {
        //     // Update and move item to selected list
        //     let newItems: Item[] = (await getItems(listId)).concat(item);
        //     await saveItems(listId, newItems);
        //     deleteItem(oldPos);
        // }

        closeUpdateItemModal();
    };

    const deleteItem = (index: number): void => {
        // let newItems: Item[] = items.concat();
        // newItems.splice(index, 1);
        // setItems(newItems);
    };

    /**
     * If the user invokes the alternate action while adding a new list, the modal
     * will reset to add another list.
     *
     * If the user invokes the alternate action while editing a list, the modal will
     * reset to the next list, allowing the user to continually update subsequent
     * lists. If the user is on the last list and clicks "next", the modal will
     * dismiss itself.
     */
    const altAction = (): void => {
        // if (currentItemIndex === -1) {
        //     setIsItemModalVisible(true);
        // } else {
        //     if (currentItemIndex + 1 < items.length) {
        //         setIsItemModalVisible(true);
        //     }
        //     setCurrentItemIndex(currentItemIndex + 1);
        // }
    };

    const updateListItem = (
        sectionIndex: number,
        itemIndex: number,
        item: Item
    ) => {
        const newList: List = list.updateItem(sectionIndex, itemIndex, item);
        setList(newList);
    };

    // const setSelectedItems = (
    //     sectionIndex: number,
    //     itemIndex: number,
    //     isSelected: boolean
    // ) => {
    //     // const newList: List = new List(
    //     //     list.name,
    //     //     list.sections.map((section, sectIdx) =>
    //     //         sectIdx === sectionIndex
    //     //             ? section.selectItem(itemIndex, isSelected)
    //     //             : section
    //     //     )
    //     // );
    //     // setList(newList);
    // };

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        // {
        //     text: `Delete ${selectedListCellsWording(items)} Items`,
        //     onPress: openDeleteAllItemsModal,
        //     disabled: items.length === 0,
        //     color: RED,
        //     testId: "items-page-delete-all-items",
        // },
        // {
        //     text: `Set ${selectedListCellsWording(items)} to Complete`,
        //     onPress: () => setIsCompleteForAll(true),
        //     testId: "items-page-set-all-to-complete",
        // },
        // {
        //     text: `Set ${selectedListCellsWording(items)} to Incomplete`,
        //     onPress: () => setIsCompleteForAll(false),
        //     testId: "items-page-set-all-to-incomplete",
        // },
        // {
        //     text: `Move/Copy ${
        //         areCellsSelected(items) ? "Selected " : ""
        //     }Items From`,
        //     onPress: () => setIsCopyItemsVisible(true),
        //     testId: "items-page-copy-items-from",
        //     disabled: lists.every((l) => l.items.length === 0),
        // },
    ];

    // Add an option for a back button if the tests are running
    if (areTestsRunning()) {
        menuOptionsData.push({
            text: "Back",
            testId: "items-page-back-button",
            onPress: () => navigation.goBack(),
        });
    }

    const navigationMenuOptions: Partial<NativeStackNavigationOptions> = {
        title: currentList.name,
    };

    const listViewHeaderRight: JSX.Element = (
        <>
            {/* {getSelectedItems(items).length === 1 ? (
                <Button
                    title="Edit Item"
                    onPress={() => {
                        const itemIndex: number = getItemBeingEdited(items);
                        openUpdateItemModal(itemIndex);
                    }}
                />
            ) : null}

            <Button
                title="Add Item"
                onPress={() => {
                    setIsItemModalVisible(true);
                    setCurrentItemIndex(-1);
                }}
            /> */}
        </>
    );

    // Header text
    // const selectecCount: number = getNumItemsIncomplete(
    //     currentList.listType,
    //     items
    // );
    // const totalItems: number = getNumItemsTotal(currentList.listType, items);

    // let headerString: string = `${selectecCount} / ${totalItems} ${pluralize(
    //     selectecCount,
    //     "Item",
    //     "Items"
    // )}`;

    /* If developer mode is enabled, also display the number of items in the "items" list (length of
     * list, not sum of quantities).
     */
    // if (settingsContext.isDeveloperModeEnabled) {
    //     headerString += ` (${items.length} Cells)`;
    // }

    const updateListItems = (sectionItems: Item[], sectionIndex: number) => {
        const newList: List = new List(
            list.name,
            list.sections.map((section, currentSectionIndex) =>
                currentSectionIndex === sectionIndex
                    ? new Section(section.name, sectionItems)
                    : section
            )
        );
        setList(newList);
    };

    // const renderItem = (params: RenderItemParams<Item>): ReactNode => {
    //     const { item, getIndex, drag, isActive } = params;

    //     return (

    //     );
    // };

    return (
        <ListPageView
            menuOptions={menuOptionsData}
            navigationMenuOptions={navigationMenuOptions}
            items={[]} // items
            itemsType="Item"
        >
            <View style={{ flex: 1 }}>
                <ItemModal
                    list={currentList}
                    item={[][currentItemIndex]} // items
                    index={currentItemIndex}
                    isVisible={isItemModalVisible}
                    title={
                        currentItemIndex === -1
                            ? "Add a New Item"
                            : "Update Item"
                    }
                    listType={"Shopping"} // currentList.listType
                    positiveActionText={
                        currentItemIndex === -1 ? "Add" : "Update"
                    }
                    positiveAction={
                        currentItemIndex === -1 ? addItem : updateItem
                    }
                    negativeActionText="Cancel"
                    negativeAction={closeUpdateItemModal}
                    altActionText="Next"
                    altAction={altAction}
                />

                <DeleteAllModal
                    isVisible={isDeleteAllItemsModalVisible}
                    items={[]} // items
                    positiveAction={deleteAllItems}
                    negativeAction={() =>
                        setIsDeleteAllItemsModalVisible(false)
                    }
                />

                <MoveItemsModal
                    currentList={currentList}
                    allLists={lists}
                    isVisible={isCopyItemsVisible}
                    setIsVisible={setIsCopyItemsVisible}
                    setItems={(items: Item[]) => {}}
                />

                <ListViewHeader
                    title={currentList.name}
                    isAllSelected={isAllSelected([])} // items
                    onChecked={
                        (checked: boolean) => {}
                        // setItems(items.map((i) => i.setIsSelected(checked)))
                    }
                    right={listViewHeaderRight}
                />

                <GestureHandlerRootView style={{ flex: 1 }}>
                    <NestableScrollContainer>
                        {list.sections.map((section, sectionIndex) => (
                            <View key={`${section.name}-${sectionIndex}`}>
                                <Text style={{ fontSize: 30 }}>
                                    {section.name}
                                </Text>
                                <NestableDraggableFlatList
                                    data={section.items}
                                    keyExtractor={function (
                                        item: Item,
                                        index: number
                                    ): string {
                                        return `${item.name}-${index}`;
                                    }}
                                    renderItem={(params) => (
                                        <ItemCellView
                                            list={currentList}
                                            sectionIndex={sectionIndex}
                                            updateItem={updateListItem}
                                            openAddItemModal={
                                                openUpdateItemModal
                                            }
                                            renderParams={params}
                                        />
                                    )}
                                    onDragEnd={({ data }) =>
                                        updateListItems(data, sectionIndex)
                                    }
                                />
                            </View>
                        ))}
                    </NestableScrollContainer>
                </GestureHandlerRootView>
                {/* <CustomList
                    items={items}
                    renderItem={(params) => (
                        <ItemCellView
                            renderParams={params}
                            onPress={setItemCompleteStatus}
                            list={currentList}
                            updateItems={setSelectedItems}
                            openAddItemModal={openUpdateItemModal}
                        />
                    )}
                    drag={({ data }) => {
                        setItems(data);
                    }}
                /> */}
            </View>
        </ListPageView>
    );
}
