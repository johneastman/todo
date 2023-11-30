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
    updateLists: (lists: List[]) => void;
}

export default function ListCellView(props: ListCellViewProps): JSX.Element {
    const { isFocused, lists, updateLists } = props;

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
                    isChecked={lists[index].isSelected}
                    onChecked={(isChecked: boolean) => {
                        const newLists: List[] = lists.map(
                            (l, i) =>
                                new List(
                                    l.id,
                                    l.name,
                                    l.type,
                                    l.defaultNewItemPosition,
                                    i === index ? isChecked : l.isSelected
                                )
                        );
                        updateLists(newLists);
                    }}
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
