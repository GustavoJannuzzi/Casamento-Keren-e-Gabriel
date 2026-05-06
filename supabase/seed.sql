-- ============================================================
-- Seed — Dados de Exemplo Casamento Keren & Gabriel
-- ============================================================

-- Padrinhos
INSERT INTO padrinhos (nome, titulo, ordem) VALUES
  ('Pedro Alves',      'Padrinho de Honra', 1),
  ('Lucas Ferreira',   'Padrinho',          2),
  ('Rafael Costa',     'Padrinho',          3),
  ('Ana Paula',        'Madrinha de Honra', 4),
  ('Camila Oliveira',  'Madrinha',          5),
  ('Juliana Santos',   'Madrinha',          6);

-- Presentes
INSERT INTO presentes (nome, descricao, preco, categoria, status) VALUES
  (
    'Jogo de Panelas Tramontina',
    'Conjunto 7 peças inox com tampa de vidro, ideal para o dia a dia.',
    480.00, 'cozinha', 'disponivel'
  ),
  (
    'Geladeira Frost Free',
    '450L, 2 portas, acabamento em inox, eficiência energética A.',
    2800.00, 'eletrodomesticos', 'disponivel'
  ),
  (
    'Jogo de Cama King Percal 400 fios',
    'Inclui lençol com elástico, lençol avulso, 4 fronhas. 100% algodão.',
    620.00, 'cama-banho', 'disponivel'
  ),
  (
    'KitchenAid Stand Mixer',
    'Batedeira planetária 4.7L, 10 velocidades, tigela de aço inox.',
    1200.00, 'cozinha', 'disponivel'
  ),
  (
    'Smart TV 55" 4K',
    'QLED, HDR10+, sistema Android TV, com suporte de parede.',
    2100.00, 'eletronicos', 'disponivel'
  ),
  (
    'Jogo de Toalhas Buddemeyer',
    '6 peças premium: 2 de banho, 2 de rosto e 2 de piso. Toque macio.',
    390.00, 'cama-banho', 'disponivel'
  ),
  (
    'Aparelho de Jantar 30 peças',
    'Porcelana branca com borda dourada. Inclui pratos, xícaras e bowls.',
    540.00, 'mesa', 'disponivel'
  ),
  (
    'Adega Climatizada',
    '12 garrafas, zona dupla de temperatura, iluminação LED interna.',
    1100.00, 'eletronicos', 'disponivel'
  ),
  (
    'Lua de Mel ✈️',
    'Contribua com qualquer valor para realizarmos a viagem dos nossos sonhos. Todo valor é bem-vindo e muito especial para nós!',
    NULL, 'especial', 'disponivel'
  ),
  (
    'Robô Aspirador',
    'Mapeamento a laser, conexão Wi-Fi, agenda programável, base de recarga automática.',
    1400.00, 'eletrodomesticos', 'disponivel'
  );
