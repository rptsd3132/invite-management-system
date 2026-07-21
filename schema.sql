
-- Invite Management System - Core Database Schema


-- 1. EXTENSIONS & CUSTOM TYPES
-- ------------------------------------------------------------------------------
-- Enable UUID extension for secure, unguessable identifiers (prevents IDOR attacks)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create an ENUM type for strict Role-Based Access Control validation
CREATE TYPE user_role AS ENUM ('admin', 'organizer');


-- 2. TABLES
-- ------------------------------------------------------------------------------

-- USERS TABLE: Stores registered system users (organizers and admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'organizer' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TEMPLATES TABLE: Stores the predefined invitation designs
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'Wedding', 'Hackathon', 'Book Publishing'
    thumbnail_url VARCHAR(255),
    design_schema JSONB NOT NULL,  -- Stores the dynamic React layout configuration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EVENTS TABLE: Stores specific events created by an organizer
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE RESTRICT,
    event_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PARTICIPANTS TABLE: Stores the guest list and individual invitation tracking
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    unique_link_token UUID UNIQUE DEFAULT uuid_generate_v4(),
    rsvp_status VARCHAR(20) DEFAULT 'pending', -- Expected: pending, attending, declined
    viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 3. INDEXES
-- ------------------------------------------------------------------------------
-- Optimizes queries filtering events by a specific user
CREATE INDEX idx_events_user_id ON events(user_id);

-- Optimizes queries loading all guests for a specific event
CREATE INDEX idx_participants_event_id ON participants(event_id);

-- Optimizes the public endpoint that fetches an invitation via the unique URL token
CREATE INDEX idx_participants_token ON participants(unique_link_token);


-- 4. OPTIONAL: ADMIN ANALYTICS VIEW
-- ------------------------------------------------------------------------------
-- Creates a virtual table (view) to efficiently power the Admin Dashboard stats
-- without needing to write this complex JOIN logic in the application code.
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    u.id AS user_id,
    u.email AS user_email,
    u.created_at AS joined_date,
    COUNT(DISTINCT e.id) AS total_events_created,
    COUNT(p.id) AS total_invitations_generated
FROM 
    users u
LEFT JOIN 
    events e ON u.id = e.user_id
LEFT JOIN 
    participants p ON e.id = p.event_id
WHERE 
    u.role = 'organizer'
GROUP BY 
    u.id, u.email, u.created_at;