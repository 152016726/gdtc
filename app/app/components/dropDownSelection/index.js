/**
 * Created by easyLottoMac_Feng on 2019/1/4.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Animated,
    ScrollView,
    Dimensions,
    PixelRatio,
    Text,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
    ART,
    View
} from 'react-native';
import {BorderColor, MainColor, contentText} from "~/constants/color";
import {FONT_14} from "~/constants/fontSize";

const {Surface, Shape, Path, Group} = ART;

const {width, height} = Dimensions.get('window');
const T_WIDTH = 7;
const T_HEIGHT = 4;
const COLOR_HIGH = MainColor;   // 选中的状态颜色
const COLOR_NORMAL = contentText;
const LINE = 1 / PixelRatio.get();

// title 标题的箭头
class Triangle extends Component {
    render() {
        let path;
        let fill;
        if (this.props.selected) {
            fill = COLOR_HIGH;
            path = new Path()
                .moveTo(T_WIDTH / 2, 0)
                .lineTo(0, T_HEIGHT)
                .lineTo(T_WIDTH, T_HEIGHT)
                .close();
        } else {
            fill = COLOR_NORMAL;
            path = new Path()
                .moveTo(0, 0)
                .lineTo(T_WIDTH, 0)
                .lineTo(T_WIDTH / 2, T_HEIGHT)
                .close();
        }

        return (
            <Surface width={T_WIDTH} height={T_HEIGHT}>
                <Shape
                    d={path}
                    stroke="#00000000"
                    fill={fill}
                    strokeWidth={0}/>
            </Surface>
        )
    }
}

// 勾选中的符号
class Check extends Component {
    render() {
        return (
            <Surface
                width={18}
                height={12}
            >
                <Group scale={0.03}>
                    <Shape
                        fill={COLOR_HIGH}
                        d={`M494,
                            52c-13-13-33-13-46,
                            0L176,
                            324L62,
                            211c-13-13-33-13-46,
                            0s-13,33,0,46l137,
                            136c6,6,15,10,23,
                            10s17-4,23-10L494,99
                            C507,86,507,65,494,52z`
                        }
                    />
                </Group>
            </Surface>
        )
    }
}

export default class DropDownSelection extends Component {

    constructor(props) {
        super(props);
        let array = props.selectList;
        let top = [];
        let maxHeight = [];
        let subSelected = [];
        let height = [];
        //最大高度
        let max = parseInt((height - 80) * 0.8 / 43);
        for (let i = 0, c = array.length; i < c; ++i) {
            let item = array[i];
            top[i] = item.data[item.selectedIndex].title;
            maxHeight[i] = Math.min(item.data.length, max) * 43;
            subSelected[i] = item.selectedIndex;
            height[i] = new Animated.Value(0);
        }
        //分析数据
        this.state = {
            top: top,
            maxHeight: maxHeight,
            subSelected: subSelected,
            height: height,
            fadeInOpacity: new Animated.Value(0),
            selectedIndex: null
        };
    }

    createAnimation(index, height) {
        return Animated.timing(
            this.state.height[index],
            {
                toValue: height,
                duration: 200
            }
        );
    };

    createFade(value) {
        return Animated.timing(
            this.state.fadeInOpacity,
            {
                toValue: value,
                duration: 200,
            }
        );
    };

    /**
     * 标题点击事件
     * @param index
     */
    onSelect(index) {
        if (index === this.state.selectedIndex) {
            //消失
            this.hide(index);
        } else {
            this.setState({selectedIndex: index, current: index});
            this.onShow(index);
        }
    };

    /**
     * 隐藏弹窗
     * @param index
     * @param subSelected
     */
    hide(index, subSelected) {
        let opts = {selectedIndex: null, current: index};
        if (subSelected !== undefined) {
            this.state.subSelected[index] = subSelected;
            this.state.top[index] = this.props.selectList[index].data[subSelected].title;
            opts = {selectedIndex: null, current: index, subSelected: this.state.subSelected.concat()};
        }
        this.setState(opts);
        this.onHide(index);
    };

    /**
     * 显示弹窗
     * @param index
     */
    onShow(index) {
        Animated.parallel([this.createAnimation(index, this.state.maxHeight[index]), this.createFade(1)]).start();
    };

    /**
     * 隐藏其他弹窗
     * @param index
     */
    onHide(index) {
        //其他的设置为0
        for (let i = 0, c = this.state.height.length; i < c; ++i) {
            if (index !== i) {
                this.state.height[i].setValue(0);
            }
        }
        Animated.parallel([this.createAnimation(index, 0), this.createFade(0)]).start();
    };

    /**
     * 筛选列表选中事件
     * @param index     所属的筛选分组索引
     * @param subIndex  分组内的索引
     * @param data      选中的内容信息
     */
    onSelectMenu(index, subIndex, data) {
        let {selectHandle, onSelectMenu} = this.props;
        this.hide(index, subIndex);
        onSelectMenu && onSelectMenu(index, subIndex, data);
        // 父组件回调
        selectHandle && selectHandle(data)
    };

    /**
     * 标题头部渲染
     * @param label
     * @param index
     * @param selected
     * @returns {*}
     */
    renderTopMenuItem(label, index, selected) {
        return (
            <TouchableWithoutFeedback
                onPress={() => this.onSelect(index)}
                key={index}>
                <View style={index === 1 ? styles.paddingItem : styles.item}>
                    <Text style={selected ? styles.menuTextHigh : styles.menuText}>{label}</Text>
                    <Triangle selected={selected}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    /**
     * 筛选列的数据
     * @param data
     * @param subIndex
     * @param selected
     * @param index
     * @returns {*}
     */
    renderListItem(data, subIndex, selected, index) {
        let textStyle = selected ?
            [styles.tableItemText, styles.highlight] :
            [styles.tableItemText];
        return (
            <TouchableHighlight
                onPress={() => this.onSelectMenu(index, subIndex, data)}
                underlayColor="#f5f5f5"
                key={subIndex}>
                <View style={styles.titleItem}>
                    <Text style={textStyle}>{data.title}</Text>
                    {selected && <Check/>}
                </View>
            </TouchableHighlight>
        )
    }

    /**
     * 下拉列表模块
     * @param d
     * @param index
     * @returns {*}
     */
    renderList(d, index) {
        let subSelected = this.state.subSelected[index];
        let enabled = this.state.selectedIndex === index || this.state.current === index;
        return (
            <Animated.View
                key={index}
                pointerEvents={enabled ? 'auto' : 'none'}
                style={[
                    styles.content,
                    {
                        opacity: enabled ? 1 : 0,
                        height: this.state.height[index]
                    }
                ]}>
                <ScrollView
                    style={styles.scroll}
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}>
                    {d.data.map((data, subIndex) => {
                        let selected = subSelected === subIndex;
                        return this.renderListItem(data, subIndex, selected, index)
                    })}
                </ScrollView>
            </Animated.View>
        );
    };

    render() {
        const {selectList, renderContent, rightRenderContent} = this.props;
        const {top, selectedIndex, fadeInOpacity} = this.state;
        return (
            <View style={{flex: 1}}>
                <View style={styles.MenuTitleBox}>
                    <View style={styles.MenuLeftTitleBox}>
                        <View style={styles.topMenu}>
                            {top.map((t, index) => {
                                let selected = selectedIndex === index;
                                return this.renderTopMenuItem(t, index, selected)
                            })}
                        </View>
                    </View>
                    {
                        rightRenderContent &&
                        <View style={styles.MenuRightTitleBox}>
                            {rightRenderContent()}
                        </View>
                    }

                </View>
                <View style={styles.bgContainer}
                      pointerEvents={selectedIndex !== null ? "auto" : "none"}>
                    <Animated.View style={[styles.bg, {opacity: fadeInOpacity}]}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{flex: 1}}
                            onPress={() => this.onSelect(selectedIndex)}/>
                    </Animated.View>
                    {selectList.map((d, index) => {
                        return this.renderList(d, index);
                    })}
                </View>
                {renderContent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    bgContainer: {
        position: 'absolute',
        top: 39,
        width: width,
        height: height,
        zIndex: 999
    },
    bg: {
        flex: 1,
        backgroundColor: 'rgba(50,50,50,0.2)'
    },
    MenuTitleBox: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: BorderColor,
        paddingVertical: 5
    },
    MenuLeftTitleBox: {
        flex: 4,
        borderRightWidth: 1,
        borderColor: BorderColor
    },
    MenuRightTitleBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        position: 'absolute',
        width: width
    },
    highlight: {
        color: COLOR_HIGH
    },
    marginHigh: {
        marginLeft: 10
    },
    margin: {
        marginLeft: 28
    },
    titleItem: {
        height: 42,
        alignItems: 'center',
        paddingRight: 12,
        marginLeft: 12,
        borderBottomWidth: LINE,
        borderBottomColor: BorderColor,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tableItemText: {
        fontSize: 14,
        color: contentText
    },
    row: {
        flexDirection: 'row'
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingLeft: 12
        justifyContent: 'center',
    },
    paddingItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        // justifyContent: 'center',
    },
    menuTextHigh: {
        marginRight: 3,
        fontSize: FONT_14,
        color: COLOR_HIGH
    },
    menuText: {
        marginRight: 3,
        fontSize: FONT_14,
        color: COLOR_NORMAL
    },
    topMenu: {
        flexDirection: 'row',
        height: 26
    },
});