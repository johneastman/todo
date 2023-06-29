import { MenuOption } from "react-native-popup-menu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "react-native";

import CustomMenu from "./CustomMenu";
import { AppStackNavigatorParamList } from "../types";
import { Item } from "../data/data";
import { STYLES } from "../utils";
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
}

export default function ItemsPageMenu(props: ItemsPageMenuProps): JSX.Element {
    const { items, navigation, deleteAllItems, changeIsComplete } = props;

    return (
        <CustomMenu>
            <CustomMenuOption
                text="Delete All Items"
                onSelect={deleteAllItems}
                disabled={items.length === 0}
                textStyle={{
                    color: "red",
                    opacity: items.length === 0 ? 0.3 : 1,
                }}
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
                text="Settings"
                onSelect={() => navigation.navigate("Settings")}
            />
        </CustomMenu>
    );
}
