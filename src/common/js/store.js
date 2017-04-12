//数据存储

export function saveToLocal(id,key,val) {
	let seller = window.localStorage._seller_;//双下滑线代表此变量为私有变量，专门存取
	if(!seller) {
		seller = {};
		seller[id] = {};//每个ID都是一个商家都有一个单独的object
	}else{
		seller = JSON.parse(seller);
		if(!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = val;
	window.localStorage._seller_ = JSON.stringify(seller);
};

// 数据读取
 
export function loadFromLocal(id,key,def) {
	let seller = window.localStorage._seller_;
	if(!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	if(!seller){
		return def;
	}
	let ret = seller[key];
	return ret || def;
};