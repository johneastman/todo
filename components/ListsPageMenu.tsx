import { ListPageNavigationProp } from "../types";
import CustomMenu from "./CustomMenu";
import CustomMenuOption from "./CustomMenuOption";

interface ListsPageMenuProps {
    navigation: ListPageNavigationProp;
    deleteAllLists: () => void;
}

export default function ListsPageMenu(props: ListsPageMenuProps): JSX.Element {
    const { navigation, deleteAllLists } = props;

    return (
        <CustomMenu>
            <CustomMenuOption
                text="Delete All Lists"
                onSelect={deleteAllLists}
                textStyle={{ color: "red" }}
            />
            <CustomMenuOption
                text="Settings"
                onSelect={() => navigation.navigate("Settings")}
            />
        </CustomMenu>
    );
}
