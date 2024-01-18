import React, { ReactNode, useContext, useEffect, useReducer } from "react";
import { View, Text } from "react-native";

import ItemModal from "./ItemModal";
import { Item, MenuOption } from "../data/data";
import { saveList } from "../data/utils";
import {
    RED,
    areTestsRunning,
    displayBoolean,
    getNumItemsIncomplete,
    getNumItemsTotal,
    getLocationOfItemBeingEdited,
    pluralize,
    selectedListCellsWording,
    getSectionsItems,
    itemsCountDisplay,
    getSelectedCells,
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
        isItemModalVisible: false,
        isDeleteAllItemsModalVisible: false,
    });

    const {
        sections,
        itemBeingEdited,
        isItemModalVisible,
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

    const openItemModal = (): void =>
        itemsDispatch(new SetItemModalVisible(true));

    const closeItemModal = (): void =>
        itemsDispatch(new SetItemModalVisible(false));

    const addItem = (addItemParams: ItemCRUD): void =>
        itemsDispatch(new AddItem(addItemParams));

    const updateItem = (updateItemParams: ItemCRUD): void =>
        itemsDispatch(new UpdateItem(updateItemParams));

    const headerText = (): string => {
        const items: Item[] = getSectionsItems(sections);

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
            text: `Delete ${selectedListCellsWording(
                getSectionsItems(sections)
            )} Items`,
            onPress: () =>
                itemsDispatch(new SetDeleteAllItemsModalVisible(true)),
            disabled: getSectionsItems(sections).length === 0,
            color: RED,
            testId: "items-page-delete-all-items",
        },
        {
            text: `Set ${selectedListCellsWording(
                getSectionsItems(sections)
            )} to Complete`,
            onPress: () => setIsCompleteForAll(true),
            testId: "items-page-set-all-to-complete",
        },
        {
            text: `Set ${selectedListCellsWording(
                getSectionsItems(sections)
            )} to Incomplete`,
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

    const { itemIndex } = getLocationOfItemBeingEdited(sections);

    return (
        <CollectionPageView
            menuOptions={menuOptionsData}
            navigationMenuOptions={navigationMenuOptions}
            items={getSectionsItems(sections)}
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
                        sections={sections}
                        item={itemBeingEdited}
                        itemIndex={itemIndex}
                        isVisible={isItemModalVisible}
                        title={
                            itemIndex === -1 ? "Add a New Item" : "Update Item"
                        }
                        listType={currentList.listType}
                        positiveActionText={itemIndex === -1 ? "Add" : "Update"}
                        positiveAction={itemIndex === -1 ? addItem : updateItem}
                        negativeActionText="Cancel"
                        negativeAction={closeItemModal}
                        altActionText="Next"
                        altAction={() =>
                            itemsDispatch(new AltAction(itemIndex))
                        }
                    />
                )}

                <DeleteAllModal
                    selectedCells={getSelectedCells(getSectionsItems(sections))}
                    isVisible={isDeleteAllItemsModalVisible}
                    positiveAction={() => itemsDispatch(new DeleteItems())}
                    negativeAction={() =>
                        itemsDispatch(new SetDeleteAllItemsModalVisible(false))
                    }
                    collectionCountDisplay={itemsCountDisplay}
                />

                <CollectionViewHeader
                    title={headerText()}
                    onChecked={(isChecked: boolean) =>
                        itemsDispatch(new SelectAll(isChecked))
                    }
                    cellsType="Item"
                    cells={getSectionsItems(sections)}
                    openListModal={openItemModal}
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
