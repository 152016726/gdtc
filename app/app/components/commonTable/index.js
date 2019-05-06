/**
 * 通用表格组件
 * Created by DDT on 2018/9/6.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView
} from 'react-native';
import {FONT_11, FONT_13} from '../../constants/fontSize';

class CommonTable extends Component {
    constructor(props){
        super(props);
        let dataSource = this.getDataSource(props);
        this.state = { dataSource };
    }

    static defaultProps = {
        header: [],                     //列表头部数据
        data: [],                       //数据列表
        //样式控制
        headerHeight: 30,               //列头高度
        cellHeight: 30,                 //行高度
        backgroundColor: 'transparent', //表格底色
        borderWidth: 0,                 //边框厚度
        borderColor: 'transparent',     //边框颜色
        //
        isExtensible: false,            //是否有扩展行
        isFixHeader: false,             //是否需要固定头部
        listProps: {}                   //自定义list参数
    };

    getDataSource(props) {
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                if(props.isExtensible){
                    return r1.isExtend !== r2.isExtend || r1 !== r2;
                }
                return r1 !== r2
            },
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        return ds.cloneWithRowsAndSections({'data': props.data});
    }


    componentWillReceiveProps(newProps) {
        let dataSource = this.getDataSource(newProps);
        this.setState({ dataSource });
    }

    /**
     * 获取单元默认样式
     * @returns {*}
     */
    getColumnSelfStyle() {
        let { header } = this.props;
        return header.map((item) => {
            return Object.assign({ flex: 1 }, {
                width: item.width
            }, item.style || {});
        });
    }

    /**
     * 表头数据渲染
     * @param sectionData 没使用
     * @param sectionID   没使用
     * @returns {*}
     * @private
     */
    _renderSectionHeader(sectionData, sectionID){
        let { header, backgroundColor, borderWidth, borderColor, headerHeight } = this.props;
        let defStyle = {backgroundColor, borderWidth, borderColor, height: headerHeight};
        let columnSelf = this.getColumnSelfStyle();
        return(
            <View style={styles.body}>
                <View style={styles.headerStyle}>
                    {
                        header && header.map((obj, i) => {
                            return <View key={i} style={[defStyle, styles.headerCellStyle, columnSelf[i]]}>
                                <Text style={styles.headerCellItemStyle}>{obj.text}</Text>
                            </View>;
                        })
                    }
                </View>
            </View>
        )
    }

    /**
     * 行数据渲染
     * @param rowData       行数据
     * @param sectionID     对应sectionId
     * @param rowID         行数，由0开始
     * @param highlightRow  没使用
     * @returns {*}
     * @private
     */
    _renderRow(rowData,sectionID,rowID,highlightRow){
        let { backgroundColor, borderWidth, borderColor, cellHeight } = this.props;
        let defStyle = {backgroundColor, borderWidth, borderColor, height: cellHeight};
        let columnSelf = this.getColumnSelfStyle();
        let row = [];
        if(rowData instanceof Array){
            row = rowData;
        }else{
            row = rowData.row;
        }
        let rowDom = (
            <View style={styles.rowDataStyle}>
                {
                    row.map((item, i) => {
                        return <View key={i} style={[defStyle, styles.rowItemStyle, columnSelf[i]]}>
                            {
                                item.text && <Text style={[styles.rowCellStyle, item.cellStyle || {}]}>{item.text}</Text>
                            }
                            {
                                item.render && item.render(rowData, rowID)
                            }
                        </View>
                    })
                }
            </View>
        );
        // 扩展内容输出，相当于子行
        if(rowData.extendRender){
            return <View style={{flex: 1}}>
                {rowDom}
                {rowData.extendRender(rowData, rowID)}
            </View>
        }else{
            return rowDom;
        }
    }

    render(){
        let {isFixHeader, listProps} = this.props;
        let listViewProps = {
            style: styles.body,
            dataSource: this.state.dataSource,
            renderRow: this._renderRow.bind(this),
            enableEmptySections: true
        };
        if(isFixHeader){
            Object.assign(listViewProps, {
                renderSectionHeader: this._renderSectionHeader.bind(this)
            })
        }else{
            Object.assign(listViewProps, {
                renderHeader: this._renderSectionHeader.bind(this)
            })
        }

        return (
            <ListView {...Object.assign(listViewProps, listProps)}/>

        )
    }
}

const styles = StyleSheet.create({
    body:{
        flex:1
    },
    headerStyle: {
        width: '100%',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },
    headerCellStyle: {
        alignItems:'center',
        justifyContent:'center',
        borderLeftWidth: 0
    },
    headerCellItemStyle: {
        color: '#666666',
        fontSize: FONT_13
    },
    rowDataStyle: {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    rowItemStyle: {
        justifyContent:'center',
        alignItems:'center',
        borderTopWidth: 0,
        borderLeftWidth: 0
    },
    rowCellStyle: {
        color: '#333333',
        fontSize: FONT_13
    }
});

export default CommonTable;