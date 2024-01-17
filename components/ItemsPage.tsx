import React, {
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { Button, View, Text } from "react-native";

import ItemModal from "./ItemModal";
import { Item, MenuOption } from "../data/data";
import { addItemToList, saveList } from "../data/utils";
import {
    RED,
    areTestsRunning,
    displayBoolean,
    getNumItemsIncomplete,
    getNumItemsTotal,
    isAllSelected,
    pluralize,
    selectedListCellsWording,
} from "../utils";
import { ItemPageNavigationScreenProp, ItemCRUD } from "../types";
import ItemCellView from "./ItemCellView";
import CollectionViewHeader from "./CollectionViewHeader";
import CollectionPageView from "./CollectionPageView";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import DeleteAllModal from "./DeleteAllModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { SettingsContext } from "../data/reducers/settingsReducer";
import {
    AddItem,
    AltAction,
    DeleteItems,
    ReplaceItems,
    SelectAll,
    SetAllIsComplete,
    SetDeleteAllItemsModalVisible,
    SetItemModalVisible,
    UpdateItem,
    itemsPageReducer,
} from "../data/reducers/itemsPageReducer";

export default function ItemsPage({
    route,
    navigation,
}: ItemPageNavigationScreenProp): JSX.Element {
    // Props
    const { list: currentList } = route.params;
    const settingsContext = useContext(SettingsContext);
    const {
        settings: { isDeveloperModeEnabled },
    } = settingsContext;

    const [state, itemsDispatch] = useReducer(itemsPageReducer, {
        sections: currentList.sections,
        items: currentList.sections.flatMap((section) => section.items),
        isItemModalVisible: false,
        currentItemIndex: -1,
        isDeleteAllItemsModalVisible: false,
    });
    const {
        sections,
        items,
        isItemModalVisible,
        currentItemIndex,
        isDeleteAllItemsModalVisible,
    } = state;

    const saveData = async () => {
        await saveList(currentList.id, sections);
    };

    useEffect(() => {
        saveData();
    }, [sections]);

    const setIsCompleteForAll = (isComplete: boolean): void =>
        itemsDispatch(new SetAllIsComplete(isComplete));

    const openItemsModal = (): void =>
        itemsDispatch(new SetItemModalVisible(true));

    const addItem = (addItemParams: ItemCRUD): void =>
        itemsDispatch(new AddItem(addItemParams));

    const updateItem = (updateItemParams: ItemCRUD): void =>
        itemsDispatch(new UpdateItem(updateItemParams));

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
            isDeveloperModeEnabled ? ` (${items.length} Cells)` : ""
        );
    };

    const renderItem = (
        params: RenderItemParams<Item>,
        sectionIndex: number
    ): ReactNode => {
        return (
            <ItemCellView
                list={currentList}
                sectionIndex={sectionIndex}
                itemsDispatch={itemsDispatch}
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
            onPress: () =>
                itemsDispatch(new SetDeleteAllItemsModalVisible(true)),
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

    return (
        <CollectionPageView
            menuOptions={menuOptionsData}
            navigationMenuOptions={navigationMenuOptions}
            items={items}
            itemsType="Item"
        >
            <View style={{ flex: 1 }}>
                {/**
                 * "isItemModalVisible && ItemModal" unmounts the modal when not visible, which resets
                 * the values every time the modal is re-opened. Unfortunately, putting that logic in
                 * {@link CustomModal} didn't work.
                 */}
                {isItemModalVisible && (
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
                        listType={currentList.listType}
                        positiveActionText={
                            currentItemIndex === -1 ? "Add" : "Update"
                        }
                        positiveAction={
                            currentItemIndex === -1 ? addItem : updateItem
                        }
                        negativeActionText="Cancel"
                        negativeAction={() =>
                            itemsDispatch(new SetItemModalVisible(false))
                        }
                        altActionText="Next"
                        altAction={() => itemsDispatch(new AltAction())}
                    />
                )}

                <DeleteAllModal
                    isVisible={isDeleteAllItemsModalVisible}
                    items={items} // items
                    positiveAction={() => itemsDispatch(new DeleteItems())}
                    negativeAction={() =>
                        itemsDispatch(new SetDeleteAllItemsModalVisible(false))
                    }
                />

                <CollectionViewHeader
                    title={headerText()}
                    isAllSelected={isAllSelected(items)} // items
                    onChecked={(isChecked: boolean) =>
                        itemsDispatch(new SelectAll(isChecked))
                    }
                    cellsType="Item"
                    cells={items}
                    openListModal={openItemsModal}
                />

                <GestureHandlerRootView style={{ flex: 1 }}>
                    <NestableScrollContainer>
                        {sections.map((section, sectionIndex) => (
                            <View key={`${section.name}-${sectionIndex}`}>
                                <Text style={{ fontSize: 30 }}>
                                    {isDeveloperModeEnabled
                                        ? `${
                                              section.name
                                          } (is primary: ${displayBoolean(
                                              section.isPrimary
                                          )})`
                                        : section.name}
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
                                        itemsDispatch(
                                            new ReplaceItems(data, sectionIndex)
                                        )
                                    }
                                />
                            </View>
                        ))}
                    </NestableScrollContainer>
                </GestureHandlerRootView>
            </View>
        </CollectionPageView>
    );
}
