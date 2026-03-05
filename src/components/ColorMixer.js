import React from "react";
import colorString from "color-string";

const DEFAULT_BACKGROUND_COLOR = "#FFFFFF";
const DEFAULT_FOREGROUND_COLOR = "#000000";
const hex = (number) =>
    Math.round(number / 17)
        .toString(16)
        .padStart(1, "0");

class ColorMixer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            foregroundColor: DEFAULT_FOREGROUND_COLOR,
            rgbBackgroundColor: [255, 255, 255, 1],
            rgbForegroundColor: [0, 0, 0, 1],
            colors: []
        };
    }

    copyColor = (event) => {
        const {value} = event.target;
        navigator.clipboard
            .writeText(value.toUpperCase())
            .then(() => {
                // worked
            })
            .catch((msg) => {
                console.log(msg);
            });
    };

    handleFocus = (event) => {
        event.target.select();
    };

    backgroundColorChanged = (event) => {
        const {rgbForegroundColor} = this.state;
        const {value} = event.target;
        let rgbBackgroundColor = colorString.get.rgb(value.trim());
        this.setState({
            backgroundColor: value,
            rgbBackgroundColor: rgbBackgroundColor
        });
        this.updateColorsList(rgbBackgroundColor, rgbForegroundColor);
    };

    clearBackgroundColor = () => {
        const {rgbForegroundColor} = this.state;
        this.setState({
            backgroundColor: '',
            rgbBackgroundColor: [255, 255, 255, 1]
        });
        this.updateColorsList([255, 255, 255, 1], rgbForegroundColor);
    };

    foregroundColorChanged = (event) => {
        const {rgbBackgroundColor} = this.state;
        const {value} = event.target;
        let rgbForegroundColor = colorString.get.rgb(value.trim());
        this.setState({
            foregroundColor: value,
            rgbForegroundColor: rgbForegroundColor
        });
        this.updateColorsList(rgbBackgroundColor, rgbForegroundColor);
    };

    clearForegroundColor = () => {
        const {rgbBackgroundColor} = this.state;
        this.setState({
            foregroundColor: '',
            rgbForegroundColor: [0, 0, 0, 1]
        });
        this.updateColorsList(rgbBackgroundColor, [0, 0, 0, 1]);
    };

    updateColorsList(bgColor, fgColor) {
        if (bgColor == null) {
            bgColor = [255, 255, 255];
        }
        if (fgColor == null) {
            fgColor = [0, 0, 0];
        }

        let colorList = this.findColors(bgColor, fgColor, 10);
        colorList.sort((a, b) => a.absDiff - b.absDiff);

        // Limit to top 25
        this.setState({colors: colorList.slice(0, 25)});
    }

    findDoubleColors(bg, fg, limit) {
        let results = [];

        for (let r = 0; r < 256; r += 17) {
            for (let g = 0; g < 256; g += 17) {
                for (let b = 0; b < 256; b += 17) {
                    for (let a = 0; a < 256; a += 17) {
                        let rgb = [r, g, b];
                        let rgba = [r, g, b, a];
                        let mix = this.mixColors(bg, rgb, a / 255);
                        mix = this.mixColors(mix, rgb, a / 255);
                        let rdiff = fg[0] - mix[0];
                        let gdiff = fg[1] - mix[1];
                        let bdiff = fg[2] - mix[2];
                        let absDiff = Math.abs(rdiff) + Math.abs(gdiff) + Math.abs(bdiff);

                        let rgbaColor = a < 255 ? this.toShortRGBA(rgba) : this.toShortRGB(rgb);

                        if (absDiff < limit) {
                            results.push({
                                rgbaColor: rgbaColor,
                                mixColor: colorString.to.hex(mix),
                                diff: [rdiff, gdiff, bdiff],
                                absDiff: absDiff
                            });
                        }
                    }
                }
            }
        }

        return results;
    }

    findColors(bg, fg, limit) {
        let results = [];
        for (let r = 0; r < 256; r += 17) {
            for (let g = 0; g < 256; g += 17) {
                for (let b = 0; b < 256; b += 17) {
                    for (let a = 0; a < 256; a += 17) {
                        let rgb = [r, g, b];
                        let rgba = [r, g, b, a];
                        let mix = this.mixColors(bg, rgb, a / 255);
                        let rdiff = fg[0] - mix[0];
                        let gdiff = fg[1] - mix[1];
                        let bdiff = fg[2] - mix[2];
                        let absDiff = Math.abs(rdiff) + Math.abs(gdiff) + Math.abs(bdiff);
                        let rgbaColor = a < 255 ? this.toShortRGBA(rgba) : this.toShortRGB(rgb);

                        if (absDiff < limit) {
                            results.push({
                                rgbaColor: rgbaColor,
                                mixColor: colorString.to.hex(mix),
                                diff: [rdiff, gdiff, bdiff],
                                absDiff: absDiff
                            });
                        }
                    }
                }
            }
        }
        return results;
    }

    toShortRGB(color) {
        return `#${hex(color[0])}${hex(color[1])}${hex(color[2])}`;
    }

    toShortRGBA(color) {
        return `#${hex(color[0])}${hex(color[1])}${hex(color[2])}${hex(color[3])}`;
    }

    mixColors(bgColor, fgColor, alpha) {
        let r = Math.floor(bgColor[0] * (1 - alpha) + fgColor[0] * alpha);
        let g = Math.floor(bgColor[1] * (1 - alpha) + fgColor[1] * alpha);
        let b = Math.floor(bgColor[2] * (1 - alpha) + fgColor[2] * alpha);
        return [r, g, b];
    }

    toCssColor(color, fallback) {
        if (!Array.isArray(color) || color.length < 3) {
            return fallback;
        }

        const [r, g, b, a = 1] = color;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    render() {
        const {backgroundColor, foregroundColor, rgbBackgroundColor, rgbForegroundColor, colors} = this.state;
        const backgroundPreviewColor = this.toCssColor(rgbBackgroundColor, DEFAULT_BACKGROUND_COLOR);
        const targetPreviewColor = this.toCssColor(rgbForegroundColor, DEFAULT_FOREGROUND_COLOR);
        return (
            <div>
                <div className="colorInputContainer">
                    <div className="colorInput">
                        <label htmlFor="bgColor">Background</label>
                        <div
                            className="inputColorSwatch"
                            aria-label="Background color preview"
                            style={{"--preview-color": backgroundPreviewColor}}
                        ></div>
                        <input
                            name="bgColor"
                            className="backgroundColor colorInputField"
                            type="text"
                            placeholder={DEFAULT_BACKGROUND_COLOR}
                            value={backgroundColor}
                            onFocus={this.handleFocus}
                            onChange={this.backgroundColorChanged}
                        />
                        {backgroundColor && (
                            <button
                                type="button"
                                aria-label="Clear background color"
                                onClick={this.clearBackgroundColor}
                                className="clearInputBtn"
                            >
                                x
                            </button>
                        )}
                    </div>
                    <div className="colorInput">
                        <label htmlFor="targetColor">Target</label>
                        <div
                            className="inputColorSwatch"
                            aria-label="Target color preview"
                            style={{"--preview-color": targetPreviewColor}}
                        ></div>
                        <input
                            name="targetColor"
                            className="foregroundColor colorInputField"
                            type="text"
                            placeholder={DEFAULT_FOREGROUND_COLOR}
                            value={foregroundColor}
                            onFocus={this.handleFocus}
                            onChange={this.foregroundColorChanged}
                        />
                        {foregroundColor && (
                            <button
                                type="button"
                                aria-label="Clear target color"
                                onClick={this.clearForegroundColor}
                                className="clearInputBtn"
                            >
                                x
                            </button>
                        )}
                    </div>
                </div>

                <div className="colors-list">
                    <div className="color-row header-row">
                        <div className="tHeader">Code</div>
                        <div className="tHeader">Red</div>
                        <div className="tHeader">Green</div>
                        <div className="tHeader">Blue</div>
                        <div className="tHeader">Diff</div>
                    </div>
                    {colors.map((value, index) => {
                        return (
                            <div className="color-row" key={"col_" + index}>
                                <div className="colorItem">
                                    <button
                                        style={{"--color": value.mixColor}}
                                        onClick={this.copyColor}
                                        className="colors-list__color"
                                        type="button"
                                        value={value.rgbaColor}
                                    >
                                        {value.rgbaColor}
                                    </button>
                                </div>
                                <div className="rDiff">{value.diff[0]}</div>
                                <div className="gDiff">{value.diff[1]}</div>
                                <div className="bDiff">{value.diff[2]}</div>
                                <div className="absDiff">{value.absDiff}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default ColorMixer;

