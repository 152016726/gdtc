import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as colorConf from "../../../../constants/color";
import _ from "lodash";
import ScoreScrollView from '../../../../views/scoreDetails/components/scoreScrollView'

let tabOuterHeight = 50;
let tabMarginVertical = 8;

export default class ExponentialDetailsTab extends Component {
    static defaultProps = {
        data: [] //显示的tab数组
    };

    myScrollView;         //scrollView元素
    tabListLayout;        //tab列表的layout
    scrollOffsetY = 0;        //tab列表的滚动高度
    componentDidUpdate() {
        this.goScrollToTabActive();
    }

    /**
     * 滚动到指定的位置
     */
    goScrollToTabActive() {
        let {data, activeCid} = this.props;
        if (data.length === 0) {
            return;
        }
        let index = _.findIndex(data, function (o) {
            return o.cid === activeCid;
        });
        let btnActiveOffsetTop = tabOuterHeight * index + tabMarginVertical;
        if (this.tabListLayout) {
            if (btnActiveOffsetTop - this.scrollOffsetY  > this.tabListLayout.height ||  btnActiveOffsetTop < this.scrollOffsetY ) {
                this.myScrollView.scrollTo({x: 0, y: btnActiveOffsetTop - tabMarginVertical, animated: false});
            }
        }
    }

    /**
     * 点击tab 回调
     */
    pressCbHandle(cid) {
        this.props.pressCb(cid);
    }

    render() {
        let {style, data, activeCid} = this.props;
        return (
            <View style={style}>
                <View style={styles.inner}>
                    <ScoreScrollView
                        scrollHandle={e => {
                            this.scrollOffsetY = e.contentOffset.y;
                        }}
                        onLayout={event => {
                            this.tabListLayout = event.nativeEvent.layout;
                        }}
                        refInnerSV={(view) => {
                            this.myScrollView = view;
                        }}>
                        {
                            data.map((ele, index) =>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.pressCbHandle(ele.cid)
                                    }}
                                    style={[styles.btn, activeCid === ele.cid ? styles.active : null]} key={index}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                        style={[styles.btnText, activeCid === ele.cid ? styles.activeText : null]}>
                                        {ele.companyCnShort}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </ScoreScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inner: {
        flex: 1
    },
    btn: {
        height: tabOuterHeight - 2 * tabMarginVertical,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginVertical: tabMarginVertical,
        paddingHorizontal: 8,
        overflow: 'hidden'
    },
    btnText: {
        color: '#333333',
        fontSize: 13,
    },
    active: {
        backgroundColor: colorConf.MainColor
    },
    activeText: {
        color: '#ffffff'
    }
});
