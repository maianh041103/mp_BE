const models = require('../../../database/models/index');
const discountContant = require('./discountContant');
const { HttpStatusCode } = require('../../helpers/errorCodes');

const discountAttributes = [
    "id",
    "code",
    "name",
    "status",
    "note",
    "target",
    "type",
    "isMultiple",
    "createdAt",
    "updatedAt",
    "deletedAt"
];

const discountIncludes = [
    {
        model: models.DiscountItem,
        as: "discountItem",
        attributes: ["id", "orderFrom", "fromQuantity", "maxQuantity", "discountValue", "discountType", "pointType", "isGift", "pointValue"]
    },
    {
        model: models.DiscountTime,
        as: "discountTime",
        attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthDay"]
    },
    {
        model: models.DiscountBranch,
        as: "discountBranch",
        attributes: ["branchId"]
    },
    {
        model: models.DiscountCustomer,
        as: "discountCustomer",
        attributes: ["customerId"]
    }
]

const generateDiscountCode = (id) => {
    // Chuyển id thành chuỗi
    const idString = id.toString();
    // Điền đầy bằng số 0 để đạt tổng cộng 9 chữ số
    const paddedId = idString.padStart(9, '0');
    // Thêm tiền tố "KM"
    const result = `KM${paddedId}`;
    return result;
}

const checkExistsCode = async (code) => {
    const discount = await models.Discount.findOne({
        where: {
            code: code
        }
    });
    if (discount)
        return true;
    return false;
}

module.exports.create = async (discount, loginUser) => {
    //Check mã code
    if (discount.code != "" && (await checkExistsCode(discount.code))) {
        return {
            error: true,
            status: HttpStatusCode.BAD_REQUEST,
            message: `Mã code ${discount.code} đã tồn tại`
        }
    }

    //Tạo bảng discount
    const { code, name, status, note, target, type, isMultiple, createdAt } = discount;
    const newDiscount = await models.Discount.create({
        code, name, status, note, target, type, isMultiple, createdAt
    })

    const newDiscountId = newDiscount.id;

    //Update code
    if (discount.code == "") {
        await newDiscount.update(
            { code: generateDiscountCode(newDiscount.id) },
            { where: { id: newDiscountId } })
    }

    //Thêm bảng discount item
    const { items } = discount || [];
    for (const item of items) {
        const orderFrom = (item.condition.order || {}).from;
        const fromQuantity = (item.condition.product || {}).from;
        const maxQuantity = (item.apply || {}).maxQuantity;
        const discountValue = (item.apply || {}).discountValue;
        const discountType = (item.apply || {}).discountType;
        const pointType = (item.apply || {}).pointType;
        const isGift = (item.apply || {}).isGift;
        const pointValue = (item.apply || {}).pointValue;
        const changeType = (item.apply || {}).changeType;
        const fixedPrice = (item.apply || {}).fixedPrice;

        const newDiscountItem = await models.DiscountItem.create({
            discountId: newDiscountId,
            orderFrom, fromQuantity, maxQuantity, discountValue,
            discountType, pointType, isGift, pointValue,
            changeType, fixedPrice
        });

        const productCondition = (item.condition || {}).productId || [];
        const groupCondition = (item.condition || {}).groupId || [];
        const productApply = (item.apply || {}).productId || [];
        const groupApply = (item.apply || {}).groupId || [];
        if (productCondition) {
            for (const item of productCondition) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    productId: item,
                    isCondition: true
                });
            }
        }

        if (groupCondition) {
            for (const item of groupCondition) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    groupId: item,
                    isCondition: true
                });
            }
        }

        if (productApply) {
            for (const item of productApply) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    productId: item,
                    isCondition: false
                });
            }
        }

        if (groupApply) {
            for (const item of groupApply) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    groupId: item,
                    isCondition: false
                });
            }
        }
    }

    //Thêm vào bảng discount time
    const { time } = discount || {};
    let { dateFrom, dateTo, byDay, byMonth, byHour, byWeekDay, isWarning, isBirthday } = time;
    if (byDay) {
        byDay = byDay.join("//");
        byHour = byHour.join("//");
        byMonth = byMonth.join("//");
        byWeekDay = byWeekDay.join("//")
    }

    await models.DiscountTime.create({
        discountId: newDiscountId,
        dateFrom, dateTo, byDay, byMonth,
        byHour, byWeekDay, isWarning, isBirthday
    });

    //Thêm vào bảng discountBranch
    const { branch, customer } = discount.scope || {};
    if (branch) {
        let { isAll, ids } = branch;
        if (isAll == true) {
            //Tìm tất cả branch thuộc cùng 1 storeId
            let objectIds = await models.Branch.findAll({
                where: {
                    storeId: loginUser.storeId
                },
                attributes: ["id"],
                raw: true
            });

            ids = objectIds.map((item, index) => {
                return item.id
            })

        }
        for (const id of ids) {
            await models.DiscountBranch.create({
                discountId: newDiscountId,
                branchId: id
            });
        }
    }

    //Thêm vào bảng discountCustomer
    if (customer) {
        let { isAll, ids } = customer;
        if (isAll == true) {
            //Tạo tất cả customer thuộc 1 storeId
            let objectIds = await models.Customer.findAll({
                where: {
                    storeId: loginUser.storeId
                },
                attributes: ["id"],
                raw: true
            });

            ids = objectIds.map((item, index) => item.id)
        }
        for (const id of ids) {
            await models.DiscountCustomer.create({
                discountId: newDiscountId,
                customerId: id
            });
        }
    }

    return {
        success: true,
        data: {
            "id": newDiscountId
        },
    }

}