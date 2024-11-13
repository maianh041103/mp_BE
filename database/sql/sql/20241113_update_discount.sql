ALTER TABLE discounts
ADD COLUMN isAllChannel boolean;

CREATE TABLE discount_channels(
    id int unsigned primary key auto_increment,
    discountId int unsigned not null,
    constraint fk_discount_channel_1
    foreign key (discountId) references discounts(id),
    channel enum('online', 'offline'),
    createdAt timestamp default CURRENT_TIMESTAMP not null,
	updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	deletedAt timestamp null
);