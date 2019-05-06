import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import _ from 'lodash';
import PlayerCycle from "../playerCycle";

export default class Lineup extends Component {
    static defaultProps = {
        lineupFormat: {}     //阵型对象
    };

    /**
     * 渲染主客阵型列表
     * @returns {any[]}
     */
    renderPlayers() {
        const {lineupFormat, awayLineCfg, homeLineCfg,} = this.props;
        return _.keys(lineupFormat).map((team, i) => {
            let cfg, heightStyle;
            let isHome = team === 'home';
            let players = lineupFormat[team];
            if (isHome) {
                heightStyle = {height: (1 / homeLineCfg.length) * 100 + '%'};
                cfg = homeLineCfg
            } else {
                heightStyle = {height: (1 / awayLineCfg.length) * 100 + '%'};
                cfg = awayLineCfg;
            }
            return (
                <View key={i} style={[styles.teamCt, isHome ? styles.homePos : styles.awayPos]}>
                    {
                        cfg.map((line, k) => {
                            let len = line.length;
                            return <View key={k}
                                         style={[heightStyle, styles.outerContent]}>
                                {
                                    line.map((type, i) => {
                                        return <View key={i} style={[{width: (1 / len) * 100 + '%'}, styles.lineInner]}>
                                            {
                                                players && players.map((player, j) => {
                                                    let posStr = `${player.positionX}-${player.positionY}`;
                                                    return type === posStr ?
                                                        <PlayerCycle key={j} {...player} isHome={isHome}/> :
                                                        <View key={j}></View>
                                                })
                                            }
                                        </View>
                                    })
                                }
                            </View>
                        })
                    }
                </View>
            )
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('./images/playground.png')} style={styles.playground} resizeMode="contain"/>
                <View style={styles.lineupCt}>
                    {this.renderPlayers()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: 'relative'
    },
    playground: {
        width: '100%',
        height: 560
    },
    lineupCt: {
        width: '100%',
        height: 560,
        position: 'absolute',
        paddingHorizontal: 27,
        paddingVertical: 10,
        top: 0,
        left: 0,
    },
    teamCt: {
        width: '100%',
        flexDirection: 'column',
        flexWrap: 'wrap',
        left: 27,
        height: 260
    },
    outerContent: {
        width: '100%',
        flexDirection: 'row'
    },
    lineInner: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'flex-start'
    },
    homePos: {
        position: 'absolute',
        top: 10
    },
    awayPos: {
        position: 'absolute',
        top: 290
    },
    playerInfo: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        marginBottom: 10
    }
});