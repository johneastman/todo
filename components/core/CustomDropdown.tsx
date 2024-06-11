import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";

import { areTestsRunning } from "../../utils";
import { SelectionValue } from "../../types";
import CustomRadioButtons from "./CustomRadioButtons";

type CustomDropdownProps<T> = {
    placeholder?: string;
    data: SelectionValue<T>[];
    selectedValue?: T;
    setSelectedValue: (value: T) => void;
};

export default function CustomDropdown<T>(
    props: CustomDropdownProps<T>
): JSX.Element {
    const { placeholder, data, selectedValue, setSelectedValue } = props;

    // Find the key-value pair in the data with the selected value
    const value: SelectionValue<T> | undefined = data.filter((d) => {
        return d.value === selectedValue;
    })[0];

    const onChange = (selected: SelectionValue<T>): void => {
        setSelectedValue(selected.value);
    };

    return areTestsRunning() ? (
        <CustomRadioButtons
            title={placeholder}
            data={data}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
        />
    ) : (
        <Dropdown
            data={data}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            labelField={"label"}
            valueField={"value"}
            style={styles.dropdown}
        />
    );
}

export const styles = StyleSheet.create({
    dropdown: {
        width: "100%",
    },
});
