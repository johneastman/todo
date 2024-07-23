import { useEffect, useReducer } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
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
} from "../data/reducers/actions.reducer";
import DeleteButton from "./DeleteButton";

type ActionsModalProps = {
    isVisible: boolean;
    cellsType: CollectionViewCellType;
    cellSelectActions: SelectionValue<() => void>[];
    cellsActions: SelectionValue<() => void>[];
    setVisible: (isVisible: boolean) => void;
};

export default function ActionsModal(props: ActionsModalProps): JSX.Element {
    const {
        cellsType,
        isVisible,
        cellSelectActions,
        cellsActions,
        setVisible,
    } = props;

    const [actionsState, actionsReducer] = useReducer(
        actionsStateReducer,
        defaultActionsState()
    );
    const { cellsToSelect, actions, error } = actionsState;

    const setCellsToSelect = (newCellsToSelect: () => void): void =>
        actionsReducer(new UpdateCellsToSelect(newCellsToSelect));

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
        let actionMethods: (() => void)[] = [cellsToSelect];

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
            action();
        }

        // Dismiss the actions modal
        setVisible(false);
    };

    const setNewAction = (
        index: number,
        newAction: (() => void) | undefined
    ): void => actionsReducer(new UpdateAction(index, newAction));

    const deleteAction = (actionIndex: number): void =>
        actionsReducer(new DeleteAction(actionIndex));

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
        params: ListRenderItemInfo<(() => void) | undefined>
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
                            newAction: (() => void) | undefined
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
