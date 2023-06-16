import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useEffect, useState } from "react";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";

import { List } from "../data/List";
import { STYLES, getNumberOfItemsInList, itemsCountDisplay } from "../utils";
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
                        STYLES.listCellView,
                        {
                            flex: 1,
                            backgroundColor: isActive ? "lightblue" : "white",
                        },
                    ]}
                >
                    <View style={STYLES.listCellTextDisplay}>
                        <Text
                            testID={`list-cell-name-${index}`}
                            style={STYLES.listCellNameText}
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
