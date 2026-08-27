# Retail Store API — Assignment 4, Part 3

Node.js + Express.js + MySQL (mysql2/promise) RESTful API for products, suppliers, and sales.

**Author:** Mohamed Emad Eldin Asaad — 01097191995

## Setup

```bash
npm install
cp .env.example .env      # then edit DB_PASSWORD, etc.
npm start                 # or: npm run dev (with nodemon)
```

On startup the server automatically creates the `retail_store` database (if missing) and the
`Products`, `Suppliers`, `Sales` tables with their PK/FK relationships (Task 1).

## Endpoint reference

### Products — `/api/products`
| Method | Path | Description |
|---|---|---|
| POST | `/` | Create a product |
| GET | `/` | Retrieve all products |
| GET | `/:id` | Retrieve a product by ID |
| PUT | `/:id` | Update a product |
| DELETE | `/:id` | Delete a product |
| POST | `/schema/add-category` | Add `Category` column |
| DELETE | `/schema/remove-category` | Drop `Category` column |
| POST | `/schema/productname-not-null` | Add `NOT NULL` to `ProductName` |
| PUT | `/by-name/bread-price` | Set Bread's price to 25.00 (Task 7) |
| DELETE | `/by-name/eggs` | Delete the Eggs product (Task 8) |

### Suppliers — `/api/suppliers`
| Method | Path | Description |
|---|---|---|
| POST | `/` | Create a supplier |
| GET | `/` | Retrieve all suppliers |
| PUT | `/:id` | Update supplier info |
| DELETE | `/:id` | Delete a supplier |
| POST | `/schema/contactnumber-varchar15` | Change `ContactNumber` to `VARCHAR(15)` |
| GET | `/reports/starts-with-f` | Suppliers whose names start with 'F' (Task 11) |

### Sales — `/api/sales`
| Method | Path | Description |
|---|---|---|
| POST | `/` | Record a sale |
| GET | `/` | Retrieve all sales |
| GET | `/product/:productId` | Sales for a specific product |

### Reports — `/api/reports`
| Method | Path | Description |
|---|---|---|
| GET | `/quantity-sold` | Total quantity sold per product (Task 9) |
| GET | `/highest-stock` | Product with the highest stock quantity (Task 10) |
| GET | `/never-sold` | Products that have never been sold (Task 12) |
| GET | `/sales-detail` | All sales joined with product name & sale date (Task 13) |
| POST | `/seed` | Inserts FreshFoods + Milk/Bread/Eggs + the Milk sale (Task 6) |

### Admin — `/api/admin`  (requires header `x-admin-key: <ADMIN_KEY from .env>`)
| Method | Path | Description |
|---|---|---|
| POST | `/create-store-manager` | Creates `store_manager` MySQL user, grants SELECT/INSERT/UPDATE on all tables (Task 14) |
| POST | `/revoke-update` | Revokes UPDATE from `store_manager` (Task 15) |
| POST | `/grant-delete-sales` | Grants DELETE to `store_manager`, Sales table only (Task 16) |

Equivalent raw SQL for Tasks 6, 7, 8, 14, 15, 16 is also provided in `sql/schema_and_seed.sql`
and `sql/store_manager_user.sql`, in case you prefer running them directly in MySQL Workbench /
the `mysql` CLI instead of calling the API.

## Suggested test order

1. `npm start` → tables get created automatically.
2. `POST /api/reports/seed` → inserts FreshFoods, Milk/Bread/Eggs, and the Milk sale.
3. `PUT /api/products/by-name/bread-price` → Bread price becomes 25.00.
4. `DELETE /api/products/by-name/eggs` → Eggs removed.
5. Try the reporting endpoints under `/api/reports`.
6. Try the admin endpoints under `/api/admin` with the `x-admin-key` header.

## Bonus

`bonus.txt` contains the submitted LeetCode solution for
"Customers Who Visited but Did Not Make Any Transactions".
