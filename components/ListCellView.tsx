import { useContext, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

import { List } from "../data/data";
import { STYLES, getNumberOfItemsInList, itemsCountDisplay } from "../utils";
import { ListCellContext, SettingsContext } from "../types";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import CustomCheckBox from "./CustomCheckBox";

interface ListCellViewProps {
    isFocused: boolean;
    lists: List[];
    isListBeingEdited: (index: number) => boolean;
    updateItemBeingEdited: (index: number, addToList: boolean) => void;
}

export default function ListCellView(props: ListCellViewProps): JSX.Element {
    const { isFocused, lists, isListBeingEdited, updateItemBeingEdited } =
        props;

    const settingsContext = useContext(SettingsContext);
    const dataContext = useContext(ListCellContext);
    const { item, index } = dataContext;

    const [numItems, setNumItems] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (isFocused) {
                // Get the number of items in the list
                let numItems: number = await getNumberOfItemsInList(
                    dataContext.item
                );
                setNumItems(numItems);
            }
        })();

        /* Update items count when:
         *   1. "lists" changes (a list is added or removed)
         *   2. When items are added to/removed from lists (via "isFocused")
         */
    }, [lists, isFocused]);

    return (
        <>
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
                />

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
        </>
    );
}
