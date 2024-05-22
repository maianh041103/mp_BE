create table discounts
(
	id int unsigned auto_increment
		primary key,
	code varchar(255) not null,
    name varchar(255) not null,
	status enum('active','inactive') default 'active' not null,
	note varchar(255) null,
    target enum('order','product') default 'order' not null,
    type enum('order_price','product_price','gift','loyalty','price_by_buy_number') default 'order_price' not null,
    isMultiple bool default true,
	createdAt timestamp default CURRENT_TIMESTAMP not null,
	updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	deletedAt timestamp null
)
charset=utf8mb3;


create table discount_branches(
    id int unsigned auto_increment
		primary key,
    discountId int unsigned not null,
	branchId int unsigned not null,
	constraint discountBranch_ibfk_1
		foreign key (discountId) references discounts(id),
	constraint discountBranch_ibfk_2
		foreign key (branchId) references branches(id)
)
charset=utf8mb3;
create index branchId
	on discount_branches (branchId);
create index discountId
	on discount_branches (discountId);


create table discount_customers(
    id int unsigned auto_increment
		primary key,
    discountId int unsigned not null,
	customerId int unsigned not null,
	constraint discountCustomer_ibfk_1
		foreign key (discountId) references discounts(id),
	constraint discountCustomer_ibfk_2
		foreign key (customerId) references customers(id)
)
charset=utf8mb3;
create index customerId
	on discount_customers (customerId);
create index discountId
	on discount_customers (discountId);



create table discount_items(
    id int unsigned auto_increment
		primary key,
    discountId int unsigned null,
	orderFrom int unsigned null,
    fromQuantity int unsigned null,
    maxQuantity int unsigned null,
    discountValue int unsigned null,
    discountType enum('amount','percent') null,
    pointType enum('amount','percent') null,
    isGift bool default false null,
    pointValue int unsigned null,
	fixedPrice int unsigned null,
	changeType enum('type_discount','type_price') null,
	constraint discountItem_ibfk_1
		foreign key (discountId) references discounts(id)
)
charset=utf8mb3;
create index discountId
	on discount_items (discountId);



create table discount_times(
    id int unsigned auto_increment
		primary key,
    discountId int unsigned null,
	dateFrom date not null,
    dateTo date not null,
    byDay nvarchar(255) null,
    byMonth nvarchar(255) null,
    byHour nvarchar(255) null,
    byWeekDay nvarchar(255) null,
    isWarning bool default false null,
    isBirthday bool default false null,
	constraint discountTime_ibfk_1
		foreign key (discountId) references discounts(id)
)
charset=utf8mb3;
create index discountId
	on discount_times (discountId);



create table product_discount_items(
    id int unsigned auto_increment
		primary key,
    discountItemId int unsigned not null,
	productId int unsigned null,
    groupId int unsigned null,
    isCondition bool default true,
	constraint productDiscountItem_ibfk_1
		foreign key (discountItemId) references discount_items(id)
)
charset=utf8mb3;
create index discountItemId
	on product_discount_items(discountItemId);