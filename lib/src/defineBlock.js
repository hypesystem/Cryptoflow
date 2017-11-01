const _ = require("lodash");

module.exports = (config) => {
    return _.defaults(config, {
        render: () => {
            return `
                ${config.inputs.map((inputName) => `
                    <g class="block-input">
                        <circle class="block-input-dot dot-on-box"></circle>
                        <circle class="block-input-dot external-dot"></circle>
                        <path class="block-input-path path-between-circles"></path>
                        <text class="block-input-label label">${inputName}</text>
                    </g>`).join("")}
                <g class="block" style="transform: translate(100px, 100px);">
                    <rect class="block-square" width="100px" height="50px" />
                    <text class="block-label label" x="20px" y="20px">${config.name}</text>
                </g>
                <g class="block-output">
                    <circle class="block-output-dot dot-on-box"></circle>
                    <circle class="block-output-dot external-dot"></circle>
                    <path class="block-output-path path-between-circles"></path>
                    <text class="block-output-label label">output</text>
                </g>
            `;
        }
    });
};
