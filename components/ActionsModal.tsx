import { useEffect, useReducer } from "react";
import { FlatList, ListRenderItemInfo, View, Text } from "react-native";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import { CollectionViewCellType, SelectionValue, ModalButton } from "../types";
import {
    ActionsState,
    actionsStateReducer,
    DeleteAction,
    UpdateAction,
    AddAction,
    UpdateAll,
    UpdateCellsToSelect,
    UpdateError,
    defaultActionsState,
    UpdateSelectedIndex,
} from "../data/reducers/actions.reducer";
import DeleteButton from "./DeleteButton";
import CustomCheckBox from "./core/CustomCheckBox";

type ActionsModalProps = {
    isVisible: boolean;
    cellsType: CollectionViewCellType;
    cellSelectActions: SelectionValue<(incides: number[]) => void>[];
    cellsActions: SelectionValue<(incides: number[]) => void>[];
    setVisible: (isVisible: boolean) => void;
    actionCells: SelectionValue<number>[];
};

export default function ActionsModal(props: ActionsModalProps): JSX.Element {
    const {
        cellsType,
        isVisible,
        cellSelectActions,
        cellsActions,
        setVisible,
        actionCells,
    } = props;

    const [actionsState, actionsReducer] = useReducer(
        actionsStateReducer,
        defaultActionsState()
    );
    const { cellsToSelect, actions, error, selectedIndices } = actionsState;

    const setCellsToSelect = (
        newCellsToSelect: (incides: number[]) => void
    ): void => actionsReducer(new UpdateCellsToSelect(newCellsToSelect));

    const addAction = (): void => actionsReducer(new AddAction(undefined));

    const setError = (newError?: string): void =>
        actionsReducer(new UpdateError(newError));

    useEffect(() => {
        const newState: ActionsState = defaultActionsState();
        actionsReducer(new UpdateAll(newState));
    }, [props]);

    const closeModal = (): void => setVisible(false);

    const executeAction = (): void => {
        if (cellsToSelect === undefined) {
            setError("Select the cells on which to perform actions");
            return;
        }

        // Add the method for selecting cells
        let actionMethods: ((incides: number[]) => void)[] = [cellsToSelect];

        // Find all the methods that will be run on the selected cells.
        for (const action of actions) {
            if (action === undefined) {
                setError("Select an action to perform on the selected cells");
                return;
            }
            actionMethods = [...actionMethods, action];
        }

        // Run all the actions.
        for (const action of actionMethods) {
            action(selectedIndices);
        }

        // Dismiss the actions modal
        setVisible(false);
    };

    const setNewAction = (
        index: number,
        newAction: ((incides: number[]) => void) | undefined
    ): void => actionsReducer(new UpdateAction(index, newAction));

    const deleteAction = (actionIndex: number): void =>
        actionsReducer(new DeleteAction(actionIndex));

    const setIndices = (isChecked: boolean, newIndex: number) =>
        actionsReducer(new UpdateSelectedIndex(isChecked, newIndex));

    const isCellChecked = (index: number): boolean =>
        selectedIndices.find((i) => i === index) !== undefined;

    const positiveAction: ModalButton = {
        text: "Run",
        onPress: executeAction,
    };

    const negativeAction: ModalButton = {
        text: "Cancel",
        onPress: closeModal,
    };

    const isAddButtonDisabled: boolean =
        actions.length > 0 &&
        actions[actions.length - 1] ===
            cellsActions.find((ca) => ca.label === "Delete")?.value;

    const altAction: ModalButton = {
        text: "Add",
        onPress: addAction,
        disabled: isAddButtonDisabled,
    };

    const renderItem = (
        params: ListRenderItemInfo<((incides: number[]) => void) | undefined>
    ) => {
        const { item: action, index } = params;

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
                        data={cellsActions}
                        selectedValue={action}
                        setSelectedValue={(
                            newAction: ((incides: number[]) => void) | undefined
                        ) => setNewAction(index, newAction)}
                        testId={`action-dropdown-${index}`}
                    />
                </View>
            </View>
        );
    };

    return (
        <CustomModal
            title={`${cellsType} Actions`}
            isVisible={isVisible}
            positiveAction={positiveAction}
            negativeAction={negativeAction}
            altAction={altAction}
            error={error}
        >
            <CustomDropdown
                placeholder="Select items"
                data={cellSelectActions}
                selectedValue={cellsToSelect}
                setSelectedValue={setCellsToSelect}
            />

            {cellsToSelect ===
                cellSelectActions.find((ca) => ca.label === "Some")?.value &&
                actionCells.map(({ label, value }, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Text>{label}</Text>

                        <CustomCheckBox
                            isChecked={isCellChecked(value)}
                            onChecked={(isChecked: boolean) =>
                                // Add an index if checked; remove an index if unchecked.
                                setIndices(isChecked, value)
                            }
                        />
                    </View>
                ))}

            <View style={{ width: "100%" }}>
                <FlatList
                    data={actions}
                    renderItem={renderItem}
                    contentContainerStyle={{ gap: 10 }}
                />
            </View>
        </CustomModal>
    );
}
