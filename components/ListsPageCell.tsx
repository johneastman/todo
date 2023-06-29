import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useEffect, useState } from "react";
import { Pressable, View, Text, Image } from "react-native";

import { List } from "../data/data";
import { getDeveloperMode } from "../data/utils";
import {
    STYLES,
    areTestsRunning,
    getDeveloperModeListCellStyles,
    getNumberOfItemsInList,
    itemsCountDisplay,
} from "../utils";
import { ListPageNavigationProp } from "../types";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import OptionsDisplay from "./OptionsDisplay";

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
    const [isDeveloperModeEnabled, setIsDeveloperModeEnabled] =
        useState<boolean>(false);

    useEffect(() => {
        (async () => {
            if (isFocused) {
                // Get the number of items in the list
                let numItems: number = await getNumberOfItemsInList(item);
                setNumItems(numItems);

                // Get developer mode
                setIsDeveloperModeEnabled(await getDeveloperMode());
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
                        list: item,
                    });
                }}
                style={getDeveloperModeListCellStyles(isActive)}
            >
                <View
                    style={[
                        STYLES.listCellView,
                        {
                            flex: 1,
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
                            {item.type} • {itemsCountDisplay(numItems)}
                        </Text>
                    </View>
                    <Image
                        source={require("../assets/right-arrow.png")}
                        style={{ width: 32, height: 32 }}
                    ></Image>

                    <OptionsDisplay
                        options={[
                            {
                                text: "Update",
                                action: () => {
                                    openUpdateListModal(index);
                                },
                                testID: `list-cell-update-${index}`,
                            },
                            {
                                text: "Delete",
                                action: () => {
                                    setListIndexToDelete(index);
                                },
                                testID: `list-cell-delete-${index}`,
                                textStyle: { color: "red" },
                            },
                        ]}
                    />
                </View>
                {isDeveloperModeEnabled ? (
                    <DeveloperModeListCellView>
                        <Text>List ID: {item.id}</Text>
                        <Text>Index: {index}</Text>
                    </DeveloperModeListCellView>
                ) : null}
            </Pressable>
        </ScaleDecorator>
    );
}
