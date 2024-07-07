import { useContext, useEffect, useState } from "react";
import CustomModal from "./core/CustomModal";
import CustomDropdown from "./core/CustomDropdown";
import { SelectionValue } from "../types";
import { Button, View } from "react-native";
import { AppContext } from "../contexts/app.context";
import {
    ActionsModalVisible,
    SelectAllLists,
} from "../data/reducers/app.reducer";

type CellActionsModalProps = {};

type Action = {
    action: string;
    subAction: string;
};

export default function CellActionsModal(
    props: CellActionsModalProps
): JSX.Element {
    const [actions, setActions] = useState<Action[]>([
        { action: "Action", subAction: "Sub Action" },
    ]);

    const appContext = useContext(AppContext);
    const {
        data: {
            listsState: { isActionsModalVisible },
        },
        dispatch,
    } = appContext;

    useEffect(() => {
        setActions([{ action: "Action", subAction: "Sub Action" }]);
    }, [props]);

    const closeModal = (): void => dispatch(new ActionsModalVisible(false));

    const setSelectedAction = (actionIndex: number, newAction: string): void =>
        setActions(
            actions.map((a, i) =>
                actionIndex === i ? { ...a, action: newAction } : a
            )
        );

    const setSelectedSubAction = (
        actionIndex: number,
        newSubAction: string
    ): void =>
        setActions(
            actions.map((a, i) =>
                actionIndex === i ? { ...a, subAction: newSubAction } : a
            )
        );

    const executeAction = (): void => {
        for (const { action, subAction } of actions) {
            switch (action) {
                case "Select": {
                    switch (subAction) {
                        case "All": {
                            dispatch(new SelectAllLists(true));
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                }

                case "Deselect": {
                    switch (subAction) {
                        case "All": {
                            dispatch(new SelectAllLists(false));
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                }

                default:
                    break;
            }
        }

        // Dismiss the actions modal
        dispatch(new ActionsModalVisible(false));
    };

    const actionOptions: SelectionValue<string>[] = [
        { label: "Select", value: "Select" },
        { label: "Deselect", value: "Deselect" },
    ];

    const selectActions: SelectionValue<string>[] = [
        { label: "All", value: "All" },
    ];

    return (
        <CustomModal
            title="Actions"
            isVisible={isActionsModalVisible}
            positiveActionText="Run"
            positiveAction={executeAction}
            negativeActionText="Cancel"
            negativeAction={closeModal}
            altActionText="Add"
            altAction={() =>
                setActions([
                    ...actions,
                    { action: "Action", subAction: "Sub Action" },
                ])
            }
        >
            {actions.map(({ action, subAction }, index) => (
                <View key={index} style={{ flexDirection: "row", gap: 10 }}>
                    <Button
                        title="Delete"
                        color="red"
                        onPress={() =>
                            setActions(actions.filter((_, i) => i !== index))
                        }
                    />

                    <View style={{ flex: 1 }}>
                        <CustomDropdown
                            placeholder={action}
                            selectedValue={action}
                            data={actionOptions}
                            setSelectedValue={(newAction: string) =>
                                setSelectedAction(index, newAction)
                            }
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <CustomDropdown
                            placeholder={subAction}
                            selectedValue={subAction}
                            data={selectActions}
                            setSelectedValue={(newSubAction: string) =>
                                setSelectedSubAction(index, newSubAction)
                            }
                        />
                    </View>
                </View>
            ))}
        </CustomModal>
    );
}
