import { MenuOption } from "react-native-popup-menu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "react-native";

import CustomMenu from "./CustomMenu";
import { AppStackNavigatorParamList } from "../types";
import { Item } from "../data/data";
import { deleteCollectionMenuStyle } from "../utils";
import CustomMenuOption from "./CustomMenuOption";

interface ItemsPageMenuProps {
    items: Item[];
    navigation: NativeStackNavigationProp<
        AppStackNavigatorParamList,
        "Items",
        undefined
    >;
    deleteAllItems: () => void;
    changeIsComplete: (value: boolean) => void;
    setIsCopyItemsVisible: (value: boolean) => void;
}

export default function ItemsPageMenu(props: ItemsPageMenuProps): JSX.Element {
    const {
        items,
        navigation,
        deleteAllItems,
        changeIsComplete,
        setIsCopyItemsVisible,
    } = props;

    return (
        <CustomMenu>
            <CustomMenuOption
                text="Delete All Items"
                onSelect={deleteAllItems}
                disabled={items.length === 0}
                textStyle={deleteCollectionMenuStyle(items)}
            />
            <CustomMenuOption
                text="Set All to Complete"
                onSelect={() => changeIsComplete(true)}
            />
            <CustomMenuOption
                text="Set All to Incomplete"
                onSelect={() => changeIsComplete(false)}
            />
            <CustomMenuOption
                text="Copy Items From"
                onSelect={() => {
                    setIsCopyItemsVisible(true);
                }}
            />
            <CustomMenuOption
                text="Settings"
                onSelect={() => navigation.navigate("Settings")}
            />
        </CustomMenu>
    );
}
