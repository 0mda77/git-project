-- Assignment 4 - Part 3, Questions 14, 15, 16
-- Run as a MySQL admin (e.g. root).

-- 14. Create store_manager and grant SELECT, INSERT, UPDATE on all tables in retail_store
CREATE USER IF NOT EXISTS 'store_manager'@'%' IDENTIFIED BY 'ChangeMe123!';
GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'%';
FLUSH PRIVILEGES;

-- 15. Revoke UPDATE permission from store_manager
REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'%';
FLUSH PRIVILEGES;

-- 16. Grant DELETE permission to store_manager only on the Sales table
GRANT DELETE ON retail_store.Sales TO 'store_manager'@'%';
FLUSH PRIVILEGES;

-- Verify:
-- SHOW GRANTS FOR 'store_manager'@'%';
