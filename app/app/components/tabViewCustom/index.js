import React, {Component} from 'react';
import {View} from 'react-native';
import ScrollableTabView from "react-native-scrollable-tab-view";
import TabButtonCustom from "../tabButtonCustom";


export default class TabViewCustom extends Component {
    static defaultProps = {
        changeTabCb: function () {
        } //切换tab回调
    }

    changeTabHandle({i, from, ref}) {
        this.props.changeTabCb({i, from, ref});
    }

    render() {
        let {tabNames, children, secondLevelPageId, prerenderingSiblingsNumber} = this.props;
        if (isNaN(prerenderingSiblingsNumber)) {
            prerenderingSiblingsNumber = 1;
        }
        return (
            <View style={{flex:1}}>
            <ScrollableTabView
                style={{flex:1}}
                renderTabBar={() => <TabButtonCustom tabNames={tabNames}/>}
                onChangeTab={
                    (obj) => {
                        this.changeTabHandle.call(this, obj);
                    }
                }
                locked={true}
                initialPage={secondLevelPageId || 0}
                prerenderingSiblingsNumber={prerenderingSiblingsNumber}
            >
                {children}
            </ScrollableTabView>
            </View>
        );
    }
}
