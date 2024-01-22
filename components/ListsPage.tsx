import React, { useContext, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { List } from "../data/data";
import ListModal from "./ListModal";
import ListViewHeader from "./ListViewHeader";
import {
    RED,
    areCellsSelected,
    getItemBeingEdited,
    getSelectedItems,
    isAllSelected,
    listsCountDisplay,
    selectedListCellsWording,
    updateCollection,
} from "../utils";
import CustomList from "./CustomList";
import { ListCRUD, ListPageNavigationProp, MenuOption } from "../types";
import ListCellView from "./ListCellView";
import ListPageView from "./ListPageView";
import DeleteAllModal from "./DeleteAllModal";
import { UpdateLists, UpdateModalVisible } from "../data/reducers/app.reducer";
import { AppContext } from "../contexts/app.context";

export default function ListsPage(): JSX.Element {
    // Deletion
    const [isDeleteAllListsModalVisible, setIsDeleteAllListsModalVisible] =
        useState<boolean>(false);

    let navigation = useNavigation<ListPageNavigationProp>();

    const appContext = useContext(AppContext);
    const {
        data: {
            lists,
            listsState: { isModalVisible, currentIndex },
        },
        dispatch,
    } = appContext;

    const setLists = (newList: List[]) => dispatch(new UpdateLists(newList));
    const setIsListModalVisible = (isVisible: boolean, index?: number) =>
        dispatch(new UpdateModalVisible("List", isVisible, index));

    const addList = (addListParams: ListCRUD): void => {
        const { newPos, list } = addListParams;

        if (list.name.trim().length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        let newLists: List[] =
            newPos === "top" ? [list].concat(lists) : lists.concat(list);

        setLists(newLists);
        setIsListModalVisible(false);
    };

    const updateList = (updateListParams: ListCRUD): void => {
        const { oldPos, newPos, list } = updateListParams;

        if (list.name.trim().length <= 0) {
            setIsListModalVisible(false);
            return;
        }

        let newLists: List[] = updateCollection(
            list,
            lists.concat(),
            oldPos,
            newPos
        );

        setLists(newLists);
        setIsListModalVisible(false);
    };

    const deleteAllLists = async (): Promise<void> => {
        // Lists we want to keep
        const newLists: List[] = areCellsSelected(lists)
            ? lists.filter((list) => !list.isSelected)
            : [];

        setLists(newLists);
    };

    const openUpdateListModal = (index: number): void =>
        setIsListModalVisible(true, index);

    const openDeleteAllListsModal = (): void =>
        setIsDeleteAllListsModalVisible(true);

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
        if (currentIndex === -1) {
            setIsListModalVisible(true);
        } else {
            if (currentIndex + 1 < lists.length) {
                setIsListModalVisible(true, currentIndex + 1);
            }
        }
    };

    const viewListItems = (item: List, index: number) => {
        navigation.navigate("Items", {
            listId: item.id,
        });
    };

    const setSelectedLists = (index: number, isSelected: boolean) => {
        const newLists: List[] = lists.map((l, i) =>
            l.setIsSelected(i === index ? isSelected : l.isSelected)
        );
        setLists(newLists);
    };

    const listModalCancelAction = () => {
        setIsListModalVisible(false);
        setLists(lists.map((l) => l.setIsSelected(false)));
    };

    /**
     * List View Header
     */
    const menuOptionsData: MenuOption[] = [
        {
            text: `Delete ${selectedListCellsWording(lists)} Lists`,
            onPress: openDeleteAllListsModal,
            testId: "lists-page-delete-all-items",
            disabled: lists.length === 0,
            color: RED,
        },
    ];

    const listViewHeaderRight: JSX.Element = (
        <>
            {getSelectedItems(lists).length === 1 ? (
                <Button
                    title="Edit List"
                    onPress={() => {
                        const itemIndex: number = getItemBeingEdited(lists);
                        openUpdateListModal(itemIndex);
                    }}
                />
            ) : null}

            <Button
                title="Add List"
                onPress={() => setIsListModalVisible(true)}
            />
        </>
    );

    // Header text
    let headerString: string = listsCountDisplay(lists.length);

    return (
        <ListPageView
            menuOptions={menuOptionsData}
            items={lists}
            itemsType="List"
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ListModal
                    isVisible={isModalVisible}
                    list={lists[currentIndex]}
                    currentListIndex={currentIndex}
                    positiveAction={currentIndex === -1 ? addList : updateList}
                    negativeAction={listModalCancelAction}
                    altAction={altAction}
                />

                <DeleteAllModal
                    isVisible={isDeleteAllListsModalVisible}
                    items={lists}
                    positiveAction={async () => {
                        // Delete all lists, including items in those lists
                        await deleteAllLists();
                        setIsDeleteAllListsModalVisible(false);
                    }}
                    negativeAction={() =>
                        setIsDeleteAllListsModalVisible(false)
                    }
                />

                <ListViewHeader
                    title={headerString}
                    isAllSelected={isAllSelected(lists)}
                    onChecked={(checked: boolean) =>
                        setLists(lists.map((l) => l.setIsSelected(checked)))
                    }
                    right={listViewHeaderRight}
                />

                <CustomList
                    items={lists}
                    renderItem={(params) => (
                        <ListCellView
                            updateItems={setSelectedLists}
                            renderParams={params}
                            onPress={viewListItems}
                        />
                    )}
                    drag={({ data }) => setLists(data)}
                />
            </GestureHandlerRootView>
        </ListPageView>
    );
}
