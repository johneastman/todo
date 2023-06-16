import { MenuOption } from "react-native-popup-menu";
import { ListPageNavigationProp } from "../types";
import { Text } from "react-native";

import CustomMenu from "./CustomMenu";

interface ListsPageMenuProps {
    navigation: ListPageNavigationProp;
}

export default function ListsPageMenu(props: ListsPageMenuProps): JSX.Element {
    const { navigation } = props;

    return (
        <CustomMenu>
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
