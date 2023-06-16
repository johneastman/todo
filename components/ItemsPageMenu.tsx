import { MenuOption } from "react-native-popup-menu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "react-native";

import CustomMenu from "./CustomMenu";
import { AppStackNavigatorParamList } from "../types";
import { Item } from "../data/Item";

interface ItemsPageMenuProps {
    items: Item[];
    navigation: NativeStackNavigationProp<
        AppStackNavigatorParamList,
        "Items",
        undefined
    >;
    setIsDeleteAllItemsModalVisible: (value: boolean) => void;
}

export default function ItemsPageMenu(props: ItemsPageMenuProps): JSX.Element {
    const { items, navigation, setIsDeleteAllItemsModalVisible } = props;

    return (
        <CustomMenu>
            <MenuOption
                onSelect={() => setIsDeleteAllItemsModalVisible(true)}
                disabled={items.length === 0}
            >
                <Text
                    style={{
                        fontSize: 20,
                        padding: 10,
                        color: "red",
                        opacity: items.length === 0 ? 0.3 : 1,
                    }}
                >
                    Delete All Items
                </Text>
            </MenuOption>
            <MenuOption onSelect={() => navigation.navigate("Settings")}>
                <Text
                    style={{
                        fontSize: 20,
                        padding: 10,
                    }}
                >
                    Settings
                </Text>
            </MenuOption>
        </CustomMenu>
    );
}
