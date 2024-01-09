import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Button, View, Text } from "react-native";

import ItemModal from "./ItemModal";
import { Item, List, MenuOption, Section } from "../data/data";
import { getItems, getLists, saveItems, saveList } from "../data/utils";
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
    removeItemAtIndex,
    selectedListCellsWording,
    updateCollection,
} from "../utils";
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
} from "react-native-draggable-flatlist";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationScreenProp): JSX.Element {
    // Props
    const { list: currentList } = route.params;
    const settingsContext = useContext(SettingsContext);

    const [list, setList] = useState<List>(currentList);
    const [items, setItems] = useState<Item[]>([]);

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
        // Set list and items state variables
        setList(currentList);
        setItems(currentList.items());
        // // Get lists for moving/copying items
        (async () => setLists(await getLists()))();
    }, [isFocused]);

    useEffect(() => setItems(list.items()), [list]);

    useEffect(() => {
        const saveData = async () => {
            await saveList(list);
            /**
             * Because items are now part of list objects, lists need to be updated
             * when items change to reflect the current state of the app. For example,
             * we need to know the current number of items in each list to
             * enable/disable the button for moving/copying items.
             */
            setLists(await getLists());
        };
        saveData();
    }, [list]);

    const setIsCompleteForAll = (isComplete: boolean): void => {
        const newList: List = list.setAllIsComplete(isComplete);
        setList(newList);
    };

    const deleteAllItems = () => {
        const newList: List = list.deleteItems();
        setList(newList);
        setIsDeleteAllItemsModalVisible(false);
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

        // TODO: for now, add to first section, but later we'll need to determine what section the item
        // should be added to.
        const sectionIndex: number = 0;
        const sectionItems: Item[] = list.sectionItems(sectionIndex);

        updateListItems(
            newPos === "top"
                ? [item].concat(sectionItems)
                : sectionItems.concat(item),
            sectionIndex
        );

        // Close add-items modal. For some reason, calling "closeUpdateItemModal", which originally had
        // logic to de-select every item, resulted in new items not being added.
        setCurrentItemIndex(-1);
        setIsItemModalVisible(false);
    };

    const updateItem = async (updateItemParams: ItemCRUD): Promise<void> => {
        const { oldPos, newPos, listId, item } = updateItemParams;

        // If the user doesn't enter a name, "itemName" will be an empty string
        if (item.name.trim().length <= 0) {
            setIsItemModalVisible(false);
            return;
        }

        // TODO: handle multiple sections
        const sectionIndex: number = 0;
        const sectionItems: Item[] = list.sectionItems(sectionIndex);

        if (listId === currentList.id) {
            // Updating item in current list
            let newItems: Item[] = updateCollection(
                item,
                sectionItems,
                oldPos,
                newPos
            );
            updateListItems(newItems, sectionIndex);
        } else {
            // Update and move item to selected list
            let newItems: Item[] = (await getItems(listId)).concat(item);

            // TODO:
            await saveItems(listId, sectionIndex, newItems);

            // Remove item from old position list
            const itemsWithOldRemoved: Item[] = removeItemAtIndex(
                newItems,
                oldPos
            );
            updateListItems(itemsWithOldRemoved, sectionIndex);
        }

        closeUpdateItemModal();
    };

    /**
     * TODO: will need to handle moving through multiple sections. The current system
     * won't work because each sublist starts indexing at zero.
     *
     * If the user invokes the alternate action while adding a new list, the modal
     * will reset to add another list.
     *
     * If the user invokes the alternate action while editing a list, the modal will
     * reset to the next list, allowing the user to continually update subsequent
     * lists. If the user is on the last list and clicks "next", the modal will
     * dismiss itself.
     */
    const altAction = (): void => {
        if (currentItemIndex === -1) {
            setIsItemModalVisible(true);
        } else {
            if (currentItemIndex + 1 < items.length) {
                setIsItemModalVisible(true);
            }
            setCurrentItemIndex(currentItemIndex + 1);
        }
    };

    const updateListItem = (
        sectionIndex: number,
        itemIndex: number,
        item: Item
    ) => {
        const newList: List = list.updateItem(sectionIndex, itemIndex, item);
        setList(newList);
    };

    const headerText = (): string => {
        const numItemsIncomplete: number = getNumItemsIncomplete(
            currentList.listType,
            items
        );

        const totalItems: number = getNumItemsTotal(
            currentList.listType,
            items
        );

        const label: string = pluralize(numItemsIncomplete, "Item", "Items");

        return `${numItemsIncomplete} / ${totalItems} ${label}`.concat(
            settingsContext.isDeveloperModeEnabled
                ? ` (${items.length} Cells)`
                : ""
        );
    };

    const updateListItems = (sectionItems: Item[], sectionIndex: number) => {
        const newSections: Section[] = list.sections.map(
            (section, currentSectionIndex) =>
                currentSectionIndex === sectionIndex
                    ? new Section(section.name, sectionItems)
                    : section
        );

        // TODO: move functionality into List object
        const newList: List = new List(
            list.id,
            list.name,
            list.listType,
            list.defaultNewItemPosition,
            newSections,
            list.isSelected
        );
        setList(newList);
    };

    const renderItem = (
        params: RenderItemParams<Item>,
        sectionIndex: number
    ): ReactNode => {
        return (
            <ItemCellView
                list={currentList}
                sectionIndex={sectionIndex}
                updateItem={updateListItem}
                openAddItemModal={openUpdateItemModal}
                renderParams={params}
            />
        );
    };

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: `Delete ${selectedListCellsWording(items)} Items`,
            onPress: openDeleteAllItemsModal,
            disabled: items.length === 0,
            color: RED,
            testId: "items-page-delete-all-items",
        },
        {
            text: `Set ${selectedListCellsWording(items)} to Complete`,
            onPress: () => setIsCompleteForAll(true),
            testId: "items-page-set-all-to-complete",
        },
        {
            text: `Set ${selectedListCellsWording(items)} to Incomplete`,
            onPress: () => setIsCompleteForAll(false),
            testId: "items-page-set-all-to-incomplete",
        },
        {
            text: `Move/Copy ${
                areCellsSelected(items) ? "Selected " : ""
            }Items From`,
            onPress: () => setIsCopyItemsVisible(true),
            testId: "items-page-copy-items-from",
            disabled: lists.every((l) => l.items().length === 0),
        },
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
            {getSelectedItems(items).length === 1 && (
                <Button
                    title="Edit Item"
                    onPress={() => {
                        const itemIndex: number = getItemBeingEdited(items);
                        openUpdateItemModal(itemIndex);
                    }}
                />
            )}

            <Button
                title="Add Item"
                onPress={() => {
                    setIsItemModalVisible(true);
                    setCurrentItemIndex(-1);
                }}
            />
        </>
    );

    return (
        <ListPageView
            menuOptions={menuOptionsData}
            navigationMenuOptions={navigationMenuOptions}
            items={items}
            itemsType="Item"
        >
            <View style={{ flex: 1 }}>
                <ItemModal
                    list={currentList}
                    item={items[currentItemIndex]}
                    index={currentItemIndex}
                    isVisible={isItemModalVisible}
                    title={
                        currentItemIndex === -1
                            ? "Add a New Item"
                            : "Update Item"
                    }
                    listType={list.listType}
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
                    items={items} // items
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
                    setList={setList} // TODO: when items are updated, the list will need to be updated
                />

                <ListViewHeader
                    title={headerText()}
                    isAllSelected={isAllSelected(items)} // items
                    onChecked={(checked: boolean) =>
                        setList(list.selectAllItems(checked))
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
                                    renderItem={(params) =>
                                        renderItem(params, sectionIndex)
                                    }
                                    onDragEnd={({ data }) =>
                                        updateListItems(data, sectionIndex)
                                    }
                                />
                            </View>
                        ))}
                    </NestableScrollContainer>
                </GestureHandlerRootView>
            </View>
        </ListPageView>
    );
}
