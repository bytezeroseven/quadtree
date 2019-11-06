

let MAX_ITEMS = 5;
let MAX_LEVEL = 10;

function containsPoint(rect, x, y) {

	return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;

}

function isColliding(rect1, rect2) {

	return rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width && rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height;

}

function removeFromQt(item) {

	let node = item._node;
	let i = node.items.indexOf(item);

	if (i > -1) {

		node.items.splice(i, 1);
		item._node = null;

		if (node.parent) {
			
			let items = [];
			
			node.parent.query(node.parent, item => items.push(item));

			node.parent.clear();

			for (let i = 0; i < items.length; i++) node.parent.insert(items[i]);

		}

	}

}

function updateQtItem(qt, item) {

	removeFromQt(item);
	qt.insert(item);

}

class QT {

	constructor(x, y, width, height, parent) {

		this.x = x;

		this.y = y;

		this.width = width;

		this.height = height;

		this.nodes = [];

		this.items = [];

		this.parent = parent;

	}

	getNode(x, y) {

		return x < this.x + this.width / 2 ? (y < this.y + this.height / 2 ? 0 : 2) : (y < this.y + this.height / 2 ? 1 : 3);

	}

	divide() {

		let w = this.width / 2;

		let h = this.height / 2;

		let x = this.x;
		let y = this.y;

		this.nodes[0] = new QT(x, y, w, h, this);

		this.nodes[1] = new QT(x+w, y, w, h, this);

		this.nodes[2] = new QT(x, y+h, w, h, this);

		this.nodes[3] = new QT(x+w, y+h, w, h, this);

		let a = this.items;

		this.items = [];

		for (let i = 0; i < a.length; i++) this.insert(a[i]);

	}

	insert(item) {

		if (containsPoint(this, item.x, item.y) == false) return false;

		if (this.nodes.length > 0) this.nodes[this.getNode(item.x, item.y)].insert(item);
		else {

			if (this.items.length < MAX_ITEMS) {

				item._node = this;

				this.items.push(item);

			} else {

				this.divide();

				this.nodes[this.getNode(item.x, item.y)].insert(item);

			}
				
		}

	}

	query(range, cb) {

		if (isColliding(range, this)) {

			for (let i = 0; i < this.items.length; i++) {

				let x = this.items[i].x;
				let y = this.items[i].y;

				if (containsPoint(range, x, y)) cb(this.items[i]);

			}

			if (this.nodes.length > 0) {

				for (let i = 0; i < this.nodes.length; i++) this.nodes[i].query(range, cb);

			}

		}


	}

	query2(x, y, cb) {

		if (this.nodes.length > 0) {

			this.nodes[this.getNode(x, y)].query2(x, y, cb);

		} else {
			
			for (let i = 0; i < this.items.length; i++) cb(this.items[i]);

		}

	}

	clear() {

		for (let i = 0; i < this.nodes.length; i++) this.nodes[i].clear();

		this.items.length = 0;
		this.nodes.length = 0;

	}

	draw(ctx) {

		ctx.lineWidth = 1;
		ctx.strokeStyle = "#222";
		ctx.strokeRect(this.x, this.y, this.width, this.height);

		if (this.nodes.length > 0) {
			for (let i = 0; i < 4; i++) this.nodes[i].draw(ctx);
		} else {
			for (let i = 0; i < this.items.length; i++) (
				ctx.beginPath(),
				ctx.arc(this.items[i].x, this.items[i].y, 2, 0, Math.PI * 2), 
				ctx.closePath(),
				ctx.stroke());
		}

	}

}


let qt = new QT(100, 100, 1000, 500);

for (let i = 0; i < 1000; i++) {

	qt.insert({ x: Math.random() * 1000 + 100, y: Math.random() * 500 + 100 });

}


