create table type_cash_books(
    id int unsigned auto_increment primary key,
    name nvarchar(255) not null,
    description nvarchar(255) null,
    storeId int unsigned not null,
	constraint fk_type_cash_books
		foreign key (storeId) references stores(id),
	createdAt timestamp default CURRENT_TIMESTAMP not null,
	updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	deletedAt timestamp null
)
charset=utf8mb3;
create index storeId
	on type_cash_books (storeId);

create table user_cash_books(
    id int unsigned auto_increment primary key,
    name nvarchar(255) not null,
    phone nvarchar(15) null,
    address nvarchar(255) null,
    wardId int unsigned null,
    districtId int unsigned null,
    provinceId int unsigned null,
    note nvarchar(255) null,
    storeId int unsigned not null,
	constraint fk_user_cash_books
		foreign key (storeId) references stores(id),
	createdAt timestamp default CURRENT_TIMESTAMP not null,
	updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	deletedAt timestamp null
)
charset=utf8mb3;
create index storeId
	on user_cash_books (storeId);


create table cash_books(
    id int unsigned auto_increment primary key,
    ballotType enum('expenses','income') default 'expenses' not null,
    code nvarchar(15) not null,
    timeCreate timestamp null,
    typeId int unsigned not null,
    constraint fk_cash_books_1
		foreign key (typeId) references type_cash_books(id),
    value int unsigned not null,
    userId int unsigned not null,
    constraint fk_cash_books_2
		foreign key (userId) references users(id),
    object enum('customer','other','shipper','supplier','user') default 'other' not null,
    peopleId int unsigned not null,
    constraint fk_cash_books_3
		foreign key (peopleId) references user_cash_books(id),
    note nvarchar(255) null,
    isDebt boolean not null default true,
    branchId int unsigned not null,
    constraint fk_cash_books_4
		foreign key (branchId) references branches(id),
    createdAt timestamp default CURRENT_TIMESTAMP not null,
	updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	deletedAt timestamp null
)
charset=utf8mb3;
create index typeId
	on cash_books (typeId);
create index userId
	on cash_books (userId);
create index peopleId
	on cash_books (peopleId);
create index branchId
	on cash_books (branchId);    