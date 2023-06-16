import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useEffect, useState } from "react";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";

import { List } from "../data/List";
import { getNumberOfItemsInList, itemsCountDisplay } from "../utils";
import CollectionCellActions from "./CollectionCellActions";
import { ListPageNavigationProp } from "../types";

interface ListPageCellProps {
    renderItemParams: RenderItemParams<List>;
    isFocused: boolean;
    lists: List[];
    navigation: ListPageNavigationProp;
    openUpdateListModal: (index: number) => void;
    setListIndexToDelete: (index: number) => void;
}

export default function ListPageCell(props: ListPageCellProps): JSX.Element {
    const {
        renderItemParams,
        isFocused,
        lists,
        navigation,
        openUpdateListModal,
        setListIndexToDelete,
    } = props;

    const { item, getIndex, drag, isActive } = renderItemParams;

    const [numItems, setNumItems] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (isFocused) {
                let numItems: number = await getNumberOfItemsInList(item);
                setNumItems(numItems);
            }
        })();

        /* Update items count when:
         *   1. "lists" changes (a list is added or removed)
         *   2. When items are added to/removed from lists (via "isFocused")
         */
    }, [lists, isFocused]);

    let index: number = getIndex() ?? -1;

    return (
        <ScaleDecorator>
            <Pressable
                disabled={isActive}
                onLongPress={drag}
                onPress={() => {
                    navigation.navigate("Items", {
                        listName: item.name,
                        listId: item.id,
                    });
                }}
            >
                <View
                    style={[
                        styles.listCell,
                        {
                            backgroundColor: isActive ? "lightblue" : "white",
                        },
                    ]}
                >
                    <View style={styles.listCellText}>
                        <Text
                            testID={`list-cell-name-${index}`}
                            style={{ fontSize: 30 }}
                        >
                            {item.name}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                            Shopping • {itemsCountDisplay(numItems)}
                        </Text>
                    </View>
                    <Image
                        source={require("../assets/right-arrow.png")}
                        style={{ width: 32, height: 32 }}
                    ></Image>
                    <CollectionCellActions
                        index={index}
                        updateAction={() => {
                            openUpdateListModal(index);
                        }}
                        deleteAction={() => {
                            setListIndexToDelete(index);
                        }}
                    />
                </View>
            </Pressable>
        </ScaleDecorator>
    );
}

const styles = StyleSheet.create({
    listCell: {
        flex: 1,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    listCellText: {
        flex: 1,
        flexDirection: "column",
    },
});
