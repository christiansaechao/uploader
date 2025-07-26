CREATE TABLE conditions (
    id VARCHAR PRIMARY KEY, -- eBay conditionId (e.g., "1000")
    condition_enum VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT
);

-- ================================
-- CATEGORIES
-- ================================
CREATE TABLE categories (
    id VARCHAR PRIMARY KEY, -- eBay categoryId
    name VARCHAR NOT NULL,
    category_tree_id VARCHAR,
    parent_id VARCHAR REFERENCES categories(id),
    leaf BOOLEAN DEFAULT FALSE
);

-- ================================
-- INVENTORY ITEMS
-- ================================
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sku VARCHAR UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    condition_id VARCHAR REFERENCES conditions(id),
    brand TEXT,
    mpn TEXT,
    upc TEXT,
    image_urls TEXT[],
    package_weight_oz NUMERIC,
    package_dimensions JSONB,
    availability JSONB, -- { quantity: number, shipToLocationAvailability: object }
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- OFFERS
-- ================================
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    ebay_offer_id VARCHAR,
    marketplace_id VARCHAR,
    format VARCHAR CHECK (format IN ('FIXED_PRICE', 'AUCTION')),
    category_id VARCHAR REFERENCES categories(id),
    price NUMERIC NOT NULL,
    quantity_limit INTEGER,
    shipping_options JSONB,
    listing_description TEXT,
    status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ended')),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Indexes (Optional but Recommended)
-- ================================
CREATE INDEX idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX idx_offers_user_id ON offers(user_id);
CREATE INDEX idx_connected_platforms_user_id ON connected_platforms(user_id);
