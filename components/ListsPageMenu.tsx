import { MenuOption } from "react-native-popup-menu";
import { ListPageNavigationProp } from "../types";
import { Text } from "react-native";

import CustomMenu from "./CustomMenu";
import { STYLES } from "../utils";
import CustomMenuOption from "./CustomMenuOption";

interface ListsPageMenuProps {
    navigation: ListPageNavigationProp;
}

export default function ListsPageMenu(props: ListsPageMenuProps): JSX.Element {
    const { navigation } = props;

    return (
        <CustomMenu>
            <CustomMenuOption
                text="Settings"
                onSelect={() => navigation.navigate("Settings")}
            />
        </CustomMenu>
    );
}
