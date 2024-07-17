import { useEffect, useReducer } from "react";
import { Button, View } from "react-native";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import {
    CellAction,
    CollectionViewCellType,
    CellSelect,
    SelectionValue,
    ModalButton,
} from "../types";
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
import CustomError from "./core/CustomError";

type ActionsModalProps = {
    isVisible: boolean;
    cellsType: CollectionViewCellType;
    cellSelectActions: Map<CellSelect, () => void>;
    cellsActions: Map<CellAction, () => void>;
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

    const setCellsToSelect = (newCellsToSelect: CellSelect): void =>
        actionsReducer(new UpdateCellsToSelect(newCellsToSelect));

    const addAction = (): void => actionsReducer(new AddAction(undefined));

    const setError = (newError?: string): void =>
        actionsReducer(new UpdateError(newError));

    useEffect(() => {
        const newState: ActionsState = defaultActionsState();
        actionsReducer(new UpdateAll(newState));
    }, [props]);

    const selectedItems: SelectionValue<CellSelect>[] = Array.from<CellSelect>(
        cellSelectActions.keys()
    ).map((key) => ({
        label: key,
        value: key,
    }));

    const itemsActions: SelectionValue<CellAction>[] = Array.from<CellAction>(
        cellsActions.keys()
    ).map((key) => ({ label: key, value: key }));

    const closeModal = (): void => setVisible(false);

    const executeAction = (): void => {
        if (cellsToSelect === undefined) {
            setError("Select the cells on which to perform actions");
            return;
        }

        // Find method to select cells
        const selectItems: (() => void) | undefined =
            cellSelectActions.get(cellsToSelect);
        if (selectItems === undefined)
            throw Error(`No method for cells to select: ${cellsToSelect}`);

        let actionMethods: (() => void)[] = [selectItems];

        // Find all the methods that will be run on the selected cells.
        for (const action of actions) {
            if (action === undefined) {
                setError("Select an action to perform on the selected cells");
                return;
            }

            const performAction: (() => void) | undefined =
                cellsActions.get(action);

            if (performAction === undefined)
                throw Error(`No method for action: ${action}`);

            actionMethods = [...actionMethods, performAction];
        }

        // Run all the actions.
        for (const action of actionMethods) {
            action();
        }

        // Dismiss the actions modal
        setVisible(false);
    };

    const setNewAction = (index: number, newAction: CellAction): void =>
        actionsReducer(new UpdateAction(index, newAction));

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

    const altAction: ModalButton = {
        text: "Add",
        onPress: addAction,
        disabled:
            actions.length > 0 && actions[actions.length - 1] === "Delete",
    };

    return (
        <CustomModal
            title={`${cellsType} Actions`}
            isVisible={isVisible}
            positiveAction={positiveAction}
            negativeAction={negativeAction}
            altAction={altAction}
        >
            <CustomDropdown
                placeholder="Select items"
                data={selectedItems}
                selectedValue={cellsToSelect}
                setSelectedValue={(newItems: CellSelect): void =>
                    setCellsToSelect(newItems)
                }
            />

            {actions.map((action, index) => (
                <View
                    key={index}
                    style={{
                        flexDirection: "row",
                        columnGap: 10,
                        width: "100%",
                    }}
                >
                    <Button
                        title="Delete"
                        color="red"
                        onPress={() => deleteAction(index)}
                        testID={`delete-action-${index}`}
                    />

                    <View style={{ flex: 1 }}>
                        <CustomDropdown
                            placeholder="Select action"
                            data={itemsActions}
                            selectedValue={action}
                            setSelectedValue={(newAction: CellAction) =>
                                setNewAction(index, newAction)
                            }
                            testId={`action-dropdown-${index}`}
                        />
                    </View>
                </View>
            ))}

            <CustomError error={error} />
        </CustomModal>
    );
}
