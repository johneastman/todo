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
import { useContext, useEffect, useState } from "react";
import { navigationTitleOptions, removeAt, updateAt } from "../../utils";
import CustomButton from "../core/CustomButton";
import DeleteButton from "../DeleteButton";
import CustomError from "../core/CustomError";
import {
    ListsAction,
    SelectMultipleItems,
    SelectMultipleLists,
} from "../../data/reducers/lists.reducer";
import { ListsContext } from "../../contexts/lists.context";

export default function ActionsPage({
    route,
    navigation,
}: ActionsPageNavigationProps): JSX.Element {
    const { cellType, cells, selectActions, cellActions, listIndex } =
        route.params;

    const { listsDispatch } = useContext(ListsContext);

    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [selectAction, setSelectAction] = useState<[CellSelect, number[]]>();
    const [currentCellActions, setCurrentCellActions] = useState<
        ([CellAction, ListsAction] | undefined)[]
    >([undefined]);
    const [error, setError] = useState<string>();

    const addAction = (): void =>
        setCurrentCellActions([...currentCellActions, undefined]);

    const updateAction = (
        index: number,
        newAction: [CellAction, ListsAction] | undefined
    ): void =>
        setCurrentCellActions(updateAt(newAction, currentCellActions, index));

    const deleteAction = (actionIndex: number): void =>
        setCurrentCellActions(removeAt(actionIndex, currentCellActions));

    const isAddButtonDisabled = (): boolean => {
        if (currentCellActions.length <= 0) return false;

        const lastAction: [CellAction, ListsAction] | undefined =
            currentCellActions[currentCellActions.length - 1];

        if (lastAction === undefined) return false;

        return lastAction[0] === "Delete";
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
        if (selectAction === undefined) {
            setError("Select the cells on which to perform actions");
            return;
        }

        switch (cellType) {
            case "List": {
                listsDispatch(new SelectMultipleLists(selectedIndices, true));
                break;
            }

            case "Item": {
                // A list index is passed when executing item actions.
                listsDispatch(
                    new SelectMultipleItems(listIndex!, selectedIndices, true)
                );
                break;
            }

            default:
                throw Error(`Unsupported cell type: ${cellType}`);
        }

        for (const currentAction of currentCellActions) {
            if (currentAction === undefined) {
                setError("Select an action to perform on the selected cells");
                return;
            }

            const [_, reducerAction] = currentAction;
            listsDispatch(reducerAction);
        }

        navigation.goBack();
    };

    const onSelectAction = (value: [CellSelect, number[]]) => {
        const [_, indices] = value;
        setSelectAction(value);
        setSelectedIndices(indices);
    };

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
                        const newIndices: number[] = isChecked
                            ? [...selectedIndices, value]
                            : selectedIndices.filter(
                                  (index) => index !== value
                              );

                        setSelectedIndices(newIndices);
                        setSelectAction(["Custom", newIndices]);
                    }}
                />
            </View>
        );
    };

    const renderAction = (
        action: [CellAction, ListsAction] | undefined,
        index: number
    ) => {
        const cellActionData: SelectionValue<[CellAction, ListsAction]>[] =
            cellActions.map((cellAction) => {
                const [label, _] = cellAction;
                return { label: label, value: cellAction };
            });

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
                        data={cellActionData}
                        selectedValue={action}
                        setSelectedValue={(
                            newAction: [CellAction, ListsAction]
                        ) => updateAction(index, newAction)}
                        testId={`action-dropdown-${index}`}
                    />
                    {action !== undefined && action[0] === "Delete" && (
                        <CustomError error={"This action cannot be undone"} />
                    )}
                </View>
            </View>
        );
    };

    const selectActionData: SelectionValue<[CellSelect, number[]]>[] =
        selectActions.map((selectAction) => {
            const [label, _] = selectAction;

            return {
                label: label,
                value: selectAction,
            };
        });

    return (
        <AddUpdateContainer>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                    <CustomDropdown
                        selectedValue={selectAction}
                        /**
                         * When the user manually checks/unchecks a cell, I want the
                         * dropdown for the selected cells to say "Custom". But the
                         * selected indicies won't match the dropdown options, so the
                         * dropdown will say "Select items". To get around this, I
                         * made the placeholder dynamic based on the value of the
                         * select action.
                         */
                        placeholder={
                            selectAction === undefined
                                ? "Select items"
                                : "Custom"
                        }
                        data={selectActionData}
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
            <CustomError error={error} />
        </AddUpdateContainer>
    );
}
