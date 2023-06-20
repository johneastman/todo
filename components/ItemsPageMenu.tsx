import { MenuOption } from "react-native-popup-menu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "react-native";

import CustomMenu from "./CustomMenu";
import { AppStackNavigatorParamList } from "../types";
import { Item } from "../data/data";
import { STYLES } from "../utils";

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
            <MenuOption onSelect={deleteAllItems} disabled={items.length === 0}>
                <Text
                    style={[
                        STYLES.popupMenuText,
                        {
                            color: "red",
                            opacity: items.length === 0 ? 0.3 : 1,
                        },
                    ]}
                >
                    Delete All Items
                </Text>
            </MenuOption>
            <MenuOption onSelect={() => changeIsComplete(true)}>
                <Text style={STYLES.popupMenuText}>Set All to Complete</Text>
            </MenuOption>
            <MenuOption onSelect={() => changeIsComplete(false)}>
                <Text style={STYLES.popupMenuText}>Set All to Incomplete</Text>
            </MenuOption>
            <MenuOption onSelect={() => navigation.navigate("Settings")}>
                <Text style={STYLES.popupMenuText}>Settings</Text>
            </MenuOption>
        </CustomMenu>
    );
}
