<template>
    <div class="shopcart">
        <div class="content">
            <div class="content-left" @click="toggleList">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">¥{{totalPrice}}</div>
                <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click="pay">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
            <div class="ball-container">
                <transition-group name="drop" class="aa"
                                  v-on:before-enter="beforeEnter"
                                  v-on:enter="enter"
                                  v-on:after-enter="afterEnter"
                                  v-on:leave="leave"
                                  v-on:after-leave="afterLeave"
                >
                    <div key="{{index}}" :data-index="index" class="ball" v-for="(ball,index) in balls"
                         v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition-group>
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food" v-for="food in selectFoods">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>¥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" @click="hideList" v-show="listShow"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions} from 'vuex';
    import BScroll from 'better-scroll';
    import cartcontrol from 'components/cartcontrol/cartcontrol';

    export default{
        props: {
            selectFoods: {
                type: Array,
                default() {
                    return [];
                }
            },
            deliveryPrice: {
                type: Number
            },
            minPrice: {
                type: Number
            }
        },
        data() {
            return {
                fold: true
            };
        },
        created() {
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `¥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差¥${diff}元起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            },
            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                } else {
                    let show = !this.fold;
                    if (show) {
                        if (!this.scroll) {
                            this.$nextTick(() => {
                                console.log(this.$refs.listContent);
                                this.scroll = new BScroll(this.$refs.listContent, {
                                    click: true
                                });
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    }
                    return show;
                }
            },
            ...mapState({
                balls: state => state.balls,
                dropBalls: state => state.dropBalls
            })
        },
        methods: {
            ...mapActions({
                drop: 'drop'
            }),
            beforeEnter(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - (window.innerHeight - rect.top - 22));
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
            },
            enter(el) {
                /* eslint-disable no-unused-vars */
                let ff = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                });
            },
            leave (el) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                });
            },
            afterLeave (el) {
                let ball = this.balls[el.getAttribute('data-index')];
                if (ball) {
                    ball.isBusy = false;
                    el.style.display = 'none';
                }
            },
            afterEnter(el) {
                let ball = this.balls[el.getAttribute('data-index')];
                if (ball) {
                    ball.show = false;
                    setTimeout(() => {
                        el.style.display = 'none';
                    }, 400);
                }
            },
            toggleList() {
                if (!this.totalCount) {
                    return;
                }
                this.fold = !this.fold;
            },
            hideList() {
                this.fold = true;
            },
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            pay() {
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                window.alert(`支付${this.totalPrice}元`);
            }
        },
        components: {
            cartcontrol
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";

    .shopcart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        background: #000
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255, 255, 255, 0.4)
            .content-left
                flex: 1
                position: relative
                z-index: 60
                .logo-wrapper
                    display: inline-block
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    vertical-align: top
                    box-sizing: border-box
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        text-align: center
                        background: #2b343c
                        &.highlight
                            background: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height: 44px
                            font-size: 24px
                            color: #80858a
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        background: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    font-size: 16px
                    font-weight: 700
                    &.highlight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    background: #2b333b
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff

            .ball-container
                .ball
                    position: fixed
                    left: 32px
                    bottom: 22px
                    z-index: 200
                    transition: all .4s cubic-bezier(.49, -0.29, 0.75, 0.41)
                    .inner, inner2
                        width: 16px
                        height: 16px
                        border-radius: 50%
                        background: rgb(0, 160, 220)
                        transition: all .4s linear
            .shopcart-list
                position: absolute
                left: 0
                top: 0
                z-index: -1
                width: 100%
                transition: all 0.5s
                transform: translate3d(0, -100%, 0)
                &.fold-enter, &.fold-leave-active
                    transform: translate3d(0, 0, 0)
                .list-header
                    height: 40px
                    line-height: 40px
                    padding: 0 18px
                    background: #f3f5f7
                    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                    .title
                        float: left
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .empty
                        float: right
                        font-size: 12px
                        color: rgb(0, 160, 220)
                .list-content
                    padding: 0 18px
                    max-height: 217px
                    overflow: hidden
                    background: #fff
                    .food
                        font-size: 12px
                        color: #000
                        position: relative
                        padding: 12px 0
                        box-sizing: border-box
                        border-1px(rgba(7, 17, 27, 0.1))
                        .name
                            line-height: 24px
                            font-size: 14px
                            color: rgb(7, 17, 27)
                        .price
                            position: absolute
                            right: 90px
                            bottom: 12px
                            line-height: 24px
                            font-size: 14px
                            font-weight: 700
                            color: rgb(240, 20, 20)
                        .cartcontrol-wrapper
                            position: absolute
                            right: 0
                            bottom: 6px


        .list-mask
            position: fixed
            left: 0
            top: 0
            width: 100%
            height: 100%
            z-index: -60
            background-filter: blur(10px)
            background: rgba(7,17,27,0.6)
            transition: all 0.5s
            &.fade-enter, &.fade-leave-active
                opacity: 0

</style>
