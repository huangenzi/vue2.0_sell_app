import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const setPosition = 'setPosition';
const drop = 'drop';
const restDropBalls = 'restDropBalls';

const setSelectType = 'setSelectType';
const setOnlyContent = 'setOnlyContent';

//    const POSITIVE = 0;
//    const NEGATIVE = 1;
const ALL = 2;

const state = {
    ballOriginalPosition: 1,
    balls: [
        {
            show: false,
            isBusy: false
        },
        {
            show: false,
            isBusy: false
        },
        {
            show: false,
            isBusy: false
        },
        {
            show: false,
            isBusy: false
        },
        {
            show: false,
            isBusy: false
        }
    ],
    selectType: ALL,
    onlyContent: false
};
const mutations = {
    [setPosition](state, position) {
        state.ballOriginalPosition = position;
    },
    [drop](state, el) {
        for (let i = 0; i < state.balls.length; i++) {
            let ball = state.balls[i];
            if (!ball.isBusy) {
                ball.show = true;
                ball.isBusy = true;
                ball.el = el;
                return;
            }
        }
    },
    [setSelectType](state, type) {
        state.selectType = type;
    },
    [setOnlyContent](state, onlyContent) {
        state.onlyContent = onlyContent;
    }
};
const actions = {
    [setPosition]({commit}, {position}) {
        commit('setPosition', position);
    },
    [drop]({commit}, {el}) {
        commit('drop', el);
    },
    [restDropBalls]({commit}, {el}) {
        commit('restDropBalls', el);
    },
    [setSelectType]({commit}, {type}) {
        commit('setSelectType', type);
    },
    [setOnlyContent]({commit}, {onlyContent}) {
        commit('setOnlyContent', onlyContent);
    }
};
const getters = {};
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});
