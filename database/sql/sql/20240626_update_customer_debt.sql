-- update table customer_debts
ALTER TABLE customer_debts
DROP FOREIGN KEY customer_debts_ibfk_1;
ALTER TABLE customer_debts
DROP COLUMN transactionId;