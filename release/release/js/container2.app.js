webpackJsonp([5],{

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_History_vue__ = __webpack_require__(383);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2d0c09be_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_History_vue__ = __webpack_require__(394);
function injectStyle (ssrContext) {
  __webpack_require__(392)
}
var normalizeComponent = __webpack_require__(62)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_History_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2d0c09be_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_History_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 383:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_defineProperty__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(63);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { __WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_defineProperty___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var cash, YEAR;
/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'History',
  data: function data() {
    return {
      filterTemp: this.getYear()
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread({}, Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["c" /* mapState */])({
    isLoading: function isLoading(state) {
      return state.ready;
    },
    users: function users(state) {
      return state.bookList.users;
    },
    history: function history(state) {
      return state.bookList.history;
    }
  })), Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["b" /* mapGetters */])({
    filter: 'bookList/filterYear'
  })), {}, {
    rangeYear: function rangeYear() {
      var y = this.getYear(),
          temp = [];

      for (var i = 0; i < 3; i++) {
        temp.push(y - i);
      }

      return temp;
    },
    fetchData: function fetchData() {
      // data reload
      if (cash) {
        cash = 1000000;
      }

      return this.filter(this.filterTemp);
    }
  }),
  created: function created() {
    this.$run('bookList/getHistory');
  },
  methods: {
    getTemplate: function getTemplate(list) {
      var size = Object.keys(list).length,
          template2 = '책목록<br>',
          cnt = 0;

      for (var item in list) {
        var _list$item = list[item],
            name = _list$item.name,
            price = _list$item.price,
            refUrl = _list$item.refUrl;
        var nPrice = price.split(',');
        nPrice = nPrice.join('');
        cnt = cnt + Number(nPrice);
        template2 += "<div><a href=\"" + refUrl + "\" target=\"_blank\">" + name + "</a> /  " + price + "</div>";
      }

      var template1 = "\n        \uC608\uC0B0 \uD488\uC758\uC11C \uC2E0\uCCAD \uC591\uC2DD(\uACBD\uBE44\uC131) <br/><br/>\n\n        1. \uAD6C\uB9E4\uBAA9\uC801: UI\uAC1C\uBC1C\uD300 \uC5ED\uB7C9\uAC15\uD654  <br/>\n        2. \uB3C4\uC11C\uBAA9\uB85D: \uCD1D " + size + "\uAD8C (\uD558\uB2E8 \uC81C\uBAA9 \uB098\uC5F4)  <br/>\n        3. \uAD6C\uC785\uCC98: \uC54C\uB77C\uB518 (aladdin.co.kr)  <br/>\n        4. \uCD1D \uAE08\uC561 \uBC0F \uACB0\uC81C\uC218\uB2E8 : \uCD1D " + cnt + "\uC6D0 (\uBC95\uC778\uCE74\uB4DC \uC0AC\uC6A9)  <br/>\n        5. \uC608\uC0B0\uACC4\uC815 : \uB3C4\uC11C\uBE44  <br/>\n        6. \uC608\uC0B0\uB0B4\uC5ED : 2019\uB144 \uACBD\uC601\uACC4\uD68D\uC0C1 \uCC45\uC815\uB41C UI\uAC1C\uBC1C\uD300 \uB3C4\uC11C\uBE44 (\uC5F0\uAC04 100\uB9CC\uC6D0) \uC608\uC0B0\uC5D0\uC11C \uC0AC\uC6A9  <br/><br/><br/>\n      ";
      this.$run('dialogAlert', {
        message: template1 + template2
      });
    },
    getYear: function getYear() {
      var currentDate = new Date();
      return currentDate.getFullYear();
    },
    getCash: function getCash(item, month) {
      if (YEAR !== month.substr(0, 4)) {
        cash = 1000000; // 도서 년간 예산
      }

      YEAR = month.substr(0, 4);

      for (var i in item) {
        var m = item[i].price;
        m = m.split(',');
        m = m.join('');
        cash = cash - Number(m);
      }

      return cash;
    }
  }
});

/***/ }),

/***/ 392:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(393);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(29)("6176b258", content, true, {});

/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(28)(false);
// imports


// module
exports.push([module.i, "#history .option{width:95%;margin:20px auto 0;box-sizing:border-box}#history .option .md-field{margin-bottom:0}#history .date{margin-left:10px}#history .date .md-icon{margin-right:10px;color:#000}#history td,#history th{text-align:left}#history .item-wrap{position:relative;padding-top:10px}#history .md-table-content{border-top:1px solid #ccc;border-bottom:1px solid #ccc}#history .total{position:absolute;right:10px;top:45px;font-size:12px;padding-right:30px}#history .total .md-list-action{position:absolute;right:-15px;top:-10px}#history .cell1 .md-table-cell-container,#history .th1{padding-left:20px}#history .cell2,#history .cell3{width:60px;text-align:center}#history .thumbs{padding-left:40px;position:relative}#history .thumbs .md-avatar{position:absolute;left:10px;top:50%;margin-top:-20px;border:1px solid #efefef}#history .thumbs .name{font-size:14px;font-weight:700;margin:5px 0 3px}#history .thumbs .desc{font-size:12px;color:#999;margin-bottom:5px}#history .md-table-head-container{height:46px;padding:10px 0}#history .md-table-cell-container{padding:6px 0}#history .md-table-head-label{font-size:14px;color:#000;font-weight:700;padding-left:0;padding-right:0}", ""]);

// exports


/***/ }),

/***/ 394:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"history"}},[(_vm.isLoading)?_c('div',{staticClass:"wrap-center"},[_c('md-progress-spinner',{attrs:{"md-diameter":50,"md-mode":"indeterminate"}})],1):_c('div',[_c('div',{staticClass:"option"},[_c('md-field',{staticClass:"filter"},[_c('label',{attrs:{"for":"filter"}},[_vm._v("년도별 신청 내역 보기")]),_vm._v(" "),_c('md-select',{attrs:{"name":"filter","id":"filter"},model:{value:(_vm.filterTemp),callback:function ($$v) {_vm.filterTemp=$$v},expression:"filterTemp"}},[_c('md-option',{attrs:{"value":"all"}},[_vm._v("전체보기")]),_vm._v(" "),_vm._l((_vm.rangeYear),function(i){return _c('md-option',{key:("year" + i),attrs:{"value":i}},[_vm._v(_vm._s(i))])}),_vm._v(" "),_c('md-option',{attrs:{"value":"old"}},[_vm._v("이전 도서")])],2)],1)],1),_vm._v(" "),(_vm.fetchData === null)?_c('div',{staticClass:"md-empty-state-wrap"},[_c('md-empty-state',{staticClass:"md-primary",attrs:{"md-icon":"sentiment_dissatisfied","md-label":"Nothing in Done","md-description":"신청한 도서 목록 없음"}})],1):_vm._l((_vm.fetchData),function(items,key){return _c('div',{key:key,staticClass:"item-wrap"},[_c('h3',{staticClass:"date"},[_c('md-icon',[_vm._v("local_offer")]),_vm._v(_vm._s(key === 'old' ? '이전 도서 신청 내역' : (key + "월 도서 신청 내역")))],1),_vm._v(" "),(key !== 'old')?_c('div',{staticClass:"total"},[_vm._v("\n        남은 예산: "+_vm._s(_vm.getCash(items, key))+"\n        "),_c('md-button',{staticClass:"md-icon-button md-list-action",on:{"click":function($event){return _vm.getTemplate(items)}}},[_c('md-icon',{staticClass:"md-primary"},[_vm._v("get_app")])],1)],1):_vm._e(),_vm._v(" "),_c('md-table',[_c('md-table-row',[_c('md-table-head',{staticClass:"cell1 th1",attrs:{"md-numeric":""}},[_vm._v("도서명")]),_vm._v(" "),_c('md-table-head',{staticClass:"cell2 th2"},[_vm._v("신청자")]),_vm._v(" "),_c('md-table-head',{staticClass:"cell3 th3"},[_vm._v("가격")])],1),_vm._v(" "),_vm._l((items),function(data,uniq){return _c('md-table-row',{key:uniq},[_c('md-table-cell',{staticClass:"thumbs cell1"},[_c('md-avatar',[_c('img',{attrs:{"src":data.thumb,"alt":"People"}})]),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(data.name))]),_vm._v(" "),_c('div',{staticClass:"desc"},[_vm._v(_vm._s(data.desc))])],1),_vm._v(" "),_c('md-table-cell',{staticClass:"cell2"},[_vm._v(_vm._s(_vm.users[data.uid].displayName))]),_vm._v(" "),_c('md-table-cell',{staticClass:"cell3"},[_vm._v(_vm._s(data.price))])],1)})],2)],1)})],2)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});
//# sourceMappingURL=container2.app.js.map