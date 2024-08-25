import { SelectionValue } from "../../types";
import CustomPicker from "./CustomPicker";

type CustomDropdownProps<T> = {
    placeholder?: string;
    data: SelectionValue<T>[];
    selectedValue?: T;
    setSelectedValue: (value: T) => void;

    disabled?: boolean;
    testId?: string;
};

export default function CustomDropdown<T>(
    props: CustomDropdownProps<T>
): JSX.Element {
    const {
        placeholder,
        data,
        selectedValue,
        setSelectedValue,
        disabled,
        testId,
    } = props;

    // Find the key-value pair in the data with the selected value
    // const value: SelectionValue<T> | undefined = data.find(
    //     (d) => d.value === selectedValue
    // );

    // const onChange = (selected: SelectionValue<T>): void => {
    //     setSelectedValue(selected.value);
    // };
    return (
        <CustomPicker
            placeholder={placeholder}
            data={data}
            selectedValue={selectedValue}
            onSelect={setSelectedValue}
            disabled={disabled}
            testId={testId}
        />
    );

    // return areTestsRunning() ? (
    //     <CustomRadioButtons
    //         title={placeholder}
    //         data={data}
    //         selectedValue={selectedValue}
    //         setSelectedValue={setSelectedValue}
    //         testId={testId}
    //     />
    // ) : (

    // );
}
