/*
  # Seed Initial Data for Billboard Guardian+

  1. Sample Data
    - Create sample badges for gamification
    - Create sample challenges for user engagement
    - Create sample billboards for testing

  2. Initial Configuration
    - Set up default badge system
    - Create active challenges
    - Add sample compliant billboards
*/

-- Insert default badges
INSERT INTO badges (name, description, icon, points_required) VALUES
  ('Early Detector', 'Report your first billboard violation', 'shield', 0),
  ('Sharp Eye', 'Report 5 billboard violations', 'eye', 100),
  ('Compliance Champion', 'Achieve 95% accuracy rating', 'award', 500),
  ('City Guardian', 'Report 50 billboard violations', 'trophy', 1000),
  ('Perfect Week', 'Complete a weekly challenge', 'target', 200),
  ('Tech Savvy', 'Use QR code scanning feature', 'qr-code', 50),
  ('Detail Oriented', 'Provide detailed violation descriptions', 'file-text', 150),
  ('Community Leader', 'Help verify 10 violations', 'users', 750)
ON CONFLICT (name) DO NOTHING;

-- Insert sample challenges
INSERT INTO challenges (title, description, target, points_reward, expires_at, type) VALUES
  (
    'Weekly Reporter',
    'Report 5 billboard violations this week',
    5,
    100,
    (now() + interval '7 days'),
    'weekly'
  ),
  (
    'Accuracy Master',
    'Maintain 90% accuracy for 10 consecutive reports',
    10,
    250,
    (now() + interval '14 days'),
    'weekly'
  ),
  (
    'City Explorer',
    'Report violations in 3 different neighborhoods',
    3,
    150,
    (now() + interval '30 days'),
    'monthly'
  ),
  (
    'Quality Inspector',
    'Have 5 of your reports verified by officials',
    5,
    200,
    (now() + interval '21 days'),
    'monthly'
  )
ON CONFLICT (title) DO NOTHING;

-- Insert sample compliant billboards for reference
INSERT INTO billboards (latitude, longitude, address, permit_number, width, height, status) VALUES
  (40.7128, -74.0060, '123 Main St, New York, NY', 'PRM-2024-001', 14.0, 48.0, 'compliant'),
  (40.7580, -73.9855, '456 Broadway, New York, NY', 'PRM-2024-002', 10.0, 22.0, 'compliant'),
  (40.7505, -73.9934, '789 Fifth Ave, New York, NY', 'PRM-2024-003', 12.0, 24.0, 'compliant'),
  (40.7282, -73.7949, '321 Queens Blvd, Queens, NY', 'PRM-2024-004', 8.0, 16.0, 'compliant')
ON CONFLICT (permit_number) DO NOTHING;