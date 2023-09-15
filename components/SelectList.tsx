import { Dropdown } from "react-native-element-dropdown";
import { List } from "../data/data";
import { useEffect, useState } from "react";
import { getLists } from "../data/utils";
import { STYLES } from "../utils";

interface SelectListDropdownProps {
    currentListId: string;
    setSelectedListId: (listId: string) => void;
}

export default function SelectListsDropdown(
    props: SelectListDropdownProps
): JSX.Element {
    const { setSelectedListId } = props;

    const [lists, setLists] = useState<List[]>([]);

    useEffect(() => {
        (async () => {
            let lists = (await getLists()).filter(
                (list) => list.id !== props.currentListId
            );
            setLists(lists);
        })();
    }, []);

    return (
        <Dropdown
            data={lists}
            labelField={"name"}
            valueField={"id"}
            onChange={(item: List): void => setSelectedListId(item.id)}
            style={STYLES.dropdown}
        />
    );
}
