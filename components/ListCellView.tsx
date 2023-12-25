import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";

import {
    STYLES,
    getDeveloperModeListCellStyles,
    getNumberOfItemsInList,
    itemsCountDisplay,
} from "../utils";
import { SettingsContext } from "../types";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import CustomCheckBox from "./CustomCheckBox";
import { useIsFocused } from "@react-navigation/core";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { List } from "../data/data";

interface ListCellViewProps {
    updateItems: (index: number, isSelected: boolean) => void;
    renderParams: RenderItemParams<List>;
    onPress: (item: List, index: number) => void;
    testID?: string;
}

export default function ListCellView(props: ListCellViewProps): JSX.Element {
    const { updateItems, renderParams, onPress, testID } = props;
    const { item: list, getIndex, drag, isActive } = renderParams;

    const index: number = getIndex() ?? -1;

    const isFocused = useIsFocused();

    const settingsContext = useContext(SettingsContext);

    const [numItems, setNumItems] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (isFocused) {
                // Get the number of items in the list
                let numItems: number = await getNumberOfItemsInList(list);
                setNumItems(numItems);
            }
        })();

        /* Update items count when:
         *   1. "lists" changes (a list is added or removed)
         *   2. When items are added to/removed from lists (via "isFocused")
         */
    }, [isFocused]);

    return (
        <ScaleDecorator>
            <Pressable
                testID={testID}
                disabled={isActive}
                onLongPress={drag}
                onPress={() => onPress(list, index)}
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
                            {list.name}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                            {list.listType} • {itemsCountDisplay(numItems)}
                        </Text>
                    </View>
                    <Image
                        source={require("../assets/right-arrow.png")}
                        style={{ width: 32, height: 32 }}
                    />

                    <CustomCheckBox
                        testID={`edit-list-checkbox-${index}`}
                        isChecked={list.isSelected}
                        onChecked={(isChecked: boolean) =>
                            updateItems(index, isChecked)
                        }
                    />
                </View>
                {settingsContext.isDeveloperModeEnabled ? (
                    <DeveloperModeListCellView>
                        <Text>List ID: {list.id}</Text>
                        <Text>Index: {index}</Text>
                    </DeveloperModeListCellView>
                ) : null}
            </Pressable>
        </ScaleDecorator>
    );
}
