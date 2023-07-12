import { List } from "../data/data";
import { ListPageNavigationProp } from "../types";
import { deleteCollectionMenuStyle } from "../utils";
import CustomMenu from "./CustomMenu";
import CustomMenuOption from "./CustomMenuOption";

interface ListsPageMenuProps {
    lists: List[];
    navigation: ListPageNavigationProp;
    deleteAllLists: () => void;
}

export default function ListsPageMenu(props: ListsPageMenuProps): JSX.Element {
    const { lists, navigation, deleteAllLists } = props;

    return (
        <CustomMenu>
            <CustomMenuOption
                text="Delete All Lists"
                onSelect={deleteAllLists}
                textStyle={deleteCollectionMenuStyle(lists)}
                disabled={lists.length === 0}
            />
            <CustomMenuOption
                text="Settings"
                onSelect={() => navigation.navigate("Settings")}
            />
        </CustomMenu>
    );
}
