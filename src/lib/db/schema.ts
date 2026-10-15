import { pgTable, text, timestamp, integer, numeric, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["admin", "barista"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "card", "qr_code"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["completed", "pending", "cancelled"]);
export const inventoryStatusEnum = pgEnum("inventory_status", ["in_stock", "low_stock", "out_of_stock"]);
export const productTypeEnum = pgEnum("product_type", ["menu", "retail", "raw_material"]);

// --- Better Auth Tables ---

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	role: roleEnum("role").notNull().default("barista"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
	id: uuid("id").primaryKey().defaultRandom(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: uuid("id").primaryKey().defaultRandom(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
	id: uuid("id").primaryKey().defaultRandom(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Core POS Entities ---

export const products = pgTable("products", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	price: numeric("price", { precision: 12, scale: 2 }).notNull(),
	category: text("category").notNull(),
	type: productTypeEnum("type").notNull().default("menu"),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inventory = pgTable("inventory", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	currentStock: integer("current_stock").notNull().default(0),
	unit: text("unit").notNull(), // e.g., grams, pieces, liters
	supplier: text("supplier"),
	status: inventoryStatusEnum("status").notNull().default("in_stock"),
	lastRestocked: timestamp("last_restocked"),
});

export const transactions = pgTable("transactions", {
	id: uuid("id").primaryKey().defaultRandom(),
	cashierId: uuid("cashier_id").notNull().references(() => user.id),
	totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
	paymentMethod: paymentMethodEnum("payment_method").notNull(),
	status: transactionStatusEnum("status").notNull().default("completed"),
	customerName: text("customer_name"),
	tableNumber: text("table_number"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionItems = pgTable("transaction_items", {
	id: uuid("id").primaryKey().defaultRandom(),
	transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
	productId: uuid("product_id").notNull().references(() => products.id),
	quantity: integer("quantity").notNull(),
	priceAtTime: numeric("price_at_time", { precision: 12, scale: 2 }).notNull(),
});

// Recipe Ingredients — maps a menu product to raw_material products
export const recipeIngredients = pgTable("recipe_ingredients", {
	id: uuid("id").primaryKey().defaultRandom(),
	menuProductId: uuid("menu_product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	rawMaterialId: uuid("raw_material_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	quantityNeeded: numeric("quantity_needed", { precision: 10, scale: 2 }).notNull().default("1"),
	unit: text("unit").notNull().default("pcs"),
});

// --- Relations ---

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	transactions: many(transactions),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	inventory: one(inventory, { fields: [products.id], references: [inventory.productId] }),
	transactionItems: many(transactionItems),
	recipesAsMenu: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
	menuProduct: one(products, { fields: [recipeIngredients.menuProductId], references: [products.id] }),
	rawMaterial: one(products, { fields: [recipeIngredients.rawMaterialId], references: [products.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
	product: one(products, { fields: [inventory.productId], references: [products.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
	cashier: one(user, { fields: [transactions.cashierId], references: [user.id] }),
	items: many(transactionItems),
}));

export const transactionItemsRelations = relations(transactionItems, ({ one }) => ({
	transaction: one(transactions, { fields: [transactionItems.transactionId], references: [transactions.id] }),
	product: one(products, { fields: [transactionItems.productId], references: [products.id] }),
}));
