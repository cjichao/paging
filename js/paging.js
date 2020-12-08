;
(function(global, factory) {
	"use strict";
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = global.document ?
			factory(global, true) :
			function(w) {
				if (!w.document) {
					throw new Error("Page requires a window with a document");
				}
				return factory(w);
			};
	} else {
		factory(global);
	}
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
	function Page(options) {
		options = options || {};
		this.el = options.el;
		this.nums = options.nums; //数据总条数
		this.counts = options.counts || 10; //每页数据条数
		this.parent = document.querySelector(this.el);
		this.parent.classList.add('page-elem-field-root');
		this.parentNode = document.createElement('div');
		this.parent.appendChild(this.parentNode);
		this.defaultPage = Number(options.defaultPage) || 1;
		// this.last = this.nums % this.counts;
		// this.pages = parseInt(this.nums / this.counts);
		this.jumpToOrder = !!options.jumpToOrder; // 是否显示跳转到指定页
		this.showNowAndAll = !!options.showNowAndAll; // 显示当前第几页，共几页
		this.showHeadFoot = !!options.showHeadFoot;
		this.head = options.head || '首页';
		this.foot = options.foot || '尾页';

		this.prev = '«';
		this.next = '»';

		this.headfoot = [];
		// if (this.last != 0) {
		// 	this.pages++;
		// }
		this.div = options.div || 'div';
		this.domList = [];
		this.showDomList = [];
		var that = this;

		function noop() {
			if (options.clickEvent && typeof options.clickEvent == 'function') {
				options.clickEvent(that.currect, that);
			}
		}
		this.clickEvent = noop;
		this.init();
	}

	Page.prototype = {
		init: function() {
			this.setPages();
			this.createDom();
			this.showDom();
			// 监听当前页的数字变化
			this.watcherCurrect();
			this.watcherPages();
			this.watcherNums();
			this.watcherCounts();
			this.addDom();
			this.reanderHeadFoot();
			this.jumpToOrderPage();
			this.showNowAndAllPage();
		},
		setPages: function() {
			this.last = this.nums % this.counts;
			this.pages = parseInt(this.nums / this.counts);
			if (this.last != 0) {
				this.pages++;
			}
		},
		showNowAndAllPage: function() {
			if (this.showNowAndAll) {
				var pagesbox = document.createElement('div');
				var allPages = document.createElement('div');
				var currectPage = document.createElement('div');
				var line = document.createElement('div');
				pagesbox.classList.add('pagesbox');
				allPages.classList.add('allPages');
				currectPage.classList.add('currectPage');
				line.classList.add('line');
				currectPage.innerText = this.currect;
				allPages.innerText = this.pages;
				line.innerText = '/';
				pagesbox.appendChild(currectPage);
				pagesbox.appendChild(line);
				pagesbox.appendChild(allPages);
				this.parent.appendChild(pagesbox);
				this.showNowAndAllPageDom = {
					pagesbox: pagesbox,
					allPages: allPages,
					currectPage: currectPage,
					line: line
				};
			}
		},
		jumpToOrderPage: function() {
			if (this.jumpToOrder) {
				var toPage = document.createElement('div');
				var inputBox = document.createElement('div');
				var input = document.createElement('input');
				// var showInputVal = document.createElement('div');
				toPage.classList.add('toPage');
				inputBox.classList.add('inputBox');
				input.classList.add('inputborder');
				input.type = 'text';
				input.value = this.currect;
				// showInputVal.innerText = this.currect;
				// showInputVal.classList.add('show-val');
				this.addEventForInput(input);
				inputBox.appendChild(input);
				// inputBox.appendChild(showInputVal);
				toPage.appendChild(inputBox);
				this.parent.appendChild(toPage);
				this.jumpToOrderPageDom = {
					toPage: toPage,
					input: input,
					inputBox: inputBox
				};
			}
		},
		addEventForInput: function(input, showInputVal) {
			var that = this;
			// input.addEventListener('input', function(e) {
			// 	var value = e.target.value;
			// 	showInputVal.innerText = value;

			// })
			input.addEventListener('change', function(e) {
				var value = e.target.value;
				console.log(that.pages)
				if (value > that.pages) {
					value = that.pages;
				} else if (value < 1) {
					value = 1;
				}
				that.currect = value;
				this.value = value;
				// showInputVal.innerText = value;
			})
		},
		updateCurrectAndOrderBox: function(val) {
			if (this.jumpToOrder) {
				this.jumpToOrderPageDom.input.value = val;
			}
			if (this.showNowAndAll) {
				this.showNowAndAllPageDom.currectPage.innerText = val;
			}
		},
		reanderHeadFoot: function() {
			if (!this.showHeadFoot) {
				return;
			}
			this.headfoot = [];
			var div = this.div;
			var head = document.createElement(div);
			var foot = document.createElement(div);
			head.innerHTML = this.head;
			head.classList.add('item');
			head.classList.add('head');
			foot.innerHTML = this.foot;
			foot.classList.add('item');
			foot.classList.add('foot');
			this.headfoot.push(head);
			this.headfoot.push(foot);
			this.parentNode.insertBefore(head, this.parentNode.firstChild);
			this.parentNode.appendChild(foot);
			this.addEventHeadFoot();
			this.headFootDisable();
		},
		headFootDisable: function() {
			if (this.currect === 1) {
				this.headfoot[0].classList.add('item-disable');
			}
			if (this.currect === this.pages) {
				this.headfoot[1].classList.add('item-disable');
			}
		},
		addEventHeadFoot: function() {
			var that = this;
			this.headfoot[0].addEventListener('click', function() {
				if (that.currect != 1) {
					that.currect = 1;
				}
			});
			this.headfoot[1].addEventListener('click', function() {
				if (that.currect != that.pages) {
					console.log(1111)
					that.currect = that.pages;
				}
			});
		},
		createDom: function() {
			var div = this.div;
			var domList = this.domList = [];
			var prev = document.createElement(div);
			var next = document.createElement(div);
			prev.innerHTML = this.prev;
			prev.classList.add('item');
			next.innerHTML = this.next;
			next.classList.add('item');
			domList[0] = prev;
			var pages = this.pages;
			for (var i = 0; i < pages; i++) {
				var item = document.createElement(div);
				item.classList.add('item');
				item.innerHTML = i + 1;
				domList[i + 1] = item;
			}
			domList.push(next);
			return domList;
		},
		showDom: function() {
			var domList = this.domList;
			var len = domList.length;
			var list = this.showDomList = [];
			var defaultPage = this.defaultPage;
			if (len <= 12) {
				for (var i = 0; i < len; i++) {
					list[i] = domList[i];
				}
			} else {
				var offset = defaultPage - 6 < 0 ? 0 : defaultPage - 6;
				var cha = this.pages - defaultPage;
				if (cha < 5) {
					offset = this.pages - 10;
				}
				list[0] = domList[0];
				for (var i = 1; i < 11; i++) {
					list[i] = domList[i + offset];
				}
				list[i] = domList[len - 1];
			}
			return list;
		},
		addDom: function() {
			this.parentNode.innerHTML = '';
			this.parentNode.classList.add('page-elem-field');
			this.addAndRemoveClass();
			this.addEvent();
			var fgDom = document.createDocumentFragment();
			var showDomList = this.showDomList;
			var len = showDomList.length;
			for (var i = 0; i < len; i++) {
				fgDom.appendChild(showDomList[i]);
			}
			this.parentNode.appendChild(fgDom);
		},
		addEvent: function() {
			var domList = this.domList;
			var len = domList.length;
			for (var i = 0; i < len; i++) {
				domList[i].addEventListener('click', this.jump.bind(domList[i], this));
			}
		},
		jump: function jump(p) {
			var thispage = this.innerHTML;
			if ((thispage == p.prev && p.currect == 1) ||
				(thispage == p.next && p.currect == p.pages) ||
				(thispage == p.currect)) {
				return;
			}
			if (thispage == p.prev && p.currect > 1) {
				p.currect--;
			} else if (thispage == p.next && p.currect < p.pages) {
				p.currect++;
			} else if (thispage != p.prev && thispage != p.next) {
				p.currect = Number(thispage);
			}
		},
		addAndRemoveClass: function() {
			var domList = this.domList;
			if (this.currect === 1) {
				domList[0].classList.add('item-disable');
			}
			if (this.currect === this.pages) {
				domList[domList.length - 1].classList.add('item-disable');
			}
			domList[this.currect].classList.add('active');
		},
		activeCurrectItem: function(val) {
			var domList = this.domList;
			domList[val].classList.add('active');
			domList[0].classList.remove('item-disable');
			domList[domList.length - 1].classList.remove('item-disable');
			if (this.showHeadFoot) {
				this.headfoot[0].classList.remove('item-disable');
				this.headfoot[1].classList.remove('item-disable');
			}
			if (val == 1) {
				// 第一页就显示禁止的图标
				domList[0].classList.add('item-disable');
				if (this.showHeadFoot) {
					this.headfoot[0].classList.add('item-disable');
				}
			}
			if (val == this.pages) {
				// 最后一页就显示禁止的图标
				domList[domList.length - 1].classList.add('item-disable');
				if (this.showHeadFoot) {
					this.headfoot[1].classList.add('item-disable');
				}
			}
		},
		moveDom: function(val, oneDomNumber) {
			var domList = this.domList;
			var showDomList = this.showDomList;
			var cha = val - oneDomNumber;
			var moves = 0;
			if (cha > 5) {
				moves = cha - 5; //首部移除几个
				// 最后一个元素后面还有几个元素
				var showlastnum = Number(showDomList[showDomList.length - 2].innerHTML);
				var afters = this.pages - showlastnum;
				// console.log(afters, moves)
				if (afters > 0 && moves > 0) {
					// 需要移动的dom数量，并且是存在这么多数量
					var howmany = Math.min(afters, moves);
					for (var i = 0; i < howmany; i++) {
						showDomList.splice(showDomList.length - 1, 0, domList[showlastnum + i + 1]);
						this.parentNode.insertBefore(domList[showlastnum + i + 1], showDomList[showDomList.length - 1]);
						this.parentNode.removeChild(showDomList[i + 1]);
					}
					showDomList.splice(1, howmany);
				}
			}
			if (cha <= 5 && oneDomNumber != 1) {
				if (val <= 5) {
					moves = oneDomNumber - 1;
				} else {
					moves = 5 - cha;
				}
				// 移动几个dom
				var howmany = moves;
				for (var i = 0; i < howmany; i++) {
					this.parentNode.insertBefore(domList[oneDomNumber - i - 1], showDomList[1]);
					this.parentNode.removeChild(showDomList[showDomList.length - 2 - i]);
					showDomList.splice(1, 0, domList[oneDomNumber - i - 1]);
				}
				showDomList.splice(showDomList.length - 1 - howmany, howmany);
				// console.log('往前移动' + moves);
			}
			oneDomNumber = Number(showDomList[1].innerHTML);
			return oneDomNumber;
		},
		// 数据总条数变化
		watcherNums: function() {
			var val = this.nums;
			Object.defineProperty(this, 'nums', {
				enumerable: true,
				configrable: false,
				set: function(v) {
					if (typeof v !== 'number' || isNaN(v)) {
						return console.error("不是数字");
					}
					if (v <= 0 || val === v) {
						return;
					}
					val = v;
					this.setPages();
				},
				get: function() {
					return val;
				}
			})
		},
		watcherCounts: function() {
			var val = this.counts;
			Object.defineProperty(this, 'counts', {
				enumerable: true,
				configrable: false,
				set: function(v) {
					if (typeof v !== 'number' || isNaN(v)) {
						return console.error("不是数字");
					}
					if (v <= 0 || val === v) {
						return;
					}
					val = v;
					this.setPages();
				},
				get: function() {
					return val;
				}
			})
		},
		watcherPages: function() {
			var val = this.pages;
			Object.defineProperty(this, 'pages', {
				enumerable: true,
				configrable: false,
				set: function(v) {
					if (typeof v !== 'number' || isNaN(v)) {
						return console.error("不是数字");
					}
					if (v <= 0 || val === v) {
						return;
					}
					val = v;
					if (this.currect > val) {
						this.currect = val;
					}
					this.createDom();
					this.showDom();
					this.addDom();
					this.reanderHeadFoot();
					this.showNowAndAllPageDom.allPages.innerText = val;
				},
				get: function() {
					return val;
				}
			});
		},
		watcherCurrect: function() {
			var val = this.defaultPage;
			var domList = this.domList;
			var showDomList = this.showDomList;
			var oneDomNumber = Number(showDomList[1].innerHTML);
			Object.defineProperty(this, 'currect', {
				enumerable: true,
				configrable: false,
				set: function(v) {
					domList = this.domList;
					domList[val].classList.remove('active');
					val = v;
					// 执行用户自定义事件
					this.clickEvent(val, this);
					// 更新输入框中的值，当前第几页的值
					this.updateCurrectAndOrderBox(val);
					// 更新pages的dom，不变的保留，改变的添加和删除，没有直接更新覆盖，重用了相同的dom
					oneDomNumber = this.moveDom(val, oneDomNumber);
					// 当前选择页激活
					this.activeCurrectItem(val);
				},
				get: function() {
					return val;
				}
			})
		}
	}
	Page.prototype.constructor = Page;
	if (typeof noGlobal === "undefined") {
		window.Page = Page;
	}
	return Page;
})
