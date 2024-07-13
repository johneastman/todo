import { useEffect, useReducer } from "react";
import { Button, View } from "react-native";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import { CollectionViewCellType, SelectionValue } from "../types";
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
    cellSelectActions: Map<string, () => void>;
    setVisible: (isVisible: boolean) => void;
};

export default function ActionsModal(props: ActionsModalProps): JSX.Element {
    const { cellsType, isVisible, cellSelectActions, setVisible } = props;

    const [actionsState, actionsReducer] = useReducer(
        actionsStateReducer,
        defaultActionsState()
    );
    const { cellsToSelect, actions, error } = actionsState;

    const setCellsToSelect = (newCellsToSelect: string): void =>
        actionsReducer(new UpdateCellsToSelect(newCellsToSelect));

    const addAction = (): void => actionsReducer(new AddAction(""));

    const setError = (newError?: string): void =>
        actionsReducer(new UpdateError(newError));

    useEffect(() => {
        const newState: ActionsState = defaultActionsState();
        actionsReducer(new UpdateAll(newState));
    }, [props]);

    const selectedItems: SelectionValue<string>[] = Array.from<string>(
        cellSelectActions.keys()
    ).map((key) => ({ label: key, value: key }));

    const itemsAction: SelectionValue<string>[] = [
        { label: "Complete", value: "Complete" },
        { label: "Incomplete", value: "Incomplete" },
        { label: "Lock", value: "Lock" },
        { label: "Unlock", value: "Unlock" },
        { label: "Delete", value: "Delete" },
        { label: "Move", value: "Move" },
    ];

    const closeModal = (): void => setVisible(false);

    const executeAction = (): void => {
        if (cellsToSelect === "") {
            setError("Select the cells to perform actions on");
            return;
        }

        // Select Items
        const selectItems: (() => void) | undefined =
            cellSelectActions.get(cellsToSelect);
        if (selectItems === undefined)
            throw Error(`No method for action: ${cellsToSelect}`);

        selectItems();

        // Perform Action
        // TODO: implement actions after selecting items

        // Dismiss the actions modal
        setVisible(false);
    };

    const setNewAction = (index: number, newAction: string): void =>
        actionsReducer(new UpdateAction(index, newAction));

    const deleteAction = (actionIndex: number): void =>
        actionsReducer(new DeleteAction(actionIndex));

    return (
        <CustomModal
            title={`${cellsType} Actions`}
            isVisible={isVisible}
            positiveActionText="Run"
            positiveAction={executeAction}
            negativeActionText="Cancel"
            negativeAction={closeModal}
            altActionText="Add"
            altAction={addAction}
        >
            <CustomDropdown
                placeholder="Select items"
                data={selectedItems}
                selectedValue={cellsToSelect}
                setSelectedValue={(newItems: string): void =>
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
                            data={itemsAction}
                            selectedValue={action}
                            setSelectedValue={(newAction: string) =>
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
