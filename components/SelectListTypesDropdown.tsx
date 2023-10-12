import { Dropdown } from "react-native-element-dropdown";
import { STYLES } from "../utils";
import { listTypes } from "../data/data";
import { ListType, ListTypeValue } from "../types";

interface SelectListTypesDropdownProps {
    selectedValue: ListTypeValue;
    setSelectedValue: (value: ListTypeValue) => void;
}

export default function SelectListTypesDropdown(
    props: SelectListTypesDropdownProps
): JSX.Element {
    const { selectedValue, setSelectedValue } = props;

    return (
        <Dropdown
            style={STYLES.dropdown}
            data={listTypes}
            labelField={"label"}
            valueField={"value"}
            onChange={(listType: ListType): void => {
                setSelectedValue(listType.value);
            }}
            value={selectedValue}
        />
    );
}
