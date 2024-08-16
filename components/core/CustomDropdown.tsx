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

    testId?: string;
};

export default function CustomDropdown<T>(
    props: CustomDropdownProps<T>
): JSX.Element {
    const { placeholder, data, selectedValue, setSelectedValue, testId } =
        props;

    // Find the key-value pair in the data with the selected value
    const value: SelectionValue<T> | undefined = data.find(
        (d) => d.value === selectedValue
    );

    const onChange = (selected: SelectionValue<T>): void => {
        setSelectedValue(selected.value);
    };

    return areTestsRunning() ? (
        <CustomRadioButtons
            title={placeholder}
            data={data}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            testId={testId}
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
            testID={testId}
        />
    );
}

export const styles = StyleSheet.create({
    dropdown: {
        width: "100%",
    },
});
