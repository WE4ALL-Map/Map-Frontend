import { setMarkerTypeAsVisible } from "./map.js";

const radioButtonGroup = document.getElementById("partner-type-form");

const onRadioButtonChanged = (e) => {
    const type = e.target.value;

    setMarkerTypeAsVisible(type);
};

radioButtonGroup.addEventListener("change", onRadioButtonChanged);


