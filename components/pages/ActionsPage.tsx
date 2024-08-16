import { View } from "react-native";
import {
    ActionsPageNavigationProps,
    CellAction,
    CellSelect,
    SelectionValue,
} from "../../types";
import AddUpdateContainer from "../AddUpdateContainer";
import CustomFlatList from "../core/CustomFlatList";
import CustomText from "../core/CustomText";
import CustomCheckBox from "../core/CustomCheckBox";
import CustomDropdown from "../core/CustomDropdown";
import { useEffect, useState } from "react";
import { navigationTitleOptions, removeAt, updateAt } from "../../utils";
import CustomButton from "../core/CustomButton";
import DeleteButton from "../DeleteButton";

export default function ActionsPage({
    route,
    navigation,
}: ActionsPageNavigationProps): JSX.Element {
    const { cellType, cells } = route.params;

    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [selectAction, setSelectAction] = useState<CellSelect>();
    const [currentCellActions, setCurrentCellActions] = useState<
        (CellAction | undefined)[]
    >([undefined]);

    const addAction = (): void =>
        setCurrentCellActions([...currentCellActions, undefined]);

    const updateAction = (
        index: number,
        newAction: CellAction | undefined
    ): void =>
        setCurrentCellActions(updateAt(newAction, currentCellActions, index));

    const deleteAction = (actionIndex: number): void =>
        setCurrentCellActions(removeAt(actionIndex, currentCellActions));

    const isAddButtonDisabled = (): boolean => {
        if (currentCellActions.length <= 0) return false;

        const lastAction: CellAction | undefined =
            currentCellActions[currentCellActions.length - 1];

        if (lastAction === undefined) return false;

        return lastAction === "Delete";
    };

    useEffect(() => {
        navigation.setOptions({
            ...navigationTitleOptions(`${cellType} Actions`),
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomButton
                        text="Add"
                        onPress={addAction}
                        disabled={isAddButtonDisabled()}
                        testId="actions-page-add"
                    />

                    <CustomButton
                        text="Run"
                        onPress={executeAction}
                        testId="actions-page-run"
                    />
                </View>
            ),
        });
    }, [currentCellActions, selectedIndices]);

    const executeAction = () => {
        // TODO: run actions
        console.log(selectedIndices);
        navigation.goBack();
    };

    const onSelectAction = (value: CellSelect) => {
        setSelectAction(value);

        switch (value) {
            case "All":
                setSelectedIndices(cells.map((cell) => cell.value));
                break;
            case "None":
                setSelectedIndices([]);
                break;
            case "Generic List":
                break;
            default:
                throw Error(`Invalid Select Action: ${value}`);
        }
    };

    const selectActions: SelectionValue<CellSelect>[] = [
        {
            label: "Select All",
            value: "All",
        },
        {
            label: "Select None",
            value: "None",
        },
        {
            label: "Select Generic Lists",
            value: "Generic List",
        },
    ];

    const cellActions: SelectionValue<CellAction>[] = [
        {
            label: "Delete",
            value: "Delete",
        },
    ];

    const renderCells = (
        cell: SelectionValue<number>,
        index: number
    ): JSX.Element => {
        const { label, value } = cell;

        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <CustomText text={label} />

                <CustomCheckBox
                    isChecked={selectedIndices.includes(value)}
                    onChecked={(isChecked: boolean) => {
                        if (isChecked) {
                            setSelectedIndices([...selectedIndices, value]);
                        } else {
                            setSelectedIndices(
                                selectedIndices.filter(
                                    (index) => index !== value
                                )
                            );
                        }
                    }}
                />
            </View>
        );
    };

    const renderAction = (action: CellAction | undefined, index: number) => {
        return (
            <View
                style={{
                    gap: 10,
                    flexDirection: "row",
                }}
            >
                {index > 0 && (
                    <DeleteButton
                        onPress={() => deleteAction(index)}
                        testId={`delete-action-${index}`}
                    />
                )}

                <View style={{ flex: 1 }}>
                    <CustomDropdown
                        placeholder="Select action"
                        data={cellActions}
                        selectedValue={action}
                        setSelectedValue={(newAction: CellAction) =>
                            updateAction(index, newAction)
                        }
                        testId={`action-dropdown-${index}`}
                    />
                </View>
            </View>
        );
    };

    return (
        <AddUpdateContainer>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                    <CustomDropdown
                        selectedValue={selectAction}
                        placeholder="Select items"
                        data={selectActions}
                        setSelectedValue={onSelectAction}
                    />

                    <CustomFlatList
                        data={currentCellActions}
                        renderElement={renderAction}
                        contentContainerStyle={{ gap: 10, width: "100%" }}
                    />
                </View>
                <CustomFlatList
                    data={cells}
                    renderElement={renderCells}
                    contentContainerStyle={{
                        gap: 10,
                    }}
                />
            </View>
        </AddUpdateContainer>
    );
}
