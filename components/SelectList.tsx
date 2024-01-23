import { List } from "../data/data";
import { useEffect, useState } from "react";
import { getLists } from "../data/utils";
import { SelectionValue } from "../types";
import CustomDropdown from "./CustomDropdown";

interface SelectListDropdownProps {
    currentList: List;
    selectedList: List | undefined;
    setSelectedList: (list: List) => void;
}

export default function SelectListsDropdown(
    props: SelectListDropdownProps
): JSX.Element {
    const { currentList, selectedList, setSelectedList } = props;

    const [lists, setLists] = useState<List[]>([]);

    useEffect(() => {
        (async () => {
            let availableLists = (await getLists()).filter(
                (list) => list.id !== currentList.id
            );
            setLists(availableLists);
        })();
    }, []);

    const labeledData: SelectionValue<List>[] = lists.map(
        (l: List): SelectionValue<List> => ({
            label: l.name,
            value: l,
        })
    );

    return (
        <CustomDropdown
            placeholder="Move item to"
            data={labeledData}
            selectedValue={selectedList}
            setSelectedValue={(item: List) => setSelectedList(item)}
        />
    );
}
