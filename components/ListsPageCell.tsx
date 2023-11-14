import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useContext, useEffect, useState } from "react";
import { Pressable, View, Text, Image } from "react-native";

import { List } from "../data/data";
import {
    STYLES,
    getDeveloperModeListCellStyles,
    getNumberOfItemsInList,
    itemsCountDisplay,
} from "../utils";
import { ListPageNavigationProp, SettingsContext } from "../types";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import CustomCheckBox from "./CustomCheckBox";

interface ListPageCellProps {
    renderItemParams: RenderItemParams<List>;
    isFocused: boolean;
    lists: List[];
    navigation: ListPageNavigationProp;
    isListBeingEdited: (index: number) => boolean;
    updateItemBeingEdited: (index: number, addToList: boolean) => void;
}

export default function ListPageCell(props: ListPageCellProps): JSX.Element {
    const {
        renderItemParams,
        isFocused,
        lists,
        navigation,
        isListBeingEdited,
        updateItemBeingEdited,
    } = props;

    const { item, getIndex, drag, isActive } = renderItemParams;
    const settingsContext = useContext(SettingsContext);

    const [numItems, setNumItems] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (isFocused) {
                // Get the number of items in the list
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

                    <CustomCheckBox
                        testID={`edit-list-checkbox-${index}`}
                        isChecked={isListBeingEdited(index)}
                        onChecked={(isChecked: boolean) =>
                            updateItemBeingEdited(index, isChecked)
                        }
                    />
                </View>
                {settingsContext.isDeveloperModeEnabled ? (
                    <DeveloperModeListCellView>
                        <Text>List ID: {item.id}</Text>
                        <Text>Index: {index}</Text>
                    </DeveloperModeListCellView>
                ) : null}
            </Pressable>
        </ScaleDecorator>
    );
}
