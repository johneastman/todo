import { defaultAppData } from "../../contexts/app.context";
import {
    UpdateDefaultListPosition,
    UpdateDefaultListType,
    UpdateDeveloperMode,
    appReducer,
} from "../../data/reducers/app.reducer";

describe("Settings Reducer", () => {
    it("updates developer mode", () => {
        const {
            settings: { isDeveloperModeEnabled },
        } = appReducer(defaultAppData, new UpdateDeveloperMode(true));

        expect(isDeveloperModeEnabled).toEqual(true);
    });

    it("updates default list type", () => {
        const {
            settings: { defaultListType },
        } = appReducer(
            defaultAppData,
            new UpdateDefaultListType("Ordered To-Do")
        );

        expect(defaultListType).toEqual("Ordered To-Do");
    });

    it("updates default new list position", () => {
        const {
            settings: { defaultListPosition },
        } = appReducer(defaultAppData, new UpdateDefaultListPosition("top"));

        expect(defaultListPosition).toEqual("top");
    });
});
